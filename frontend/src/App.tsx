import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import PautaList from "./pages/pauta/PautaList";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/pautas"
            element={
              <PrivateRoute>
                <PautaList />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/pautas" replace />} />
          <Route path="*" element={<Navigate to="/pautas" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
