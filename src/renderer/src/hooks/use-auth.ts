import { useQuery } from '@tanstack/react-query'

interface AuthUser {
  id: string
  username: string
  role: string
}

interface AuthData {
  user: AuthUser | null
  tenantId: string | null
}

const getCurrentUser = async (): Promise<AuthData> => {
  try {
    // Obtener datos del store local (electron-store)
    const [user, tenantId] = await Promise.all([
      window.api.getUser(),
      window.api.getTenantId()
    ])

    return {
      user,
      tenantId
    }
  } catch (error) {
    console.error('Error obteniendo datos del store:', error)
    return {
      user: null,
      tenantId: null
    }
  }
}

export function useAuth() {
  const { data, isLoading, error } = useQuery<AuthData>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: Infinity, // Los datos del store son siempre válidos hasta que cambien
  })

  return {
    user: data?.user || null,
    isLoading,
    isAuthenticated: !!data?.user,
    tenantId: data?.tenantId || null,
    error
  }
}
