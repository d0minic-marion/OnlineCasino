import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import "./auth.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accepted, setAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  function friendlyAuthError(code) {
    switch (code) {
      case "auth/invalid-email":
        return "Le courriel est invalide.";
      case "auth/email-already-in-use":
        return "Ce courriel est déjà utilisé.";
      case "auth/weak-password":
        return "Mot de passe trop faible (minimum 6 caractères).";
      default:
        return "Impossible de créer le compte. Réessaie.";
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!accepted) {
      setError("Veuillez accepter que Lotto M9 soit une simulation éducative.");
      return;
    }

    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);

      await updateProfile(cred.user, { displayName: name.trim() });

      setSuccess("Compte créé avec succès. Vous pouvez maintenant vous connecter.");
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

        <h1 className="lm9-auth-title">Créer un compte</h1>
        <p className="lm9-auth-desc">
          Crée ton compte pour obtenir un solde de départ et tester les jeux.
        </p>

        {(error || success) && (
          <div className={`lm9-alert ${error ? "err" : "ok"}`}>
            {error || success}
          </div>
        )}

        <form className="lm9-auth-form" onSubmit={handleRegister}>
          <label className="lm9-label">
            Nom d’utilisateur
            <input
              className="lm9-input"
              type="text"
              placeholder="ex. Dominic"
              autoComplete="nickname"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

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
              placeholder="Minimum 6 caractères"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label className="lm9-label">
            Confirmer le mot de passe
            <input
              className="lm9-input"
              type="password"
              placeholder="Répéter le mot de passe"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </label>

          <label className="lm9-check lm9-check-terms">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <span>
              J’accepte que Lotto M9 soit une <b>simulation éducative</b> (jetons virtuels uniquement).
            </span>
          </label>

          <button
            className="lm9-btn lm9-btn-primary lm9-auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="lm9-auth-foot">
          Déjà un compte ?{" "}
          <button
            type="button"
            className="lm9-link"
            onClick={() => navigate("/connexion")}
          >
            Se connecter
          </button>
        </p>

        <div className="lm9-auth-note">
          <b>Important :</b> aucune transaction réelle. Les mises et gains sont uniquement des points.
        </div>
      </div>
    </div>
  );
}