import React, { useState, useEffect } from "react";
import api from "../services/api";
import styles from "./Admin.module.css";
import { useError, useSuccess } from "../context/ErrorContext";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("espacos");
  
  // Form states
  const [editingId, setEditingId] = useState(null);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("Mesa");
  const [precoHora, setPrecoHora] = useState("");
  const [precoDiaria, setPrecoDiaria] = useState("");
  const [precoMensal, setPrecoMensal] = useState("");
  const [fotoBase64, setFotoBase64] = useState("");
  const [endereco, setEndereco] = useState("");
  const [politicaCancelamento, setPoliticaCancelamento] = useState("");
  const [status, setStatus] = useState("DISPONÍVEL");

  // Data states
  const [relatorio, setRelatorio] = useState(null);
  const [espacos, setEspacos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Validation error states
  const [nomeError, setNomeError] = useState("");
  const [enderecoError, setEnderecoError] = useState("");
  const [precoHoraError, setPrecoHoraError] = useState("");
  const [fotoBase64Error, setFotoBase64Error] = useState("");

  const { showError } = useError();
  const { showSuccess } = useSuccess();

  useEffect(() => {
    fetchRelatorio();
    fetchEspacos();
    fetchUsuarios();
  }, []);

  const fetchRelatorio = async () => {
    try {
      const response = await api.get("/relatorios/financeiro");
      setRelatorio(response.data);
    } catch (error) {
      console.error("Erro ao buscar relatório:", error);
    }
  };

  const fetchEspacos = async () => {
    try {
      const response = await api.get("/espacos");
      setEspacos(response.data);
    } catch (error) {
      console.error("Erro ao buscar espaços:", error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await api.get("/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
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
    if (!fotoBase64) {
      setFotoBase64Error("A foto do espaço é obrigatória.");
      isValid = false;
    }

    return isValid;
  };

  const resetForm = () => {
    setEditingId(null);
    setNome("");
    setTipo("Mesa");
    setPrecoHora("");
    setPrecoDiaria("");
    setPrecoMensal("");
    setFotoBase64("");
    setEndereco("");
    setPoliticaCancelamento("");
    setStatus("DISPONÍVEL");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showError("Por favor, corrija os erros no formulário.");
      return;
    }

    const payload = {
      nome,
      tipo,
      precoHora: parseFloat(precoHora),
      precoDia: parseFloat(precoDiaria || 0),
      precoMes: parseFloat(precoMensal || 0),
      fotoBase64,
      endereco,
      politicaCancelamento,
      status,
    };

    try {
      if (editingId) {
        await api.put(`/espacos/${editingId}`, payload);
        showSuccess("Espaço atualizado com sucesso!");
      } else {
        await api.post("/espacos", payload);
        showSuccess("Espaço cadastrado com sucesso!");
      }
      resetForm();
      fetchEspacos();
      fetchRelatorio();
    } catch (error) {
      showError(error);
    }
  };

  const handleEdit = (espaco) => {
    setEditingId(espaco.id);
    setNome(espaco.nome);
    setTipo(espaco.tipo);
    setPrecoHora(espaco.precoHora.toString());
    setPrecoDiaria(espaco.precoDia.toString());
    setPrecoMensal(espaco.precoMes.toString());
    setFotoBase64(espaco.fotoBase64);
    setEndereco(espaco.endereco);
    setPoliticaCancelamento(espaco.politicaCancelamento || "");
    setStatus(espaco.status);
    setActiveTab("espacos");
    window.scrollTo(0, 0);
  };

  const handleDeleteEspaco = async (id) => {
    if (window.confirm("Deseja realmente excluir este espaço?")) {
      try {
        await api.delete(`/espacos/${id}`);
        showSuccess("Espaço excluído com sucesso!");
        fetchEspacos();
        fetchRelatorio();
      } catch (error) {
        showError(error);
      }
    }
  };

  const handleDeleteUsuario = async (id) => {
    if (window.confirm("Deseja realmente excluir este usuário?")) {
      try {
        await api.delete(`/usuarios/${id}`);
        showSuccess("Usuário excluído com sucesso!");
        fetchUsuarios();
      } catch (error) {
        showError(error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.tabs}>
        <button 
          className={activeTab === 'espacos' ? styles.activeTab : ''} 
          onClick={() => setActiveTab('espacos')}
        >
          Espaços (Criar/Editar)
        </button>
        <button 
          className={activeTab === 'dashboard' ? styles.activeTab : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          Resumo
        </button>
        <button 
          className={activeTab === 'usuarios' ? styles.activeTab : ''} 
          onClick={() => setActiveTab('usuarios')}
        >
          Usuários
        </button>
      </nav>

      <div className={styles.adminSections}>
        {activeTab === 'dashboard' && (
          <section className={styles.reportsSection}>
            <h2>Resumo do Sistema</h2>
            {relatorio ? (
              <div className={styles.dashboardGrid}>
                <div className={styles.card}>
                  <h3>Total de Usuários</h3>
                  <p className={styles.totalValue}>{relatorio.totalUsuarios}</p>
                </div>
                
                <div className={styles.card}>
                  <h3>Total de Reservas</h3>
                  <p className={styles.totalValue}>{relatorio.totalReservas}</p>
                </div>

                <div className={styles.card}>
                  <h3>Faturamento Total</h3>
                  <p className={styles.totalValue}>R$ {relatorio.faturamentoTotal.toFixed(2)}</p>
                </div>
              </div>
            ) : (
              <p>Carregando resumo...</p>
            )}
          </section>
        )}

        {activeTab === 'espacos' && (
          <>
            <section className={styles.formSection}>
              <form className={styles.form} onSubmit={handleSubmit}>
                <h2>{editingId ? "Editar Espaço" : "Cadastrar Novo Espaço"}</h2>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome do Espaço"
                  style={nomeError ? { borderColor: 'red' } : {}}
                />
                {nomeError && <p className={styles.errorText}>{nomeError}</p>}
                
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Endereço"
                  style={enderecoError ? { borderColor: 'red' } : {}}
                />
                {enderecoError && <p className={styles.errorText}>{enderecoError}</p>}

                <div className={styles.row}>
                  <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option value="Mesa">Mesa</option>
                    <option value="Sala">Sala</option>
                    <option value="Auditório">Auditório</option>
                  </select>

                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="DISPONÍVEL">Disponível</option>
                    <option value="OCUPADO">Ocupado</option>
                    <option value="MANUTENÇÃO">Manutenção</option>
                  </select>
                </div>

                <div className={styles.row}>
                  <input
                    type="number"
                    value={precoHora}
                    onChange={(e) => setPrecoHora(e.target.value)}
                    placeholder="Preço/Hora"
                    min="0"
                    step="0.01"
                  />
                  <input
                    type="number"
                    value={precoDiaria}
                    onChange={(e) => setPrecoDiaria(e.target.value)}
                    placeholder="Preço/Dia"
                    min="0"
                    step="0.01"
                  />
                  <input
                    type="number"
                    value={precoMensal}
                    onChange={(e) => setPrecoMensal(e.target.value)}
                    placeholder="Preço/Mês"
                    min="0"
                    step="0.01"
                  />
                </div>
                {precoHoraError && <p className={styles.errorText}>{precoHoraError}</p>}

                <textarea
                  value={politicaCancelamento}
                  onChange={(e) => setPoliticaCancelamento(e.target.value)}
                  placeholder="Política de Cancelamento"
                />
                
                <div className={styles.fileInput}>
                  <label>Foto do Espaço:</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
                {fotoBase64Error && <p className={styles.errorText}>{fotoBase64Error}</p>}
                
                {fotoBase64 && (
                  <div className={styles.preview}>
                    <img src={fotoBase64} alt="Preview" />
                  </div>
                )}

                <div className={styles.formButtons}>
                  <button type="submit" className={styles.submitBtn}>
                    {editingId ? "Salvar Alterações" : "Cadastrar Espaço"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={resetForm} className={styles.cancelBtn}>
                      Cancelar Edição
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className={styles.listSection}>
              <h2>Espaços Cadastrados</h2>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Tipo</th>
                      <th>Status</th>
                      <th>Preço/h</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {espacos.map(espaco => (
                      <tr key={espaco.id}>
                        <td>{espaco.nome}</td>
                        <td>{espaco.tipo}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[espaco.status.toLowerCase()]}`}>
                            {espaco.status}
                          </span>
                        </td>
                        <td>R$ {espaco.precoHora.toFixed(2)}</td>
                        <td className={styles.actions}>
                          <button onClick={() => handleEdit(espaco)} className={styles.editBtn}>Editar</button>
                          <button onClick={() => handleDeleteEspaco(espaco.id)} className={styles.deleteBtn}>Excluir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {activeTab === 'usuarios' && (
          <section className={styles.listSection}>
            <h2>Gerenciar Usuários</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(user => (
                    <tr key={user.id}>
                      <td>{user.nome}</td>
                      <td>{user.email}</td>
                      <td>{user.telefone}</td>
                      <td className={styles.actions}>
                        <button onClick={() => handleDeleteUsuario(user.id)} className={styles.deleteBtn}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Admin;
