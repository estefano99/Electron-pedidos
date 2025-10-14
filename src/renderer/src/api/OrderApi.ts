import { isAxiosError } from 'axios'
import { getOrdersRoute, getCreateLocalOrderRoute, getUpdateOrderStatusRoute } from '@/lib/routes'
import clienteAxios from '@/config/axios'
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
  // si viene date → lo mando como query param YYYY-MM-DD, por ahora se utiliza en el dashboard el date y en panel orders se setea la fecha por de hoy default en el back
  const dateFormateado = date ? format(date, 'yyyy-MM-dd') : undefined //local
  const dateParam = dateFormateado ? `?date=${dateFormateado}` : ''
  try {
    const { data } = await clienteAxios.get(
      `${getOrdersRoute()}/today/${status}${dateParam}`
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
  //DTO para el backend
  const orderForBackend = {
    ...order,
    items: order.items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      ingredients: item.ingredientsForBackend || []
    }))
  }
  console.log("🚀 ~ createOrder ~ orderForBackend:", orderForBackend)

  try {
    const { data }: { data: Order } = await clienteAxios.post(
      getCreateLocalOrderRoute(),
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
  try {
    const { data }: { data: Order } = await clienteAxios.patch(
      getUpdateOrderStatusRoute(orderId),
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
