import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Reserva from "./pages/Reserva";
import Perfil from "./pages/Perfil";
import Pagamento from "./pages/Pagamento";
import LandingPage from "./pages/LandingPage";
import MinhasReservas from "./pages/MinhasReservas";
import GerenciamentoOcupacao from "./pages/GerenciamentoOcupacao";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="/reservar"
          element={
            <PrivateRoute>
              <Reserva />
            </PrivateRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />
        <Route
          path="/pagamento"
          element={
            <PrivateRoute>
              <Pagamento />
            </PrivateRoute>
          }
        />
        <Route
          path="/minhas-reservas"
          element={
            <PrivateRoute>
              <MinhasReservas />
            </PrivateRoute>
          }
        />
        <Route
          path="/gerenciamento-ocupacao"
          element={
            <PrivateRoute>
              <GerenciamentoOcupacao />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
