import { isAxiosError } from 'axios'
import { ordersBack, tenantRoute } from '@/lib/routes'
import clienteAxios from '@/config/axios'
import { getTenantId } from '@/lib/functions'
import { NewOrder, Order, OrderStatus } from '@/types/order'

export type GetOrdersResponse = {
  message: string
  orders: Order[]
}

const getOrdersTodayByStatus = async (status: OrderStatus): Promise<GetOrdersResponse> => {
  const tenantId = getTenantId()
  try {
    const { data } = await clienteAxios.get(`${tenantRoute}/${tenantId}/${ordersBack}/today/${status}`)
    return data
  } catch (error) {
    console.log('[ERROR] getOrdersTodayByStatus: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const createOrder = async (order: NewOrder): Promise<NewOrder> => {
  const tenantId = getTenantId()
  const orderForBackend = {
    ...order,
    items: order.items.map((item) => ({
      productId: item.product.id, // ✅ ahora sí
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
    const { data }: { data: NewOrder } = await clienteAxios.post(
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

export { createOrder, getOrdersTodayByStatus }
