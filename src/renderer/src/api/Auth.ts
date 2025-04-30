import clienteAxios from '@/config/axios'
import { loginRoute } from '@/lib/routes'
import { UserType } from '@/types/user'
import { isAxiosError } from 'axios'

const login = async (usuario: UserType) => {
  try {
    const { data } = await clienteAxios.post(loginRoute, usuario)
    console.log(data)
    localStorage.setItem('AUTH_TOKEN', data.token)
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

export { login }
