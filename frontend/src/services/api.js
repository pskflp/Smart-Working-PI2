import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data || error.message || "Ocorreu um erro desconhecido.";

    if (error.response && [401, 403].includes(error.response.status)) {
      // For authentication/authorization errors, redirect to login
      window.location.href = "/login";
    } else if (error.message === "Network Error") {
      // For network errors, show a generic alert (this might be replaced by the modal later if we handle all errors consistently)
      alert(
        "Network Error: Não foi possível conectar ao servidor. Verifique se o backend está rodando e se não há problemas de CORS."
      );
    } else {
      // For other errors, reject the promise with the extracted error message
      return Promise.reject(errorMessage);
    }
    return Promise.reject(error); // Fallback in case the above conditions don't return
  }
);

export default api;
