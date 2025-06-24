import { Order, OrderStatus } from '@/types/order'
import { jwtDecode, JwtPayload } from 'jwt-decode'

interface CustomPayload extends JwtPayload {
  tenantId?: string
}

export const statusColors = {
  [OrderStatus.PENDING]: {
    bg: 'bg-yellow-500 hover:bg-yellow-700',
    text: 'text-white',
    label: 'Pendiente'
  },
  [OrderStatus.IN_PREPARATION]: {
    bg: 'bg-blue-500 hover:bg-blue-700',
    text: 'text-white',
    label: 'Preparando'
  },
  [OrderStatus.READY]: {
    bg: 'bg-green-500 hover:bg-green-700',
    text: 'text-white',
    label: 'Listo'
  },
  [OrderStatus.DELIVERED]: {
    bg: 'bg-gray-500 hover:bg-gray-700',
    text: 'text-white',
    label: 'Delivery'
  },
  [OrderStatus.CANCELLED]: {
    bg: 'bg-red-500 hover:bg-red-700',
    text: 'text-white',
    label: 'Cancelado'
  }
}

export const orderStatuses: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.IN_PREPARATION,
  OrderStatus.READY,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED
] as const

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

export const imprimirTicket = async (order: Order) => {
  const config = JSON.parse(localStorage.getItem('impresoras_config') || '{}')
  const { impresora, modo } = config['cocina'] || {}

  if (!impresora || !modo) {
    console.warn('⚠️ No hay configuración de impresora para cocina')
    return
  }

  const html = generarHTMLTicket(order)

  const result = await window.api.printOrderTicket({ printerName: impresora, html })

  if (!result.ok) {
    console.error(`Error al imprimir: ${result.error}`)
  }
}

function generarHTMLTicket(data: Order): string {
  const hora = data.scheduledTime
    ? new Date(data.scheduledTime).toLocaleTimeString()
    : 'Sin horario'

  return `
 <div style="font-family: monospace; padding: 8px; font-size: 12px;">
    <div style="text-align: center; margin-bottom: 8px;">
      <h2 style="margin: 0; font-size: 16px;">${data.tenantDisplayName}</h2>
      <p style="margin: 2px 0;">Cliente: <strong>${data.customerName ?? 'Sin nombre'}</strong></p>
      <p style="margin: 2px 0;">Entrega: ${hora}</p>
    </div>

    <hr style="border-top: 1px dashed black;" />

    <p><strong>Productos: ${data.items.length}</strong></p>

    <hr style="border-top: 1px dashed black;" />

    <div>
      ${data.items
        .map(
          (item) => `
        <div style="margin-bottom: 6px;">
          <p style="margin: 0;"><strong> ${item.product.name}</strong></p>
          ${
            item.excludedIngredients.length > 0
              ? `<ul style="margin: 0 0 0 12px; padding: 0; list-style: none;">
                ${item.excludedIngredients.map((i) => `<li style="color: red;">--> Sin: ${i.description}</li>`).join('')}
              </ul>`
              : ''
          }
        </div>
      `
        )
        .join('')}
    </div>

    <hr style="border-top: 1px dashed black;" />

    <div style="text-align: center;">
      <p style="margin: 4px 0;"><strong>TOTAL: ${formatPrice(data.total)}</strong></p>
      <p style="margin: 4px 0;">${new Date().toLocaleString()}</p>
    </div>
      <br/>
      <br/>
    <p style="text-align: center;">&nbsp;</p>
  </div>
  `
}
