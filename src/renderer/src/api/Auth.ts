import clienteAxios from '@/config/axios'
import { loginRoute } from '@/lib/routes'
import { UserType } from '@/types/user'
import { isAxiosError } from 'axios'

const login = async (usuario: UserType) => {
  try {
    const { data } = await clienteAxios.post(loginRoute, usuario)
    // Ya no guardamos el token en localStorage, viene por cookie
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

export { login }
