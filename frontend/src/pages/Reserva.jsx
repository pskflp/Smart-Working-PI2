import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Reserva.module.css";

const Reserva = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { espaco } = location.state || {};
  const [tipoReserva, setTipoReserva] = useState("HORA");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [duracao, setDuracao] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    let dataInicioFinal = dataInicio;
    let duracaoFinal = duracao;

    if (tipoReserva === "DIARIA") {
      const start = new Date(dataInicio);
      const end = new Date(dataFim);
      const diffTime = Math.abs(end - start);
      duracaoFinal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      dataInicioFinal = `${dataInicio}T08:00:00`;
    } else if (tipoReserva === "MENSAL") {
      dataInicioFinal = `${dataInicio}T08:00:00`;
    }

    navigate("/pagamento", {
      state: {
        espaco,
        dataInicio: dataInicioFinal,
        duracao: duracaoFinal,
        tipoReserva,
      },
    });
  };

  if (!espaco) {
    return <div>Espaço não encontrado.</div>;
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {espaco.fotoBase64 && <img src={espaco.fotoBase64} alt={espaco.nome} className={styles.image} />}
        <h2>Reservar {espaco.nome}</h2>
        <p>{espaco.tipo}</p>
        <p className={styles.politica}>{espaco.politicaCancelamento}</p>
        <div className={styles.inputGroup}>
          <select className={`${styles.select} ${styles.inputField}`} value={tipoReserva} onChange={(e) => setTipoReserva(e.target.value)}>
            <option value="HORA">Por Hora (R$ {espaco.precoHora})</option>
            <option value="DIARIA">Por Dia (R$ {espaco.precoDiaria})</option>
            <option value="MENSAL">Por Mês (R$ {espaco.precoMensal})</option>
          </select>

          {tipoReserva === "HORA" && (
            <>
              <label>Data e Hora</label>
              <input
                className={styles.inputField}
                type="datetime-local"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                required
              />
              <input
                className={styles.inputField}
                type="number"
                value={duracao}
                onChange={(e) => setDuracao(parseInt(e.target.value, 10))}
                min="1"
                required
              />
            </>
          )}

          {tipoReserva === "DIARIA" && (
            <>
              <label>Data de Início</label>
              <input
                className={styles.inputField}
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                required
              />
              <label>Data de Fim</label>
              <input
                className={styles.inputField}
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                required
              />
            </>
          )}

          {tipoReserva === "MENSAL" && (
            <>
              <label>Data de Início</label>
              <input
                className={styles.inputField}
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                required
              />
              <input
                className={styles.inputField}
                type="number"
                value={duracao}
                onChange={(e) => setDuracao(parseInt(e.target.value, 10))}
                min="1"
                placeholder="Duração (meses)"
                required
              />
            </>
          )}

          <button className={styles.button} type="submit">Ir para Pagamento</button>
        </div>
      </form>
    </div>
  );
};

export default Reserva;
