Este documento apresenta os resultados e a análise de performance da API utilizando testes de estresse progressivos.

---

## 12.1. Serviço Listagem de Espaços (`GET /api/espacos`)

**Serviço:** Listagem de Espaços  
**Tipo de Operação:** Leitura  

### ⚙️ Configurações do Ambiente
- **Máquina Local:**
- Ryzen 5 2400g
- RTX 3060
- 16gb RAM
- **K6:** Rodando via Docker Container
- **Backend:** API hospedada em `host.docker.internal:8080`
- **Banco de Dados:** InfluxDB para output das métricas

###  Arquivos Envolvidos
- `src/main/java/com/example/smartworkingsystem/controller/EspacoController.java`
- `src/main/java/com/example/smartworkingsystem/model/Espaco.java`
- `src/main/java/com/example/smartworkingsystem/repository/EspacoRepository.java`
- **Arquivo de Teste:** `/scripts/load-tests/load_test.js`

###  Resultados das Medições

| Cenário | Concorrência | Latência (p95) | Vazão (req/iterações) |
| :--- | :--- | :--- | :--- |
| **SLA 1** | 20 VUs | 595.02 ms | 1085 |
| **SLA 2** | 100 VUs | 7.91 s | 2409 |
| **SLA 3** | 200 VUs | 22.14 s | 2301 |

###  Levantamento de Hipóteses e Potenciais Gargalos
* **Transferência de Dados (Payload Gigante):** O campo `fotoBase64` na entidade `Espaco` envia strings muito longas. Com 200 VUs, o volume de dados transferidos satura a placa de rede local.
* **Processamento em Memória:** O uso de `.stream().filter()` no Controller força o Java a carregar todos os registros do banco antes de filtrar, aumentando o tempo de CPU e latência.
* **Degradação Exponencial:** Houve uma degradação massiva de latência a partir de 100 VUs, saltando de 595 ms para mais de 22 segundos no pico.
* **Platô de Vazão:** O sistema atinge um teto de processamento próximo a 2400 requisições; aumentar de 100 para 200 usuários causou uma queda na vazão (de 2409 para 2301) e um aumento extremo no tempo de resposta.

---

## 12.2. Serviço Criação de Reserva (`POST /api/reservas`)

**Serviço:** Criação de Reserva e Faturamento  
**Tipo de Operação:** Inserção (Escrita em múltiplas tabelas)  

###  Arquivos Envolvidos
- `src/main/java/com/example/smartworkingsystem/controller/ReservaController.java`
- `src/main/java/com/example/smartworkingsystem/model/Reserva.java`
- `src/main/java/com/example/smartworkingsystem/model/Pagamento.java`
- `src/main/java/com/example/smartworkingsystem/model/Fatura.java`
- **Arquivo de Teste:** `/scripts/load-tests/load_test.js`

###  Resultados das Medições

| Cenário | Concorrência | Latência (p95) | Vazão (req/iterações) |
| :--- | :--- | :--- | :--- |
| **SLA 1** | 20 VUs | 98.46 ms | 1085 |
| **SLA 2** | 100 VUs | 979.2 ms | 2409 |
| **SLA 3** | 200 VUs | 3.49 s | 2301 |

###  Levantamento de Hipóteses e Potenciais Gargalos
* **Validação de Conflito Ineficiente:** A checagem de `existeConflito` faz uma consulta ao banco para cada tentativa de reserva. Em alta carga, isso gera uma sobrecarga de leitura concorrente com a escrita.
* **Violação de SLA:** O limite de *threshold* estipulado para a escrita (`p(95) < 800`) foi rompido nos cenários de 100 e 200 VUs.
* **Esgotamento de Recursos Compartilhados:** A estagnação da vazão máxima acompanhou o cenário geral da aplicação, indicando esgotamento de recursos (como *pool* de conexões do banco de dados ou saturação de CPU da API) quando sob estresse de 200 usuários simultâneos.

Comparação leitura x escrita (200VUS)
![Resultados do Grafana](Smart-Working-PI2/imagem_2026-06-01_223522905.png)
