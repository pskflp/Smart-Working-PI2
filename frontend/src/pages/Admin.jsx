import React, { useState, useEffect } from "react";
import api from "../services/api";
import styles from "./Admin.module.css";
import { useError, useSuccess } from "../context/ErrorContext";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Admin = () => {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("Mesa");
  const [precoHora, setPrecoHora] = useState("");
  const [precoDiaria, setPrecoDiaria] = useState("");
  const [precoMensal, setPrecoMensal] = useState("");
  const [fotoBase64, setFotoBase64] = useState("");
  const [endereco, setEndereco] = useState("");
  const [politicaCancelamento, setPoliticaCancelamento] = useState("");

  const [relatorio, setRelatorio] = useState(null);

  // Validation error states
  const [nomeError, setNomeError] = useState("");
  const [enderecoError, setEnderecoError] = useState("");
  const [precoHoraError, setPrecoHoraError] = useState("");
  const [precoDiariaError, setPrecoDiariaError] = useState("");
  const [precoMensalError, setPrecoMensalError] = useState("");
  const [fotoBase64Error, setFotoBase64Error] = useState("");

  const { showError } = useError();
  const { showSuccess } = useSuccess();

  useEffect(() => {
    fetchRelatorio();
  }, []);

  const fetchRelatorio = async () => {
    try {
      const response = await api.get("/relatorios/financeiro");
      setRelatorio(response.data);
    } catch (error) {
      console.error("Erro ao buscar relatório:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    let isValid = true;
    setNomeError("");
    setEnderecoError("");
    setPrecoHoraError("");
    setPrecoDiariaError("");
    setPrecoMensalError("");
    setFotoBase64Error("");

    if (!nome.trim() || nome.trim().length < 3) {
      setNomeError("Nome do Espaço é obrigatório e deve ter pelo menos 3 caracteres.");
      isValid = false;
    }
    if (!endereco.trim() || endereco.trim().length < 5) {
      setEnderecoError("Endereço é obrigatório e deve ter pelo menos 5 caracteres.");
      isValid = false;
    }
    if (!precoHora || parseFloat(precoHora) < 0) {
      setPrecoHoraError("Preço por Hora é obrigatório e não pode ser negativo.");
      isValid = false;
    }
    if (precoDiaria && parseFloat(precoDiaria) < 0) {
      setPrecoDiariaError("Preço por Dia não pode ser negativo.");
      isValid = false;
    }
    if (precoMensal && parseFloat(precoMensal) < 0) {
      setPrecoMensalError("Preço por Mês não pode ser negativo.");
      isValid = false;
    }
    if (!fotoBase64) {
      setFotoBase64Error("A foto do espaço é obrigatória.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showError("Por favor, corrija os erros no formulário.");
      return;
    }

    try {
      await api.post("/espacos", {
        nome,
        tipo,
        precoHora: parseFloat(precoHora),
        precoDiaria: parseFloat(precoDiaria || 0),
        precoMensal: parseFloat(precoMensal || 0),
        fotoBase64,
        endereco,
        politicaCancelamento,
      });
      showSuccess("Espaço cadastrado com sucesso!");
      setNome("");
      setTipo("Mesa");
      setPrecoHora("");
      setPrecoDiaria("");
      setPrecoMensal("");
      setFotoBase64("");
      setEndereco("");
      setPoliticaCancelamento("");
      fetchRelatorio();
    } catch (error) {
      showError(error);
    }
  };

  const chartDataEspaco = relatorio ? {
    labels: Object.keys(relatorio.faturamentoPorEspaco),
    datasets: [
      {
        label: "Faturamento por Espaço (R$)",
        data: Object.values(relatorio.faturamentoPorEspaco),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  } : null;

  const chartDataPlano = relatorio ? {
    labels: Object.keys(relatorio.faturamentoPorPlano),
    datasets: [
      {
        label: "Faturamento por Plano (R$)",
        data: Object.values(relatorio.faturamentoPorPlano),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(255, 206, 86, 0.5)",
        ],
      },
    ],
  } : null;

  return (
    <div className={styles.container}>
      <div className={styles.adminSections}>
        <section className={styles.formSection}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Cadastrar Novo Espaço</h2>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do Espaço"
              style={nomeError ? { borderColor: 'red' } : {}}
            />
            {nomeError && <p style={{ color: 'red', fontSize: '0.8em' }}>{nomeError}</p>}
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Endereço"
              style={enderecoError ? { borderColor: 'red' } : {}}
            />
            {enderecoError && <p style={{ color: 'red', fontSize: '0.8em' }}>{enderecoError}</p>}
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="Mesa">Mesa</option>
              <option value="Sala">Sala</option>
            </select>
            <input
              type="number"
              value={precoHora}
              onChange={(e) => setPrecoHora(e.target.value)}
              placeholder="Preço por Hora"
              min="0"
              step="0.01"
              style={precoHoraError ? { borderColor: 'red' } : {}}
            />
            {precoHoraError && <p style={{ color: 'red', fontSize: '0.8em' }}>{precoHoraError}</p>}
            <input
              type="number"
              value={precoDiaria}
              onChange={(e) => setPrecoDiaria(e.target.value)}
              placeholder="Preço por Dia"
              min="0"
              step="0.01"
              style={precoDiariaError ? { borderColor: 'red' } : {}}
            />
            {precoDiariaError && <p style={{ color: 'red', fontSize: '0.8em' }}>{precoDiariaError}</p>}
            <input
              type="number"
              value={precoMensal}
              onChange={(e) => setPrecoMensal(e.target.value)}
              placeholder="Preço por Mês"
              min="0"
              step="0.01"
              style={precoMensalError ? { borderColor: 'red' } : {}}
            />
            {precoMensalError && <p style={{ color: 'red', fontSize: '0.8em' }}>{precoMensalError}</p>}
            <textarea
              value={politicaCancelamento}
              onChange={(e) => setPoliticaCancelamento(e.target.value)}
              placeholder="Política de Cancelamento"
            />
            <input type="file" accept="image/*" onChange={handleFileChange} style={fotoBase64Error ? { borderColor: 'red' } : {}}/>
            {fotoBase64Error && <p style={{ color: 'red', fontSize: '0.8em' }}>{fotoBase64Error}</p>}
            <button type="submit">Cadastrar Espaço</button>
          </form>
        </section>

        <section className={styles.reportsSection}>
          <h2>Relatórios Financeiros</h2>
          {relatorio ? (
            <div className={styles.dashboardGrid}>
              <div className={styles.card}>
                <h3>Faturamento Total</h3>
                <p className={styles.totalValue}>R$ {relatorio.faturamentoTotal.toFixed(2)}</p>
                <span>Baseado em {relatorio.totalPagamentos} transações</span>
              </div>
              
              <div className={styles.chartContainer}>
                <h3>Receita por Espaço</h3>
                {chartDataEspaco && <Bar data={chartDataEspaco} />}
              </div>

              <div className={styles.chartContainer}>
                <h3>Receita por Plano</h3>
                {chartDataPlano && <Pie data={chartDataPlano} />}
              </div>
            </div>
          ) : (
            <p>Carregando relatórios...</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Admin;
