import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1>Seu Escritório Flexível. Reserve Mesas e Salas em Segundos.</h1>
        <Link to="/dashboard" className={styles.ctaButton}>
          Confira nossos espaços
        </Link>
      </header>
      <footer className={styles.footer}>
        <p>Copyright SmartWorking 2025</p>
      </footer>
    </div>
  );
};

export default LandingPage;
