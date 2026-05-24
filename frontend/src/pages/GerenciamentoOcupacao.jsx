import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import styles from "./GerenciamentoOcupacao.module.css";

const GerenciamentoOcupacao = () => {
  const location = useLocation();
  const { espaco } = location.state || {};
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const fetchReservas = async () => {
      if (espaco) {
        try {
          const response = await api.get(`/reservas/espaco/${espaco.id}`);
          setReservas(response.data);
        } catch (error) {
          console.error("Erro ao buscar reservas:", error);
        }
      }
    };
    fetchReservas();
  }, [espaco]);

  if (!espaco) {
    return <div>Espaço não encontrado.</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Gerenciamento de Ocupação - {espaco.nome}</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Cód. Reserva</th>
            <th>Data</th>
            <th>Espaço</th>
            <th>Plano</th>
            <th>Valor</th>
            <th>Ocupante</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id}>
              <td>{reserva.id}</td>
              <td>{new Date(reserva.inicio).toLocaleDateString()}</td>
              <td>{reserva.espaco.nome}</td>
              <td>{reserva.tipoReserva}</td>
              <td>R$ {reserva.valorTotal}</td>
              <td>{reserva.usuario.nome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GerenciamentoOcupacao;
