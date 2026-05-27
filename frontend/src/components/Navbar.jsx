import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLinks}>
        {!user && <Link to="/">Home</Link>}
        
        {/* Links para Usuário Comum */}
        {user && user.email !== "admin@email.com" && (
          <>
            <Link to="/dashboard">Catálogo</Link>
            <Link to="/minhas-reservas">Minhas Reservas</Link>
            <Link to="/planos">Planos</Link>
          </>
        )}

        {/* Links para Admin */}
        {user && user.email === "admin@email.com" && (
          <Link to="/admin">Painel Admin</Link>
        )}

        {user && <Link to="/perfil">Perfil</Link>}
      </div>
      <div>
        {user ? (
          <button onClick={handleLogout}>Sair</button>
        ) : (
          <div className={styles.navLinks}>
            <Link to="/login">Login</Link>
            <Link to="/signup">Cadastro</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
