import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import styles from "./Perfil.module.css";

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (loggedUser) {
      setUser(loggedUser);
      setNome(loggedUser.nome);
      setEmail(loggedUser.email);
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (senha && senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    try {
      const response = await api.put(`/usuarios/${user.id}`, { nome, email, senha });
      localStorage.setItem("user", JSON.stringify(response.data));
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar o perfil.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir sua conta?")) {
      try {
        await api.delete(`/usuarios/${user.id}`);
        localStorage.removeItem("user");
        navigate("/login");
      } catch (error) {
        alert("Erro ao excluir a conta.");
      }
    }
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleUpdate}>
        <h2>Editar Perfil</h2>
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
          placeholder="Nova Senha (mínimo 6 caracteres)"
        />
        <button type="submit">Salvar Alterações</button>
      </form>
      <button className={styles.deleteButton} onClick={handleDelete}>
        Excluir Conta
      </button>
    </div>
  );
};

export default Perfil;
