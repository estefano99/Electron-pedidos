import { isAxiosError } from 'axios'
import { ordersBack, tenantRoute } from '@/lib/routes'
import clienteAxios from '@/config/axios'
import { getTenantId } from '@/lib/functions'
import { NewOrder, Order, OrderStatus, OrderFilterStatus } from '@/types/order'
import { format } from 'date-fns'

export type GetOrdersResponse = {
  message: string
  orders: Order[]
}

const getOrdersTodayByStatus = async (
  status: OrderFilterStatus,
  date?: Date
): Promise<GetOrdersResponse> => {
  const tenantId = getTenantId()
  // si viene date → lo mando como query param YYYY-MM-DD, por ahora se utiliza en el dashboard el date y en panel orders se setea la fecha por de hoy default en el back
  const dateFormateado = date ? format(date, 'yyyy-MM-dd') : undefined //local
  const dateParam = dateFormateado ? `?date=${dateFormateado}` : ''
  try {
    const { data } = await clienteAxios.get(
      `${tenantRoute}/${tenantId}/${ordersBack}/today/${status}${dateParam}`
    )
    return data
  } catch (error) {
    console.log('[ERROR] getOrdersTodayByStatus: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const createOrder = async (order: NewOrder): Promise<Order> => {
  const tenantId = getTenantId()
  //DTO para el backend
  const orderForBackend = {
    ...order,
    items: order.items.map((item) => ({
      productId: item.product.id,
      quantity: 1,
      ingredients: [
        ...item.includedIngredients.map((i) => ({
          ingredientId: i.id,
          isAdded: true
        })),
        ...item.excludedIngredients.map((i) => ({
          ingredientId: i.id,
          isAdded: false
        }))
      ]
    }))
  }

  try {
    const { data }: { data: Order } = await clienteAxios.post(
      `${tenantRoute}/${tenantId}/${ordersBack}`,
      orderForBackend
    )
    return data
  } catch (error) {
    console.log('[ERROR] createOrder: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}

const updateStatusOrder = async (orderId: string, status: OrderStatus): Promise<Order> => {
  const tenantId = getTenantId()
  try {
    const { data }: { data: Order } = await clienteAxios.patch(
      `${tenantRoute}/${tenantId}/${ordersBack}/${orderId}`,
      { status }
    )
    return data
  } catch (error) {
    console.log('[ERROR] updateStatusOrder: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}

export { createOrder, getOrdersTodayByStatus, updateStatusOrder }
