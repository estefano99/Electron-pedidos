import { OrderStatus } from '@/types/order'
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

export const statusColors = {
  [OrderStatus.PENDING]: { bg: 'bg-yellow-500 hover:bg-yellow-700', text: 'text-white', label: 'Pendiente' },
  [OrderStatus.IN_PREPARATION]: { bg: 'bg-blue-500 hover:bg-blue-700', text: 'text-white', label: 'En preparación' },
  [OrderStatus.READY]: { bg: 'bg-green-500 hover:bg-green-700', text: 'text-white', label: 'Preparado' },
  [OrderStatus.DELIVERED]: { bg: 'bg-gray-500 hover:bg-gray-700', text: 'text-white', label: 'Delivery' },
  [OrderStatus.CANCELLED]: { bg: 'bg-red-500 hover:bg-red-700', text: 'text-white', label: 'Cancelado' }
}
