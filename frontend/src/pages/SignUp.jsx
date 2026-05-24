import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import styles from "./SignUp.module.css";
import { useError } from "../context/ErrorContext";

const SignUp = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();
  const { showError } = useError();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Client-side validations
    if (nome.length < 5) {
      showError("O nome deve ter pelo menos 5 caracteres.");
      return;
    }
    const phoneRegex = /^\(?\d{2}\)?\s*\d{4,5}-?\d{4}$/;
    if (telefone.length < 10 || !phoneRegex.test(telefone)) {
        showError("O número de telefone deve ter pelo menos 10 caracteres e ser válido.");
        return;
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
        showError("Por favor, insira um endereço de e-mail válido.");
        return;
    }
    if (senha.length < 6) {
      showError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (!termsAccepted) {
      showError("Você deve aceitar os termos e condições.");
      return;
    }

    try {
      await api.post("/usuarios", { nome, email, senha, telefone });
      navigate("/login");
    } catch (error) {
      showError(error); // Display the backend error message using the modal
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSignUp}>
        <h2>Cadastro</h2>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          required
        />
        <input
          type="text"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          placeholder="Telefone"
          required
        />
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <label>Eu aceito os termos e condições</label>
        </div>
        <button type="submit">Cadastrar</button>
        <p className={styles.link}>
          Já possui uma conta? <Link to="/login">Entre</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
