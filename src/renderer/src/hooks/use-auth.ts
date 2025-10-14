import { useQuery } from '@tanstack/react-query'
import clienteAxios from '@/config/axios'

interface AuthUser {
  tenantId: string | null
  userId: string
  role: string
}

const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data } = await clienteAxios.get('/auth/me')
    return data
  } catch (error) {
    return null
  }
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<AuthUser | null>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false, // No reintentar si falla
    staleTime: 5 * 60 * 1000, // 5 minutos
  })

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    tenantId: user?.tenantId || null,
    error
  }
}
