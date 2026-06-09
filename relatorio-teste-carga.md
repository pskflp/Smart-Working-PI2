# Relatório de Testes de Carga - SmartWorking System



## 1. Nome do Serviço: Listagem de Espaços
**Tipo de operações:** Leitura (Consulta/Busca na base de dados)

### Arquivos envolvidos:
* `EspacoController.java`
* `Espaco.java`
* `EspacoRepository.java`

### Medição do SLA:
* **Arquivo de Teste:** `teste-listagem.js`
* **Latência (p95):** 9.99 s (Ultrapassou o SLA de 500ms)
* **Vazão:** 12.32 req/s (Total de 4444 requisições)
* **Concorrência:** 100 VUs simultâneos
* **Taxa de Erro:** 0.00% (Checks de Status 200 e payload ok)

### Visualização de Métricas (Grafana Cloud):
[![Grafana Listagem](https://raw.githubusercontent.com/grafana/k6/master/assets/k6-logo.png)]

### Levantamento de Hipóteses:
1.  **Transferência de Dados (Payload Gigante):** O tráfego de 4.6 GB de dados recebidos para apenas 4444 requisições confirma que o envio da foto de reserva satura a largura de banda da rede
2.  **Gargalo de Memória e Processamento:** A utilização de `.stream().filter()` na camada da aplicação (Java) obriga o carregamento de todos os registros do banco em memória antes da filtragem, gerando latências máximas de 20.59s sob estresse.

---

## 2. Nome do Serviço: Criação de Reserva
**Tipo de operações:** Inserção 

### Arquivos envolvidos:
* `ReservaController.java`
* `Reserva.java`
* `Pagamento.java`
* `Fatura.java`

### Medição do SLA:
* **Arquivo de Teste:** `teste-reserva.js`
* **Latência (p95):** 1.84 s 
* **Vazão:** 21.68 req/s (Total de 7830 requisições)
* **Concorrência:** 100 VUs simultâneos
* **Taxa de Erro:** 0.00% (Checks de Status 201 e confirmação ok)

### Visualização de Métricas (Grafana Cloud):
[![Grafana Reserva](https://raw.githubusercontent.com/grafana/k6/master/assets/k6-logo.png)]


### 🔍 Levantamento de Hipóteses:
1.  **Concorrência de Escrita:** A validação do método `existeConflito`, somada às operações de inserção em três tabelas distintas (Reserva, Pagamento, Fatura), gera bloqueios concorrentes (locks) no banco de dados, elevando o tempo de resposta geral.
2.  **Saturação do Pool de Conexões:** Com 100 VUs disparando transações complexas simultaneamente, o pool de conexões (HikariCP) e as threads do Tomcat atingem seu limite de processamento paralelo, impedindo a latência de se manter abaixo do threshold de 800ms.

---

## Melhorias Implementadas (Pós-Teste):
Com base nos resultados, foram aplicadas as seguintes otimizações:
*   **Lazy Loading de Fotos:** O campo `fotoBase64` foi marcado com `@JsonIgnore` e um endpoint dedicado `/api/espacos/{id}/foto` foi criado para reduzir o payload das listagens.
*   **Optimistic Locking:** Implementação de `@Version` nas entidades `Espaco` e `Reserva` para reduzir a contenção de locks no MySQL e melhorar a performance de concorrência.
