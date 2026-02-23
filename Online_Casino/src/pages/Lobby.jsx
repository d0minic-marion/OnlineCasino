import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import { claimDailyBonus } from "../services/wallet";
import "./lobby.css";

export default function Lobby() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [balance, setBalance] = useState(0);
  const [profileName, setProfileName] = useState(user?.displayName || "Profil");

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!user) return;
    setProfileName(user.displayName || "Profil");

    const ref = doc(db, "users", user.uid);
    return onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      setBalance(data.balance ?? 0);
    });
  }, [user]);

  async function handleDailyBonus() {
    try {
      if (!user) return;
      const res = await claimDailyBonus(user.uid);
      if (!res.ok) alert(res.reason);
      else alert("Bonus quotidien +500 jetons !");
    } catch (e) {
      console.error(e);
      alert("Erreur: impossible de réclamer le bonus.");
    }
  }

  async function handleLogout() {
    try {
      setMenuOpen(false);
      await signOut(auth);
      navigate("/", { replace: true });
    } catch (e) {
      console.error(e);
      alert("Erreur: impossible de se déconnecter.");
    }
  }

  const games = [
    {
      id: "roulette-eu",
      title: "Roulette européenne (0)",
      desc: "Une seule case 0. Table classique, mises rapides.",
      meta: ["0", "Rouge/Noir", "Pair/Impair", "Douzaines"],
      badge: "0",
      cta: "Jouer",
      onClick: () => alert("À brancher: page Roulette (0)"),
    },
    {
      id: "roulette-us",
      title: "Roulette américaine (00)",
      desc: "Double 00. Version casino US, plus de volatilité.",
      meta: ["0 + 00", "2:1 colonnes", "1–18/19–36", "Even/Odd"],
      badge: "00",
      cta: "Jouer",
      onClick: () => alert("À brancher: page Roulette (00)"),
    },
    {
      id: "slots-classic",
      title: "Slots Classic (6×3)",
      desc: "Machine classique 6 colonnes × 3 lignes. Paylines simples.",
      meta: ["6×3", "WILD", "Auto-play", "Paylines"],
      badge: "Slots",
      cta: "Jouer",
      onClick: () => alert("À brancher: Slots Classic"),
    },
    {
      id: "slots-jackpot",
      title: "Slots Jackpot (6×3)",
      desc: "Mode jackpot avec gains plus rares mais plus élevés.",
      meta: ["Jackpot", "Bonus", "Multiplicateur", "WILD"],
      badge: "Jackpot",
      cta: "Jouer",
      onClick: () => alert("À brancher: Slots Jackpot"),
    },
    {
      id: "slots-quick",
      title: "Slots Quick Spin (6×3)",
      desc: "Version rapide : animations courtes, enchaînement rapide.",
      meta: ["Quick", "Auto", "Max bet", "Turbo"],
      badge: "Turbo",
      cta: "Jouer",
      onClick: () => alert("À brancher: Slots Quick Spin"),
    },
    {
      id: "blackjack",
      title: "Blackjack",
      desc: "Hit, Stand, Double. Résultats et solde en jetons.",
      meta: ["Hit", "Stand", "Double", "3:2"],
      badge: "Cartes",
      cta: "Jouer",
      onClick: () => navigate("/blackjack"),
    },
  ];

  return (
    <div className="lm9-lobby">
      <header className="lm9-topbar">
        <div className="lm9-topbar-inner">
          <div className="lm9-brand">
            <div className="lm9-logo">Lotto<span>M9</span></div>
            <div className="lm9-sub">Lobby</div>
          </div>

          <div className="lm9-topbar-right">
            <div className="lm9-balance">
              <span className="dot" />
              <div className="lbl">Solde</div>
              <div className="val">{balance.toLocaleString()} jetons</div>
            </div>

            <button
              type="button"
              className="lm9-profile-btn"
              onClick={handleDailyBonus}
              title="Réclamer le bonus quotidien"
            >
              +500 (daily)
            </button>

            <div className="lm9-profile" ref={menuRef}>
              <button
                type="button"
                className="lm9-profile-btn"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span>{profileName}</span>
                <span className="chev">▾</span>
              </button>

              {menuOpen && (
                <div className="lm9-profile-menu">
                  <button type="button" onClick={() => { setMenuOpen(false); navigate("/profil"); }}>
                    Mon profil
                  </button>
                  <button type="button" onClick={() => navigate("/historique")}>
                    Historique
                  </button>
                  <button type="button" onClick={handleLogout}>
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="lm9-lobby-main">
        <div className="lm9-lobby-head">
          <h1>Choisis un jeu</h1>
          <p>3 Slots • 2 Roulettes (0 et 00) • 1 Blackjack — jetons virtuels uniquement.</p>
        </div>

        <div className="lm9-games-grid">
          {games.map((g) => (
            <button key={g.id} type="button" className="lm9-game-card" onClick={g.onClick}>
              <div className="lm9-game-top">
                <div className="lm9-game-badge">{g.badge}</div>
                <div className="lm9-game-title">{g.title}</div>
                <div className="lm9-game-desc">{g.desc}</div>
              </div>

              <div className="lm9-game-meta">
                {g.meta.map((m) => (
                  <span key={m} className="lm9-chip">{m}</span>
                ))}
              </div>

              <div className="lm9-game-cta">
                <span className="lm9-cta-text">{g.cta}</span>
                <span className="lm9-cta-arrow">→</span>
              </div>
            </button>
          ))}
        </div>

        <div className="lm9-lobby-note">
          <b>Note :</b> Simulation éducative. Aucun argent réel et aucun gain.
        </div>
      </main>
    </div>
  );
}