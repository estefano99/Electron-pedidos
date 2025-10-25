import axios from 'axios';

const clienteAxios = axios.create({
  baseURL: import.meta.env.VITE_BACK_URL + import.meta.env.VITE_API_PATH,
  withCredentials: true // Importante: esto hace que axios envíe cookies automáticamente
})

// Interceptor para agregar tenantId automáticamente a las URLs
clienteAxios.interceptors.request.use(async (config) => {
  config.headers['x-api-key'] = import.meta.env.VITE_API_KEY;

  // Solo modificar URLs que contienen el placeholder {tenantId}
  if (config.url && config.url.includes('{tenantId}')) {
    try {
      // Obtener el tenantId del store local (sin hacer petición HTTP)
      const tenantId = await window.api.getTenantId()

      if (tenantId) {
        config.url = config.url.replace('{tenantId}', tenantId)
      } else {
        throw new Error('No tenantId found in store')
      }
    } catch (error) {
      console.error('Error obteniendo tenantId del store:', error)
      // Redirigir al login o manejar error
      window.location.href = '/'
      return Promise.reject(error)
    }
  }

  return config
})

export default clienteAxios;
