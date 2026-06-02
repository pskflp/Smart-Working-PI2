import http from 'k6/http';
import { sleep } from 'k6';


export const options = {
  vus: 200,
  duration: '3m',
  thresholds: {
    'http_req_duration{service:leitura_espacos}': ['p(95)<500'],
    'http_req_duration{service:escrita_reserva}': ['p(95)<800'],
    'http_req_failed': ['rate<0.01'],
  },
};

const BASE_URL = 'http://host.docker.internal:8080/api';

export default function () {
 
  http.get(`${BASE_URL}/espacos`, { 
    tags: { service: 'leitura_espacos', name: 'GET_Espacos' } 
  });

  sleep(1);

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

  http.post(`${BASE_URL}/reservas`, payload, { 
    headers: { 'Content-Type': 'application/json' },
    tags: { service: 'escrita_reserva', name: 'POST_Reserva' }
  });

  sleep(2);
}
