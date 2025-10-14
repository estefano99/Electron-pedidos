import axios from 'axios';

const clienteAxios = axios.create({
  baseURL: import.meta.env.VITE_BACK_URL + import.meta.env.VITE_API_PATH,
  withCredentials: true // Importante: esto hace que axios envíe cookies automáticamente
})

// Interceptor para agregar tenantId automáticamente a las URLs
clienteAxios.interceptors.request.use(async (config) => {
  // Solo modificar URLs que contienen el placeholder {tenantId}
  if (config.url && config.url.includes('{tenantId}')) {
    try {
      // Hacer la llamada para obtener el tenantId
      const { data } = await axios.get(`${import.meta.env.VITE_BACK_URL}${import.meta.env.VITE_API_PATH}/auth/me`, {
        withCredentials: true
      })
      
      if (data.tenantId) {
        config.url = config.url.replace('{tenantId}', data.tenantId)
      } else {
        throw new Error('No tenantId found')
      }
    } catch (error) {
      console.error('Error obteniendo tenantId:', error)
      // Redirigir al login o manejar error
      window.location.href = '/'
      return Promise.reject(error)
    }
  }
  
  return config
})

export default clienteAxios;
