import React, { useState, useEffect } from "react";
import api from "../services/api";
import styles from "./Planos.module.css";
import { useError, useSuccess } from "../context/ErrorContext";

const Planos = () => {
  const [planosAtivos, setPlanosAtivos] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const { showError } = useError();
  const { showSuccess } = useSuccess();

  const planosDisponiveis = [
    {
      nome: "Plano Básico",
      valor: 150.00,
      beneficios: ["Acesso a mesas comuns", "Café incluso", "Internet de alta velocidade"],
      cor: "#007bff"
    },
    {
      nome: "Plano Profissional",
      valor: 450.00,
      beneficios: ["Acesso a mesas e salas", "Café e Snacks", "10h de sala de reunião/mês", "Endereço fiscal"],
      cor: "#28a745"
    },
    {
      nome: "Plano Enterprise",
      valor: 1200.00,
      beneficios: ["Acesso ilimitado", "Sala privativa", "Secretária", "Estacionamento VIP"],
      cor: "#6f42c1"
    }
  ];

  useEffect(() => {
    fetchMeusPlanos();
  }, []);

  const fetchMeusPlanos = async () => {
    try {
      const response = await api.get(`/planos/membro/${user.id}`);
      setPlanosAtivos(response.data);
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
    }
  };

  const handleAssinar = async (planoInfo) => {
    try {
      await api.post("/planos/assinar", {
        nomePlano: planoInfo.nome,
        valorMensal: planoInfo.valor,
        membro: { id: user.id },
        renovacaoAutomatica: true
      });
      showSuccess(`Plano ${planoInfo.nome} assinado com sucesso!`);
      fetchMeusPlanos();
    } catch (error) {
      showError(error);
    }
  };

  const handleCancelar = async (id) => {
    if (window.confirm("Deseja realmente cancelar sua assinatura?")) {
      try {
        await api.put(`/planos/${id}/cancelar`);
        showSuccess("Assinatura cancelada.");
        fetchMeusPlanos();
      } catch (error) {
        showError(error);
      }
    }
  };

  const isAssinado = (nome) => planosAtivos.some(p => p.nomePlano === nome && p.status === "ATIVO");

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Planos de Assinatura</h1>
        <p>Escolha o plano que melhor se adapta às suas necessidades de trabalho.</p>
      </header>

      <div className={styles.planosGrid}>
        {planosDisponiveis.map((plano, index) => (
          <div key={index} className={styles.planoCard} style={{ borderColor: plano.cor }}>
            <div className={styles.planoHeader} style={{ backgroundColor: plano.cor }}>
              <h2>{plano.nome}</h2>
              <div className={styles.preco}>
                <span className={styles.cifrao}>R$</span>
                <span className={styles.valor}>{plano.valor.toFixed(2)}</span>
                <span className={styles.periodo}>/mês</span>
              </div>
            </div>
            <ul className={styles.beneficios}>
              {plano.beneficios.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            <div className={styles.footer}>
              {isAssinado(plano.nome) ? (
                <div className={styles.statusAtivo}>
                  <span>Plano Ativo</span>
                  <button 
                    className={styles.cancelBtn}
                    onClick={() => handleCancelar(planosAtivos.find(p => p.nomePlano === plano.nome).id)}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button 
                  className={styles.assinarBtn} 
                  style={{ backgroundColor: plano.cor }}
                  onClick={() => handleAssinar(plano)}
                >
                  Assinar Agora
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {planosAtivos.length > 0 && (
        <section className={styles.historico}>
          <h2>Suas Assinaturas</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Plano</th>
                <th>Valor</th>
                <th>Início</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {planosAtivos.map(p => (
                <tr key={p.id}>
                  <td>{p.nomePlano}</td>
                  <td>R$ {p.valorMensal.toFixed(2)}</td>
                  <td>{new Date(p.dataInicio).toLocaleDateString()}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[p.status.toLowerCase()]}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default Planos;
