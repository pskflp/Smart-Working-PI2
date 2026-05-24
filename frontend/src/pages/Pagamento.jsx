import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import styles from "./Pagamento.module.css";
import { useError } from "../context/ErrorContext"; // Import useError

const Pagamento = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { espaco, dataInicio, duracao, tipoReserva } = location.state || {};
  const [total, setTotal] = useState(0);
  const { showError } = useError(); // Use the error context

  useEffect(() => {
    if (espaco) {
      if (tipoReserva === "HORA") {
        setTotal(espaco.precoHora * duracao);
      } else if (tipoReserva === "DIARIA") {
        setTotal(espaco.precoDiaria * duracao);
      } else if (tipoReserva === "MENSAL") {
        setTotal(espaco.precoMensal * duracao);
      }
    }
  }, [espaco, duracao, tipoReserva]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      await api.post("/reservas", {
        usuario: { id: user.id },
        espaco: { id: espaco.id },
        dataInicio,
        duracao,
        tipoReserva,
      });
      alert("Reserva Confirmada com Sucesso!");
      navigate("/dashboard");
    } catch (error) {
      showError(error); // Display the error message using the modal
    }
  };

  if (!espaco) {
    return <div>Espaço não encontrado.</div>;
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Pagamento</h2>
        <h3>Total: R$ {total.toFixed(2)}</h3>
        <input type="text" placeholder="Número do Cartão" />
        <input type="text" placeholder="Nome no Cartão" />
        <input type="text" placeholder="Validade" />
        <input type="text" placeholder="CVV" />
        <button type="submit">Pagar e Confirmar</button>
      </form>
    </div>
  );
};

export default Pagamento;
