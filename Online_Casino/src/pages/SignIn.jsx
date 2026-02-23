import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { ensureUserDoc } from "../services/wallet";
import "./auth.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function friendlyAuthError(code) {
    switch (code) {
      case "auth/invalid-email":
        return "Le courriel est invalide.";
      case "auth/user-not-found":
        return "Aucun compte n’est associé à ce courriel.";
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Courriel ou mot de passe incorrect.";
      case "auth/too-many-requests":
        return "Trop de tentatives. Réessaie plus tard.";
      default:
        return "Impossible de se connecter. Vérifie tes informations.";
    }
  }

  async function handleSignIn(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Veuillez remplir le courriel et le mot de passe.");
      return;
    }

    try {
      setLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);

      await ensureUserDoc(cred.user.uid, {
        displayName: cred.user.displayName || "",
        phone: "",
      });

      navigate("/lobby", { replace: true });
    } catch (err) {
      setError(friendlyAuthError(err.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lm9-auth">
      <div className="lm9-auth-card">
        <div className="lm9-auth-brand">
          <div className="lm9-logo">Lotto<span>M9</span></div>
          <div className="lm9-sub">Casino démo</div>
        </div>

        <h1 className="lm9-auth-title">Connexion</h1>
        <p className="lm9-auth-desc">
          Connecte-toi pour accéder aux jeux et à ton solde de jetons virtuels.
        </p>

        {error && <div className="lm9-alert err">{error}</div>}

        <form className="lm9-auth-form" onSubmit={handleSignIn}>
          <label className="lm9-label">
            Courriel
            <input
              className="lm9-input"
              type="email"
              placeholder="exemple@domaine.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="lm9-label">
            Mot de passe
            <input
              className="lm9-input"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button
            className="lm9-btn lm9-btn-primary lm9-auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="lm9-auth-foot">
          Pas de compte ?{" "}
          <button
            type="button"
            className="lm9-link"
            onClick={() => navigate("/inscription")}
          >
            Créer un compte
          </button>
        </p>

        <div className="lm9-auth-note">
          <b>Simulation éducative :</b> aucun argent réel, aucun gain, jetons virtuels uniquement.
        </div>
      </div>
    </div>
  );
}