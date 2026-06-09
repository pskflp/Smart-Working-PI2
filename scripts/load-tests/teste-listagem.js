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
    'http_req_duration{service:leitura_espacos}': ['p(95)<500'],
    'http_req_failed': ['rate<0.01'],
  },
  ext: {
    loadimpact: {
      projectID: 7707435,
      name: "teste-listagem"
    }
  }
};

const BASE_URL = 'http://host.docker.internal:8080/api';

export default function () {
  const res = http.get(`${BASE_URL}/espacos`, { 
    tags: { service: 'leitura_espacos', name: 'GET_Espacos' } 
  });

  check(res, {
    'status é 200': (r) => r.status === 200,
    'payload não é vazio': (r) => r.body.length > 0,
  });

  sleep(1);
}
