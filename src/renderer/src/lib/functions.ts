import { jwtDecode, JwtPayload } from 'jwt-decode'

interface CustomPayload extends JwtPayload {
  tenantId?: string
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

export const getToken = (): JwtPayload | null => {
  const token = localStorage.getItem('AUTH_TOKEN')
  if (!token) return null

  try {
    const decoded = jwtDecode<JwtPayload>(token)
    if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('AUTH_TOKEN')
      return null
    }
    return decoded
  } catch (error) {
    console.error('Error al decodificar el token:', error)
    localStorage.removeItem('AUTH_TOKEN')
    return null
  }
}

export const getTenantId = (): string | null => {
  const token = localStorage.getItem('AUTH_TOKEN')
  if (!token) return null

  try {
    const decoded = jwtDecode<CustomPayload>(token)

    if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('AUTH_TOKEN')
      return null
    }

    return decoded.tenantId || null
  } catch (error) {
    console.error('Error al decodificar el token:', error)
    localStorage.removeItem('AUTH_TOKEN')
    return null
  }
}
