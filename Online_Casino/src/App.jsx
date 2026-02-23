import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Lobby from "./pages/Lobby";
import Profile from "./pages/Profile";
import Blackjack from "./pages/Blackjack";
import History from "./pages/History";
import ProtectedRoute, { PublicOnlyRoute } from "./auth/AuthGuard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<PublicOnlyRoute redirectTo="/lobby" />}>
        <Route path="/connexion" element={<SignIn />} />
        <Route path="/inscription" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute redirectTo="/" />}>
        <Route path="/lobby" element={<Lobby />} />
      </Route>

      <Route element={<ProtectedRoute redirectTo="/connexion" />}>
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/blackjack" element={<Blackjack />} />
        <Route path="/historique" element={<History />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}