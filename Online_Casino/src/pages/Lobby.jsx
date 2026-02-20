import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./lobby.css";


export default function Lobby() {
  const navigate = useNavigate();

  const balance = 12840;
  const profileName = "Profil";

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);



  const games = [
    {
      id: "roulette-eu",
      title: "Roulette européenne (0)",
      desc: "Une seule case 0. Table classique, mises rapides.",
      meta: ["0", "Rouge/Noir", "Pair/Impair", "Douzaines"],
      badge: "RTP démo",
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
      desc: "Hit, Stand, Double. Historique et résultats vérifiables.",
      meta: ["Hit", "Stand", "Double", "3:2"],
      badge: "Cartes",
      cta: "Jouer",
      onClick: () => alert("À brancher: Blackjack"),
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

              <div className="lm9-profile" ref={menuRef}>
                <button
                  type="button"
                  className="lm9-profile-btn"
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <span className="avatar">👤</span>
                  <span>{profileName}</span>
                  <span className="chev">▾</span>
                </button>

                {menuOpen && (
                  <div className="lm9-profile-menu">
                    <button type="button" onClick={() => alert("À faire: page profil")}>
                      Mon profil
                    </button>
                    <button type="button" onClick={() => alert("À faire: historique")}>
                      Historique
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await signOut(auth);
                          navigate("/", { replace: true });
                        } catch (e) {
                          console.error(e);
                          alert("Erreur lors de la déconnexion.");
                        }
                      }}
                    >
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
          <p>
            3 Slots • 2 Roulettes (0 et 00) • 1 Blackjack — jetons virtuels uniquement.
          </p>
        </div>

        <div className="lm9-games-grid">
          {games.map((g) => (
            <button
              key={g.id}
              type="button"
              className="lm9-game-card"
              onClick={g.onClick}
            >
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
          <b>Note :</b> Ceci est une simulation éducative. Aucun argent réel et aucun gain.
        </div>
      </main>
    </div>
  );
}