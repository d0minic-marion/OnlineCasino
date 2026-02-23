import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./history.css";

function formatResultFR(result) {
  if (result === "win") return "Gagné";
  if (result === "loss") return "Perdu";
  if (result === "push") return "Push";
  if (result === "blackjack") return "Blackjack";
  return result || "-";
}

function formatGameFR(game) {
  if (game === "blackjack") return "Blackjack";
  if (game === "roulette-eu") return "Roulette (0)";
  if (game === "roulette-us") return "Roulette (00)";
  if (game?.startsWith("slots")) return "Slots";
  return game || "-";
}

export default function History() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "history");
    const q = query(ref, orderBy("createdAt", "desc"), limit(100));

    const unsub = onSnapshot(
      q,
      (snap) => {
        setLoading(false);
        setRows(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, [user]);

  const totals = useMemo(() => {
    let wins = 0, losses = 0, pushes = 0, bj = 0, net = 0;
    for (const r of rows) {
      if (r.result === "win") wins++;
      else if (r.result === "loss") losses++;
      else if (r.result === "push") pushes++;
      else if (r.result === "blackjack") bj++;
      net += Number(r.delta || 0);
    }
    return { wins, losses, pushes, bj, net };
  }, [rows]);

  if (!user) return null;

  return (
    <div className="lm9-hist">
      <header className="lm9-hist-top">
        <div className="lm9-hist-left">
          <div className="lm9-logo">Lotto<span>M9</span></div>
          <div className="sub">Historique</div>
        </div>

        <div className="lm9-hist-right">
          <button className="lm9-hist-back" onClick={() => navigate("/lobby")}>
            Retour lobby
          </button>
        </div>
      </header>

      <main className="lm9-hist-main">
        <div className="lm9-hist-head">
          <h1>Historique des parties</h1>
          <p>Dernières 100 entrées • Jetons virtuels uniquement</p>
        </div>

        <div className="lm9-hist-stats">
          <div className="card">
            <div className="k">Gagné</div>
            <div className="v">{totals.wins}</div>
          </div>
          <div className="card">
            <div className="k">Perdu</div>
            <div className="v">{totals.losses}</div>
          </div>
          <div className="card">
            <div className="k">Push</div>
            <div className="v">{totals.pushes}</div>
          </div>
          <div className="card">
            <div className="k">Blackjack</div>
            <div className="v">{totals.bj}</div>
          </div>
          <div className={`card net ${totals.net >= 0 ? "pos" : "neg"}`}>
            <div className="k">Net</div>
            <div className="v">
              {totals.net >= 0 ? "+" : ""}
              {totals.net.toLocaleString()} jetons
            </div>
          </div>
        </div>

        <div className="lm9-hist-table">
          <div className="thead">
            <div>Date</div>
            <div>Jeu</div>
            <div>Mise</div>
            <div>Résultat</div>
            <div>Delta</div>
          </div>

          {loading ? (
            <div className="empty">Chargement…</div>
          ) : rows.length === 0 ? (
            <div className="empty">Aucune partie enregistrée pour le moment.</div>
          ) : (
            rows.map((r) => {
              const ts = r.createdAt?.toDate ? r.createdAt.toDate() : null;
              const dateStr = ts
                ? ts.toLocaleString("fr-CA")
                : "—";

              const delta = Number(r.delta || 0);

              return (
                <div className="trow" key={r.id}>
                  <div className="muted">{dateStr}</div>
                  <div>{formatGameFR(r.game)}</div>
                  <div>{Number(r.bet || 0).toLocaleString()}</div>
                  <div className={`pill ${r.result}`}>{formatResultFR(r.result)}</div>
                  <div className={`delta ${delta >= 0 ? "pos" : "neg"}`}>
                    {delta >= 0 ? "+" : ""}
                    {delta.toLocaleString()}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}