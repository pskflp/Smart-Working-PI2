# SmartWorking System - Guia de Execução e Testes de Carga

Este projeto é um sistema de gerenciamento de espaços de coworking, desenvolvido com **Spring Boot** no backend e pronto para testes de performance com **k6** e **Grafana**.

---

## 🚀 Como Rodar a Aplicação

### 1. Pré-requisitos
*   Java 17+
*   MySQL 8.0
*   Docker & Docker Compose (para os testes)

### 2. Configurar o Banco de Dados
Em aplication.properties, insira os dados para autenticar seu banco de dados.

### 3. Rodar o Backend e Frontend
No terminal, na raiz do projeto:
```powershell
mvn spring-boot:run
```
O servidor estará ativo em: `http://localhost:8080`

Para o backend
```powershell
npm run dev
```

O servidor estará ativo em: `http://localhost:5173`

---

##  Como Rodar os Testes de Carga (k6 + Grafana)

Preparamos um ambiente conteinerizado para coletar e visualizar métricas de performance em tempo real.

### 1. Subir a Infraestrutura de monitoramento
Execute o comando para iniciar o InfluxDB (banco de métricas) e o Grafana (painel visual):
```powershell
docker compose up -d influxdb grafana
```

### 2. Executar o Teste de Carga com k6
O comando abaixo executa o script de teste e envia os resultados para o Grafana local:
```powershell
docker compose run --rm k6 run --out influxdb=http://influxdb:8086/k6 /scripts/load-tests/load_test.js
```


##  Cenários de Teste
Para alterar a carga dos testes, edite o campo `vus` no arquivo `load-tests/load_test.js`:
*   **SLA1:** 20 VUs 
*   **SLA2:** 100 VUs 
*   **SLA3:** 200 VUs 

---

