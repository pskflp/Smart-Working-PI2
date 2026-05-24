import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [espacos, setEspacos] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchEspacos = async () => {
      try {
        const response = await api.get("/espacos");
        setEspacos(response.data);
      } catch (error) {
        console.error("Erro ao buscar espaços:", error);
      }
    };
    fetchEspacos();
  }, []);

  const handleReserve = (espaco) => {
    navigate("/reservar", { state: { espaco } });
  };

  const handleManage = (espaco) => {
    navigate("/gerenciamento-ocupacao", { state: { espaco } });
  };

  return (
    <div className={styles.container}>
      <h2>Dashboard</h2>
      <div className={styles.grid}>
        {espacos.map((espaco) => (
          <div key={espaco.id} className={styles.card}>
            {espaco.fotoBase64 && <img src={espaco.fotoBase64} alt={espaco.nome} />}
            <h3>{espaco.nome}</h3>
            <p>{espaco.endereco}</p>
            <p>{espaco.tipo}</p>
            <p>R$ {espaco.precoHora}/hora</p>
            {user && user.email === "admin@email.com" ? (
              <button onClick={() => handleManage(espaco)}>Gerenciar Ocupação</button>
            ) : (
              <button onClick={() => handleReserve(espaco)}>Reservar</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
