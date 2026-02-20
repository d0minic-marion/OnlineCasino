import { useState } from "react";
import "./home.css";
import rouletteGif from "../assets/roulette.gif";
import slotsGif from "../assets/slots.gif";
import blackjackGif from "../assets/blackjack.gif";
import { useNavigate } from "react-router-dom";

export default function Home() {

  const [selectedGame, setSelectedGame] = useState("roulette");
  const navigate = useNavigate();

  return (
    <div className="lm9">
      <div className="lm9-banner">
        Simulation / Educational Only — No Real Money — No Prizes
      </div>

        <header className="lm9-nav">
          <div className="lm9-nav-inner">
            <div className="lm9-brand">
              <div className="lm9-logo">Lotto<span>M9</span></div>
              <div className="lm9-sub">Demo Casino</div>
            </div>

            <nav className="lm9-links">
              <a href="#games">Games</a>
              <a href="#fairness">Fairness</a>
              <a href="#how">How it works</a>
            </nav>

            <div className="lm9-actions">
              <button
                type="button"
                className="lm9-btn lm9-btn-ghost"
                onClick={() => navigate("/connexion")}
              >
                Connexion
              </button>

              <button
                type="button"
                className="lm9-btn lm9-btn-primary"
                onClick={() => navigate("/inscription")}
              >
                Créer un compte
              </button>
            </div>
          </div>
        </header>

      <main className="lm9-main">
        <section className="lm9-hero">
          <div className="lm9-hero-left">
            <div className="lm9-pill">
              🔒 Firebase Auth • ☁️ Cloud Functions • ✅ Provably Fair
            </div>

            <h1>
              Lotto<span>M9</span> — Casino démo <br />
              pour projet scolaire
            </h1>

            <p>
              Roulette (double 00), Slots (6×3), Blackjack. Solde en jetons
              virtuels, historique des mises, et vérification d’équité avec
              WebCrypto.
            </p>

            <div className="lm9-cta">
              <button className="lm9-btn lm9-btn-primary">Play now</button>
              <button className="lm9-btn lm9-btn-ghost">Voir la preuve d’équité</button>
            </div>

            <div className="lm9-stats">
              <div className="lm9-stat">
                <div className="lm9-stat-num">3</div>
                <div className="lm9-stat-label">Jeux disponibles</div>
              </div>
              <div className="lm9-stat">
                <div className="lm9-stat-num">0$</div>
                <div className="lm9-stat-label">Argent réel</div>
              </div>
              <div className="lm9-stat">
                <div className="lm9-stat-num">SHA-256</div>
                <div className="lm9-stat-label">Vérification</div>
              </div>
            </div>
          </div>

          <div className="lm9-hero-right">
            <div className="lm9-mock">
              <div className="lm9-mock-top">
                <div className="lm9-chip">🟡 Balance: 12,840</div>
                <div className="lm9-mini">
                  <button
                    type="button"
                    className={selectedGame === "roulette" ? "active" : ""}
                    onClick={() => setSelectedGame("roulette")}
                  >
                    Roulette
                  </button>

                  <button
                    type="button"
                    className={selectedGame === "slots" ? "active" : ""}
                    onClick={() => setSelectedGame("slots")}
                  >
                    Slots
                  </button>

                  <button
                    type="button"
                    className={selectedGame === "blackjack" ? "active" : ""}
                    onClick={() => setSelectedGame("blackjack")}
                  >
                    Blackjack
                  </button>
                </div>
              </div>

              <div className="lm9-mock-body">
                <div className="lm9-card big">
                  <div className="lm9-card-title">Roulette (00)</div>
                  <div className="lm9-card-sub">Place tes jetons • Spin • Résultat</div>
                  <div className="lm9-card-badges">
                    <span>2:1</span><span>1–18</span><span>Even</span><span>Red/Black</span>
                  </div>
                </div>
                <div className="lm9-card">
                  <div className="lm9-card-title">Slots (6×3)</div>
                  <div className="lm9-card-sub">Auto-play • Max bet • Jackpot</div>
                  <div className="lm9-card-badges">
                    <span>6 reels</span><span>3 rows</span><span>WILD</span>
                  </div>
                </div>
                <div className="lm9-card">
                  <div className="lm9-card-title">Blackjack</div>
                  <div className="lm9-card-sub">Hit • Stand • Double</div>
                  <div className="lm9-card-badges">
                    <span>Deck shuffle</span><span>Nonce</span><span>HMAC</span>
                  </div>
                </div>
              </div>

              <div className="lm9-mock-bottom">
                <button className="lm9-btn lm9-btn-green">Start</button>
                <div className="lm9-proof">✅ Provably Fair</div>
              </div>
            </div>
          </div>
        </section>

        <section id="games" className="lm9-section">
          <div className="lm9-section-head">
            <h2>Choisis ton jeu</h2>
            <p>Interface moderne + gameplay simple + résultats vérifiables.</p>
          </div>

          <div className="lm9-grid">
            <GameCard
              title="Roulette (double 00)"
              desc="Table complète, mises rapides, et affichage des dernières sorties."
              tags={["00", "1–18", "Even/Odd", "2:1"]}
              btn="Play Roulette"
              gif={rouletteGif}
              onSelect={setSelectedGame}
            />

            <GameCard
              title="Slots (6×3)"
              desc="Machine 6 colonnes × 3 lignes. Animations, auto-play, paylines."
              tags={["6×3", "WILD", "Jackpot", "Auto"]}
              btn="Play Slots"
              gif={slotsGif}
              onSelect={setSelectedGame}
            />

            <GameCard
              title="Blackjack"
              desc="Deck mélangé côté serveur, actions classiques, historique."
              tags={["Hit", "Stand", "Double", "Shuffle"]}
              btn="Play Blackjack"
              gif={blackjackGif}
              onSelect={setSelectedGame}
            />
          </div>
        </section>

        <div id="rules">
          <RulesPanel selectedGame={selectedGame} />
        </div>


        <section id="fairness" className="lm9-section lm9-fair">
          <div className="lm9-fair-left">
            <h2>Provably Fair</h2>
            <p>
              Avant chaque partie, on affiche un <b>hash (SHA-256)</b> du serveur
              (commit). Après, on révèle le seed (reveal). Tu peux vérifier que
              le résultat correspond bien au seed annoncé.
            </p>

            <div className="lm9-fair-box">
              <div className="row">
                <span>Server seed hash</span>
                <code>c8f0…a91b</code>
              </div>
              <div className="row">
                <span>Client seed</span>
                <code>dominic-2026</code>
              </div>
              <div className="row">
                <span>Nonce</span>
                <code>42</code>
              </div>
              <div className="row">
                <span>Verify</span>
                <code>HMAC-SHA256(serverSeed, clientSeed:nonce)</code>
              </div>
            </div>

            <div className="lm9-cta">
              <button className="lm9-btn lm9-btn-primary">Open Fairness Panel</button>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API"
                target="_blank"
                rel="noopener noreferrer"
                className="lm9-btn lm9-btn-ghost"
              >Learn more</a>
            </div>
          </div>

          <div className="lm9-fair-right">
            <div className="lm9-steps">
              <Step n="1" t="Commit" d="On publie SHA-256(serverSeed) avant la mise." />
              <Step n="2" t="Play" d="Cloud Function calcule le résultat + incrémente le nonce." />
              <Step n="3" t="Reveal" d="On révèle le serverSeed lors du changement de seed." />
              <Step n="4" t="Verify" d="Le joueur recalcule et confirme le résultat." />
            </div>
          </div>
        </section>

        <section id="how" className="lm9-section">
          <div className="lm9-section-head">
            <h2>Comment ça fonctionne</h2>
            <p>Architecture simple: React ↔ Cloud Functions ↔ Firestore.</p>
          </div>

          <div className="lm9-flow">
            <div className="lm9-flow-box">
              <div className="lm9-flow-title">UI (React)</div>
              <div className="lm9-flow-text">Pages, composants, état du solde, affichage des jeux.</div>
            </div>
            <div className="lm9-flow-arrow">↔</div>
            <div className="lm9-flow-box">
              <div className="lm9-flow-title">API (Cloud Functions)</div>
              <div className="lm9-flow-text">Validation des mises, RNG provable, payout, sécurité.</div>
            </div>
            <div className="lm9-flow-arrow">↔</div>
            <div className="lm9-flow-box">
              <div className="lm9-flow-title">BD (Firestore)</div>
              <div className="lm9-flow-text">Users, sessions, rounds, transactions, historique.</div>
            </div>
          </div>
        </section>

        <footer className="lm9-footer center">
          <div className="lm9-footer-center">
            <div className="lm9-logo small">Lotto<span>M9</span></div>
            <p>Projet scolaire — Casino démo (jetons virtuels uniquement).</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function GameCard({ title, desc, tags, btn, gif, onSelect }) {
  return (
    <div className="lm9-game">
      <div className="lm9-game-media">
        <img src={gif} alt={title} />
      </div>

      <div className="lm9-game-top">
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>

      <div className="lm9-tags">
        {tags.map((t) => (
          <span key={t} className="lm9-tag">{t}</span>
        ))}
      </div>
      <button
        className="lm9-btn lm9-btn-primary full"
        type="button"
        onClick={() => {
          if (title.toLowerCase().includes("roulette")) onSelect?.("roulette");
          else if (title.toLowerCase().includes("slots")) onSelect?.("slots");
          else onSelect?.("blackjack");
        }}>
        {btn}
      </button>
    </div>
  );
}


function Step({ n, t, d }) {
  return (
    <div className="lm9-step">
      <div className="lm9-step-n">{n}</div>
      <div>
        <div className="lm9-step-t">{t}</div>
        <div className="lm9-step-d">{d}</div>
      </div>
    </div>
  );
}

function RulesPanel({ selectedGame }) {
  const data = {
    roulette: {
      title: "Roulette (double 00)",
      rules: [
        "Roulette américaine : 0 et 00.",
        "Place une mise, puis on tire un numéro.",
        "Mises possibles : numéro, rouge/noir, pair/impair, douzaines, colonnes."
      ],
      payouts: [
        "Numéro plein : 35:1",
        "Rouge/Noir : 1:1",
        "Pair/Impair : 1:1",
        "1–18 / 19–36 : 1:1",
        "Douzaine (1–12, 13–24, 25–36) : 2:1",
        "Colonne : 2:1"
      ]
    },
    slots: {
      title: "Slots (6×3)",
      rules: [
        "Machine 6 colonnes × 3 lignes.",
        "Spin : les symboles s’arrêtent.",
        "Gains selon lignes gagnantes (paylines) / combos.",
        "WILD peut remplacer des symboles (selon design)."
      ],
      payouts: [
        "3 identiques : x2 à x5 (selon symbole)",
        "4 identiques : x5 à x15",
        "5+ identiques : x15 à x100",
        "WILD : multiplicateur (ex: x2) (optionnel)"
      ]
    },
    blackjack: {
      title: "Blackjack",
      rules: [
        "Objectif : approcher 21 sans dépasser.",
        "Dealer suit une règle fixe (ex: hit soft 17 OU stand soft 17).",
        "Actions : Hit, Stand, Double (Split optionnel)."
      ],
      payouts: [
        "Victoire normale : 1:1",
        "Blackjack (A + 10) : 3:2 (recommandé)",
        "Égalité (push) : mise remboursée",
        "Assurance : 2:1 (si dealer blackjack)"
      ]
    }
  };

  const game = data[selectedGame];

  return (
    <div className="lm9-rules">
      <div className="lm9-rules-head">
        <h3>{game.title} — Règles & Payouts</h3>
        <span className="lm9-rules-pill">{selectedGame}</span>
      </div>

      <div className="lm9-rules-grid">
        <div className="lm9-rules-box">
          <h4>Règles</h4>
          <ul>
            {game.rules.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </div>

        <div className="lm9-rules-box">
          <h4>Payouts</h4>
          <ul>
            {game.payouts.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
