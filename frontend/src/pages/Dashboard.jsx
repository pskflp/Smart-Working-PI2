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
        // Se não for admin, filtra apenas os disponíveis
        const isAdmin = user && user.email === "admin@email.com";
        const url = isAdmin ? "/espacos" : "/espacos?status=DISPONIVEL";
        const response = await api.get(url);
        setEspacos(response.data);
      } catch (error) {
        console.error("Erro ao buscar espaços:", error);
      }
    };
    fetchEspacos();
  }, [user]);

  const handleReserve = (espaco) => {
    navigate("/reservar", { state: { espaco } });
  };

  const toggleStatus = async (espaco) => {
    const novoStatus = espaco.status === "DISPONÍVEL" ? "MANUTENÇÃO" : "DISPONÍVEL";
    try {
      await api.patch(`/espacos/${espaco.id}/status?novoStatus=${novoStatus}`);
      // Atualiza a lista localmente
      setEspacos(espacos.map(e => e.id === espaco.id ? { ...e, status: novoStatus } : e));
    } catch (error) {
      alert("Erro ao alterar status do espaço");
    }
  };

  const handleManage = (espaco) => {
    navigate("/gerenciamento-ocupacao", { state: { espaco } });
  };

  return (
    <div className={styles.container}>
      <h2>Dashboard</h2>
      <div className={styles.grid}>
        {espacos.map((espaco) => (
          <div key={espaco.id} className={`${styles.card} ${espaco.status !== "DISPONÍVEL" ? styles.blocked : ""}`}>
            {espaco.fotoBase64 && <img src={espaco.fotoBase64} alt={espaco.nome} />}
            <div className={styles.statusBadge}>{espaco.status}</div>
            <h3>{espaco.nome}</h3>
            <p>{espaco.endereco}</p>
            <p>{espaco.tipo}</p>
            <p>R$ {espaco.precoHora}/hora</p>
            {user && user.email === "admin@email.com" ? (
              <div className={styles.adminActions}>
                <button onClick={() => handleManage(espaco)}>Ver Ocupação</button>
                <button 
                  onClick={() => toggleStatus(espaco)}
                  className={espaco.status === "DISPONÍVEL" ? styles.btnBlock : styles.btnUnlock}
                >
                  {espaco.status === "DISPONÍVEL" ? "Bloquear" : "Desbloquear"}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleReserve(espaco)}
                disabled={espaco.status !== "DISPONÍVEL"}
              >
                {espaco.status === "DISPONÍVEL" ? "Reservar" : "Indisponível"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
