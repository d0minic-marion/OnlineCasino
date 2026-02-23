import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  onSnapshot,
  runTransaction,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import "./blackjack.css";

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function makeDeck() {
  const deck = [];
  for (const s of SUITS) for (const r of RANKS) deck.push({ r, s });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function handValue(hand) {
  if (!Array.isArray(hand) || hand.length === 0) return 0;

  let total = 0;
  let aces = 0;

  for (const c of hand) {
    if (!c) continue;
    if (c.r === "A") {
      total += 11;
      aces += 1;
    } else if (["J", "Q", "K"].includes(c.r)) total += 10;
    else total += parseInt(c.r, 10);
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

function isBlackjack(hand) {
  return hand.length === 2 && handValue(hand) === 21;
}

export default function Blackjack() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);

  const betOptions = useMemo(() => [25, 50, 100], []);
  const [bet, setBet] = useState(25);
  const [customBet, setCustomBet] = useState("");

  const [deck, setDeck] = useState(() => makeDeck());
  const [dealer, setDealer] = useState([]);
  const [player, setPlayer] = useState([]);

  const [inRound, setInRound] = useState(false);
  const [roundBet, setRoundBet] = useState(0);
  const [message, setMessage] = useState("Choisis une mise et démarre une partie.");
  const [resultText, setResultText] = useState("");
  const [revealDealer, setRevealDealer] = useState(false);

  const [dealPulse, setDealPulse] = useState(0);
  const [bustFx, setBustFx] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setLoadingBalance(false);
        if (!snap.exists()) {
          setBalance(0);
          return;
        }
        setBalance(snap.data()?.balance ?? 0);
      },
      () => setLoadingBalance(false)
    );

    return () => unsub();
  }, [user]);

  async function txSubtract(amount) {
    if (!user) throw new Error("not logged");
    const ref = doc(db, "users", user.uid);

    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists()) throw new Error("User doc missing");
      const current = snap.data()?.balance ?? 0;
      if (current < amount) throw new Error("Solde insuffisant");
      tx.update(ref, { balance: current - amount });
    });
  }

  async function txAdd(amount) {
    if (!user) throw new Error("not logged");
    const ref = doc(db, "users", user.uid);

    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists()) throw new Error("User doc missing");
      const current = snap.data()?.balance ?? 0;
      tx.update(ref, { balance: current + amount });
    });
  }

  async function writeHistory({ bet, result, delta }) {
    if (!user) return;
    try {
      await addDoc(collection(db, "users", user.uid, "history"), {
        game: "blackjack",
        bet,
        result,
        delta,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("Failed", e);
    }
  }

  function pulseDeal() {
    setDealPulse((p) => (p + 1) % 100000);
  }

  function resetTableOnly() {
    setDealer([]);
    setPlayer([]);
    setRevealDealer(false);
    setResultText("");
    setBustFx(false);
  }

  function applyCustomBet() {
    const v = parseInt(customBet || "0", 10);
    if (!v || v <= 0) return;
    setBet(v);
    setCustomBet("");
  }

  const playerTotal = handValue(player);

  const canHit = inRound && !revealDealer && playerTotal < 21;
  const canStand = inRound && !revealDealer;
  const canDouble = inRound && !revealDealer && player.length === 2;

  async function startNewRound() {
    try {
      if (!user) return;

      setMessage("Mise en cours...");
      setResultText("");
      setBustFx(false);

      await txSubtract(bet);

      resetTableOnly();
      setInRound(true);
      setRoundBet(bet);

      const d = makeDeck();

      const p = [d.pop(), d.pop()];
      const dl = [d.pop(), d.pop()];

      setDeck(d);
      setPlayer(p);
      setDealer(dl);
      pulseDeal();

      const pBJ = isBlackjack(p);
      const dBJ = isBlackjack(dl);

      if (pBJ || dBJ) {
        setRevealDealer(true);

        if (pBJ && dBJ) {
          await settle("push");
        } else if (pBJ) {
          await settle("blackjack");
        } else {
          await settle("loss");
        }
        return;
      }

      setMessage("À toi : Hit, Stand ou Double.");
    } catch (e) {
      console.error(e);
      setMessage(e?.message === "Solde insuffisant" ? "Solde insuffisant." : "Erreur: impossible de démarrer.");
      setInRound(false);
      setRoundBet(0);
    }
  }

  function hit() {
    if (!canHit) return;

    const d = [...deck];
    const p = [...player, d.pop()];
    setDeck(d);
    setPlayer(p);
    pulseDeal();

    const total = handValue(p);
    if (total > 21) {
      setBustFx(true);
      setMessage("Bust !");
      setRevealDealer(true);
      settle("loss");
    } else if (total === 21) {
      stand(p);
    }
  }

  function stand(playerOverride) {
    if (!canStand) return;
    setRevealDealer(true);
    dealerPlayAndSettle(undefined, playerOverride);
  }

  async function doubleDown() {
    if (!canDouble) return;

    try {
      await txSubtract(roundBet);
      const newBet = roundBet * 2;
      setRoundBet(newBet);

      const d = [...deck];
      const p = [...player, d.pop()];
      setDeck(d);
      setPlayer(p);
      pulseDeal();

      const total = handValue(p);
      if (total > 21) {
        setBustFx(true);
        setMessage("Bust !");
        setRevealDealer(true);
        await settle("loss", newBet);
        return;
      }

      setRevealDealer(true);
      await dealerPlayAndSettle(newBet);
    } catch (e) {
      console.error(e);
      setMessage(e?.message === "Solde insuffisant" ? "Solde insuffisant pour doubler." : "Erreur: double impossible.");
    }
  }

  async function dealerPlayAndSettle(betOverride, playerOverride) {
    let d = [...deck];
    let dl = [...dealer];

    while (handValue(dl) < 17) {
      dl = [...dl, d.pop()];
    }

    setDeck(d);
    setDealer(dl);
    pulseDeal();

    const finalPlayer = playerOverride ?? player;
    const pTot = handValue(finalPlayer);
    const dTot = handValue(dl);

    if (dTot > 21) {
      await settle("win", betOverride);
      return;
    }

    if (pTot > dTot) await settle("win", betOverride);
    else if (pTot < dTot) await settle("loss", betOverride);
    else await settle("push", betOverride);
  }

  async function settle(result, betOverride) {
    const b = betOverride ?? roundBet ?? bet;

    let payoutAdd = 0;
    let deltaNet = 0;

    if (result === "loss") {
      payoutAdd = 0;
      deltaNet = -b;
      setMessage("Perdu.");
      setResultText(`-${b} jetons`);
    } else if (result === "push") {
      payoutAdd = b;
      deltaNet = 0;
      setMessage("Push — mise remboursée.");
      setResultText(`+${b} jetons (remboursé)`);
    } else if (result === "win") {
      payoutAdd = 2 * b;
      deltaNet = +b;
      setMessage("Gagné ! Paiement 1:1.");
      setResultText(`+${b} jetons`);
    } else if (result === "blackjack") {
      payoutAdd = Math.round(2.5 * b);
      deltaNet = Math.round(1.5 * b);
      setMessage("Blackjack ! Paiement 3:2.");
      setResultText(`+${deltaNet} jetons`);
    }

    try {
      if (payoutAdd > 0) await txAdd(payoutAdd);

      await writeHistory({
        bet: b,
        result,
        delta: deltaNet,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setInRound(false);
    }
  }

  if (!user) return null;

  return (
    <div className={`lm9-bj ${bustFx ? "bust" : ""}`}>
      <header className="lm9-bj-top">
        <div className="lm9-bj-title">
          <div className="lm9-logo">Lotto<span>M9</span></div>
          <div className="sub">Blackjack</div>
        </div>

        <div className="lm9-bj-right">
          <div className="lm9-bj-balance">
            <span className="dot" />
            <span>Solde</span>
            <b>
              {loadingBalance ? "..." : balance.toLocaleString()} jetons
            </b>
          </div>

          <button className="lm9-bj-back" onClick={() => navigate("/lobby")}>
            Retour lobby
          </button>
        </div>
      </header>

      <main className="lm9-bj-board">
        <div className="lm9-bj-msg">{message}</div>

        <div className="lm9-bj-panels">
          <div className="lm9-bj-hand">
            <div className="head">
              <span>Dealer</span>
              <span className="tot">
                {revealDealer ? handValue(dealer) : dealer.length ? handValue([dealer[0]]) : 0}
              </span>
            </div>

            <div className={`cards pulse-${dealPulse}`}>
              {dealer.map((c, idx) => {
                const hidden = !revealDealer && idx === 1;
                return (
                  <div key={`${c.r}${c.s}${idx}`} className={`card ${hidden ? "hidden" : ""}`}>
                    {!hidden && (
                      <>
                        <div className="r">{c.r}</div>
                        <div className="s">{c.s}</div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lm9-bj-hand">
            <div className="head">
              <span>Toi</span>
              <span className="tot">{handValue(player)}</span>
            </div>

            <div className={`cards pulse-${dealPulse}`}>
              {player.map((c, idx) => (
                <div key={`${c.r}${c.s}${idx}`} className="card">
                  <div className="r">{c.r}</div>
                  <div className="s">{c.s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bj-bet" style={{ marginTop: 14 }}>
          <div className="bj-bet-head">
            <div className="bj-bet-title">Mise</div>
            <div className="bj-bet-hint">Choisis une mise ou entre un montant.</div>
          </div>

          <div className="bj-bet-row">
            <div className="bj-chips">
              {betOptions.map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`bj-chip ${bet === v ? "active" : ""}`}
                  onClick={() => setBet(v)}
                  disabled={inRound}
                >
                  {v}
                </button>
              ))}
            </div>

            <div className="bj-custom">
              <div className="bj-custom-field">
                <span className="bj-custom-prefix">✎</span>
                <input
                  className="bj-custom-input"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  placeholder="Mise perso"
                  value={customBet}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^\d]/g, "");
                    setCustomBet(cleaned);
                  }}
                  disabled={inRound}
                />
              </div>

              <button
                type="button"
                className="bj-custom-btn"
                onClick={applyCustomBet}
                disabled={inRound || !customBet}
              >
                OK
              </button>
            </div>
          </div>

          <div className="bj-bet-foot">
            Paiements: victoire 1:1 • blackjack 3:2 • push remboursé
          </div>
        </div>

        <div className="lm9-bj-actions">
          <button className="primary" onClick={startNewRound} disabled={inRound}>
            Nouvelle partie
          </button>
          <button onClick={hit} disabled={!canHit}>
            Hit
          </button>
          <button onClick={stand} disabled={!canStand}>
            Stand
          </button>
          <button onClick={doubleDown} disabled={!canDouble}>
            Double
          </button>
        </div>

        <div className="lm9-bj-payout">
          {resultText ? <>Résultat: <b>{resultText}</b></> : <span>&nbsp;</span>}
        </div>
      </main>
    </div>
  );
}