import React, { useState } from "react";
import api from "../services/api";
import styles from "./Admin.module.css";
import { useError, useSuccess } from "../context/ErrorContext"; // Import useSuccess

const Admin = () => {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("Mesa");
  const [precoHora, setPrecoHora] = useState("");
  const [precoDiaria, setPrecoDiaria] = useState("");
  const [precoMensal, setPrecoMensal] = useState("");
  const [fotoBase64, setFotoBase64] = useState("");
  const [endereco, setEndereco] = useState("");
  const [politicaCancelamento, setPoliticaCancelamento] = useState("");

  // Validation error states
  const [nomeError, setNomeError] = useState("");
  const [enderecoError, setEnderecoError] = useState("");
  const [precoHoraError, setPrecoHoraError] = useState("");
  const [precoDiariaError, setPrecoDiariaError] = useState("");
  const [precoMensalError, setPrecoMensalError] = useState("");
  const [fotoBase64Error, setFotoBase64Error] = useState(""); // New error state for photo

  const { showError } = useError();
  const { showSuccess } = useSuccess(); // Use the success context

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
    // Reset errors
    setNomeError("");
    setEnderecoError("");
    setPrecoHoraError("");
    setPrecoDiariaError("");
    setPrecoMensalError("");
    setFotoBase64Error(""); // Reset photo error

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
      showSuccess("Espaço cadastrado com sucesso!"); // Use showSuccess for success
      // Optionally clear form fields here
      setNome("");
      setTipo("Mesa");
      setPrecoHora("");
      setPrecoDiaria("");
      setPrecoMensal("");
      setFotoBase64("");
      setEndereco("");
      setPoliticaCancelamento("");

    } catch (error) {
      showError(error); // Use showError for errors
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Admin - Cadastrar Novo Espaço</h2>
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
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default Admin;
