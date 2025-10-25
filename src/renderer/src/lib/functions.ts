import { Order, OrderFilterStatus, OrderStatus } from '@/types/order'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { jwtDecode, JwtPayload } from 'jwt-decode'

interface CustomPayload extends JwtPayload {
  tenantId?: string
}

export const statusColors = {
  [OrderFilterStatus.ALL]: {
    bg: 'bg-neutral-400 hover:bg-neutral-600',
    text: 'text-white',
    label: 'Todos'
  },
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

//Utiliza el type para filters, osea agrega el every para filtros en panel de orderHistory. No como el order status original que no tiene every
export const orderFilterStatuses: OrderFilterStatus[] = [
  OrderFilterStatus.ALL,
  OrderFilterStatus.PENDING,
  OrderFilterStatus.IN_PREPARATION,
  OrderFilterStatus.READY,
  OrderFilterStatus.DELIVERED,
  OrderFilterStatus.CANCELLED
] as const

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

export const formatDateHelper = (selectedDate: Date | null) => {
  if (!selectedDate) return null;
  return format(selectedDate, 'PPP', { locale: es })
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
    throw new Error('No hay configuración de impresora')
  }
  const html = generarHTMLTicket(order)

  const result = await window.api.printOrderTicket({ printerName: impresora, html })

  if (!result.ok) {
    console.error(`Error al imprimir: ${result.error}`)
    throw new Error(`Error al imprimir: ${result.error}`)
  }
  return { success: true }
}

function generarHTMLTicket(data: Order): string {
  const hora = data.scheduledTime
    ? new Date(data.scheduledTime).toLocaleTimeString()
    : 'Sin horario'

  const line = '--------------'
  const doubleLine = '=============='

  const productos = data.items
    .map((item) => {
      // Ingredientes sacados (isAdded = false)
      const ingredientesSacados = item.ingredientCustomizations
        ? item.ingredientCustomizations
            .filter((ic) => !ic.isAdded)
            .map((ic) => ` <span style="color: #dc2626;">SIN: ${ic.ingredient.description}</span>`)
            .join('<br/>')
        : ''

      // Ingredientes extras (isAdded = true Y unitPrice > 0)
      const ingredientesExtras = item.ingredientCustomizations
        ? item.ingredientCustomizations
            .filter((ic) => ic.isAdded && ic.unitPrice > 0)
            .map((ic) => {
              const precioTotal = ic.unitPrice * ic.quantity * item.quantity
              const precio = ` (+${formatPrice(precioTotal)})`
              return ` <span style="color: #16a34a;">+ ${ic.quantity}x ${ic.ingredient.description}${precio}</span>`
            })
            .join('<br/>')
        : ''

      // 👇 Alineamos el precio a la derecha con puntos intermedios
      const nombreYPrecio =
        `${'-'} ${item.product.name}`.padEnd(15, '.') +
        ` ${item?.unitPrice ? formatPrice(item?.unitPrice) : 'Sin precio'}`

      return `
      <div style="margin-bottom: 6px;">
        ${nombreYPrecio}<br/>
        ${ingredientesSacados}
        ${ingredientesSacados && ingredientesExtras ? '<br/>' : ''}
        ${ingredientesExtras}
      </div>
    `
    })
    .join('')

  return `
    <div style="font-family: monospace; font-size: 13px; padding: 6px;">
    <p>&nbsp;</p>
    <p>&nbsp;</p>
      <div style="text-align: center; margin-bottom: 8px;">
        <h2 style="margin: 0; font-size: 18px;">${data.tenantDisplayName?.toUpperCase() || 'LOCAL SIN NOMBRE'}</h2>
        <p style="margin: 2px 0;">Cliente: <strong>${data.customerName ?? 'Sin nombre'}</strong></p>
        <p style="margin: 2px 0;">Cod. Orden: <strong>${data?.code}</strong></p>
        <p style="margin: 2px 0;">Entrega: ${hora}</p>
      </div>

      <div style="text-align: center; font-size: 12px;">
        <div>${line}</div>
        <div><strong>Productos: ${data.items.length}</strong></div>
        <div>${line}</div>
      </div>

      <div style="margin: 12px 0;">
        ${productos}
      </div>

      <div style="text-align: center;">
        <div>${doubleLine}</div>
        <div style="font-size: 16px;"><strong>TOTAL: ${formatPrice(data.total)}</strong></div>
        <div>${doubleLine}</div>
        <div style="margin-top: 10px;">${new Date().toLocaleString()}</div>
      </div>
    </div>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
  `.trim()
}
