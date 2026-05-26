import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import styles from "./Perfil.module.css";

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [plano, setPlano] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (loggedUser) {
      setUser(loggedUser);
      setNome(loggedUser.nome);
      setEmail(loggedUser.email);
      fetchPlano(loggedUser.id);
    }
  }, []);

  const fetchPlano = async (userId) => {
    try {
      const response = await api.get(`/planos/membro/${userId}`);
      if (response.data && response.data.length > 0) {
        // Pega o plano ativo mais recente ou o primeiro da lista
        const planoAtivo = response.data.find(p => p.status === "ATIVO") || response.data[response.data.length - 1];
        setPlano(planoAtivo);
      } else {
        setPlano(null);
      }
    } catch (error) {
      console.error("Erro ao buscar plano:", error);
    }
  };

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

  const handleCancelPlano = async () => {
    if (window.confirm("Tem certeza que deseja cancelar sua assinatura?")) {
      try {
        await api.put(`/planos/${plano.id}/cancelar`);
        alert("Assinatura cancelada com sucesso!");
        fetchPlano(user.id);
      } catch (error) {
        alert("Erro ao cancelar assinatura.");
      }
    }
  };

  const handleAssinarPlano = async (nomePlano, valor) => {
    try {
      await api.post("/planos/assinar", {
        nomePlano,
        valorMensal: valor,
        renovacaoAutomatica: true,
        membro: { id: user.id }
      });
      alert(`Plano ${nomePlano} assinado com sucesso!`);
      fetchPlano(user.id);
    } catch (error) {
      alert("Erro ao assinar plano.");
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

      <div className={styles.planoSection}>
        <h3>Meu Plano de Assinatura</h3>
        {plano ? (
          <div className={styles.planoCard}>
            <p><strong>Plano:</strong> {plano.nomePlano}</p>
            <p><strong>Status:</strong> {plano.status}</p>
            <p><strong>Valor:</strong> R$ {plano.valorMensal.toFixed(2)}/mês</p>
            {plano.status === "ATIVO" && (
              <button className={styles.cancelarPlanoBtn} onClick={handleCancelPlano}>
                Cancelar Assinatura
              </button>
            )}
          </div>
        ) : (
          <div className={styles.planosDisponiveis}>
            <p>Você ainda não possui um plano ativo.</p>
            <div className={styles.planosGrid}>
              <div className={styles.planoOption}>
                <h4>Básico</h4>
                <p>R$ 99,00/mês</p>
                <button onClick={() => handleAssinarPlano("Básico", 99)}>Assinar</button>
              </div>
              <div className={styles.planoOption}>
                <h4>Premium</h4>
                <p>R$ 199,00/mês</p>
                <button onClick={() => handleAssinarPlano("Premium", 199)}>Assinar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;
