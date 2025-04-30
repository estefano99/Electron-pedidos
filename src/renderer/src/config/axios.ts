import axios from 'axios';

const clienteAxios = axios.create({
  baseURL: import.meta.env.VITE_BACK_URL + import.meta.env.VITE_API_PATH
})

clienteAxios.interceptors.request.use(config => {
  const token = localStorage.getItem("AUTH_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})

export default clienteAxios;
