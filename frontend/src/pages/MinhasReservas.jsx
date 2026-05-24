import React, { useEffect, useState } from "react";
import api from "../services/api";
import styles from "./MinhasReservas.module.css";

const MinhasReservas = () => {
  const [reservas, setReservas] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await api.get(`/reservas/usuario/${user.id}`);
        setReservas(response.data);
      } catch (error) {
        console.error("Erro ao buscar reservas:", error);
      }
    };
    if (user) {
      fetchReservas();
    }
  }, [user]);

  const handleCancel = async (reserva) => {
    if (window.confirm(`Política de Cancelamento: ${reserva.espaco.politicaCancelamento}\n\nTem certeza que deseja cancelar?`)) {
      try {
        await api.delete(`/reservas/${reserva.id}`);
        setReservas(reservas.filter((r) => r.id !== reserva.id));
        alert("Reserva Cancelada com Sucesso!");
      } catch (error) {
        alert("Erro ao cancelar a reserva.");
      }
    }
  };

  const calcularTotal = (reserva) => {
    if (!reserva || !reserva.espaco) return 0; // Ensure reserva and espaco exist

    const duracao = Number(reserva.duracao);
    if (isNaN(duracao) || duracao <= 0) return 0; // Handle invalid or non-positive duration

    let preco = 0;
    if (reserva.tipoReserva === "HORA") {
      preco = Number(reserva.espaco.precoHora);
    } else if (reserva.tipoReserva === "DIARIA") {
      preco = Number(reserva.espaco.precoDiaria);
    } else if (reserva.tipoReserva === "MENSAL") {
      preco = Number(reserva.espaco.precoMensal);
    }
    
    if (isNaN(preco) || preco < 0) return 0; // Handle invalid or negative price

    return preco * duracao;
  }

  return (
    <div className={styles.container}>
      <h2>Minhas Reservas</h2>
      <div className={styles.grid}>
        {reservas.map((reserva) => (
          <div key={reserva.id} className={styles.card}>
            <h3>{reserva.espaco.nome}</h3>
            <p>{reserva.espaco.endereco}</p>
            <p>ID da Reserva: {reserva.id}</p>
            <p>Início: {new Date(reserva.inicio).toLocaleString()}</p>
            <p>Fim: {new Date(reserva.fim).toLocaleString()}</p>
            <p>Total: R$ {calcularTotal(reserva).toFixed(2)}</p>
            <button onClick={() => handleCancel(reserva)}>Cancelar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MinhasReservas;
