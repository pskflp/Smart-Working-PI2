import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    // Fase 1 - Leve (aquecimento)
    { duration: '30s', target: 20 },
    { duration: '30s', target: 40 },

    // Fase 2 - Média (uso realista)
    { duration: '30s', target: 60 },
    { duration: '45s', target: 80 },

    // Fase 3 - Alta (teste de estresse)
    { duration: '1m', target: 100 },
    { duration: '1m', target: 100 },

    // Fase final - redução progressiva
    { duration: '45s', target: 50 },
    { duration: '30s', target: 20 },
    { duration: '30s', target: 0 }
  ],
  thresholds: {
    'http_req_duration{service:escrita_reserva}': ['p(95)<800'],
    'http_req_failed': ['rate<0.01'],
  },
  ext: {
    loadimpact: {
      projectID: 7772049,
      name: "teste-reserva"
    }
  }
};

const BASE_URL = 'http://host.docker.internal:8080/api';

export default function () {
  // Para aleatorizar as datas de reserva e não gerar conflito
  const ano = 2026 + Math.floor(Math.random() * 5);
  const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const dia = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  const uniqueTime = `${ano}-${mes}-${dia}T10:00:00`;

  const payload = JSON.stringify({
    usuario: { id: 2 },
    espaco: { id: 2 },
    dataInicio: uniqueTime,
    dataFim: uniqueTime,
    tipoReserva: "HORA"
  });

  const res = http.post(`${BASE_URL}/reservas`, payload, { 
    headers: { 'Content-Type': 'application/json' },
    tags: { service: 'escrita_reserva', name: 'POST_Reserva' }
  });

  check(res, {
    'status é 201': (r) => r.status === 201,
    'reserva confirmada': (r) => r.body.includes('sucesso'),
  });

  sleep(2);
}
