import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Lobby from "./pages/Lobby";
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
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
