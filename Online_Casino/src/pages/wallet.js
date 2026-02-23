import { db } from "../firebase";
import {
  doc,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export async function ensureUserDoc(uid, defaults = {}) {
  const ref = doc(db, "users", uid);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) {
      tx.set(ref, {
        balance: 5000,
        createdAt: serverTimestamp(),
        lastDailyBonusAt: null,
        ...defaults,
      });
    }
  });
}

export async function claimDailyBonus(uid) {
  const ref = doc(db, "users", uid);

  return await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) return { ok: false, reason: "Profil introuvable." };

    const data = snap.data();
    const now = Timestamp.now();

    const d = new Date();
    const startUTC = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0);
    const startOfTodayUTC = Timestamp.fromMillis(startUTC);

    const last = data.lastDailyBonusAt;
    if (last && last.toMillis() >= startOfTodayUTC.toMillis()) {
      return { ok: false, reason: "Bonus déjà réclamé aujourd’hui." };
    }

    const newBalance = (data.balance ?? 0) + 500;

    tx.update(ref, {
      balance: newBalance,
      lastDailyBonusAt: now,
    });

    return { ok: true, balance: newBalance };
  });
}

export async function applyBalanceDelta(uid, delta) {
  const ref = doc(db, "users", uid);

  return await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("Profil introuvable.");

    const bal = snap.data().balance ?? 0;
    const next = bal + delta;

    if (next < 0) throw new Error("Solde insuffisant.");

    tx.update(ref, { balance: next });
    return next;
  });
}