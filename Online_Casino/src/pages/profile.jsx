import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./profile.css";

export default function Profile() {
    const navigate = useNavigate();
    const user = auth.currentUser;

    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [email] = useState(user?.email || "");
    const [phone, setPhone] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!user) return;

        (async () => {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
            setPhone(snap.data()?.phone || "");
        }
        })();
    }, [user]);

    if (!user) return null;

    async function saveProfile() {
        setSaving(true);
        try {
        await updateProfile(user, { displayName });

        const ref = doc(db, "users", user.uid);
        await setDoc(ref, { phone }, { merge: true });

        alert("Profil mis à jour.");
        } catch (e) {
        console.error(e);
        alert("Erreur: impossible de sauvegarder.");
        } finally {
        setSaving(false);
        }
    }

    async function sendResetLink() {
        try {
        await sendPasswordResetEmail(auth, user.email);
        alert("Lien de réinitialisation envoyé par email.");
        } catch (e) {
        console.error(e);
        alert("Erreur: impossible d’envoyer le lien.");
        }
    }

    return (
        <div className="lm9-prof">
        <div className="lm9-prof-card">
            <div className="lm9-prof-head">
            <h1>Mon profil</h1>
            <button className="lm9-prof-back" onClick={() => navigate("/lobby")}>
                Retour lobby
            </button>
            </div>

            <div className="lm9-prof-grid">
            <div className="lm9-prof-box">
                <h2>Infos du compte</h2>

                <label>
                Nom d’utilisateur
                <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ton nom"
                />
                </label>

                <label>
                Email
                <input value={email} disabled />
                </label>

                <label>
                Numéro de téléphone
                <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: 5145551234"
                />
                </label>

                <button
                className="lm9-prof-save"
                onClick={saveProfile}
                disabled={saving}
                >
                {saving ? "Sauvegarde..." : "Sauvegarder"}
                </button>
            </div>

            <div className="lm9-prof-box">
                <h2>Mot de passe</h2>

                <p className="muted">
                Pour modifier ton mot de passe, un lien sécurisé sera envoyé à ton adresse email.
                </p>

                <button className="lm9-prof-save" onClick={sendResetLink}>
                Envoyer un lien de réinitialisation
                </button>
            </div>
            </div>
        </div>
        </div>
    );
}