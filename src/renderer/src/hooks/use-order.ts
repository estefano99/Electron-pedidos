import { useQuery, useQueryClient } from '@tanstack/react-query'
import { OrderItem, OrderStatus, NewOrder, OrderSource } from '@/types/order'
import { getTenantId } from '@/lib/functions'
import { v4 as uuidv4 } from 'uuid'

export function useOrder() {
  const queryClient = useQueryClient()

  // Hacemos que currentOrder sea reactivo
  const { data: currentOrder } = useQuery<NewOrder | null>({
    queryKey: ['currentOrder'],
    queryFn: async () => {
      return queryClient.getQueryData<NewOrder>(['currentOrder']) ?? null
    },
    staleTime: Infinity
  })

  const allOrders = queryClient.getQueryData<NewOrder[]>(['allOrders']) || []

  const startNewOrder = (customerName: string, scheduledTime: Date | null) => {
    const tenantId = getTenantId()
    if (!tenantId) throw new Error('Tenant ID no encontrado')

    const newOrder: NewOrder = {
      id: uuidv4(),
      customerName,
      scheduledTime: scheduledTime ?? undefined,
      items: [],
      total: 0,
      status: OrderStatus.PENDING,
      source: OrderSource.LOCAL,
      tenantId
    }

    queryClient.setQueryData(['currentOrder'], newOrder)
  }

  const addItemToCurrentOrder = (item: OrderItem) => {
    const order = queryClient.getQueryData<NewOrder>(['currentOrder'])
    if (!order) return

    const updatedItems = [...order.items, item]
    const updatedTotal = updatedItems.reduce((sum, i) => sum + i.totalPrice, 0)

    queryClient.setQueryData(['currentOrder'], {
      ...order,
      items: updatedItems,
      total: updatedTotal
    })
  }

  const removeItemFromCurrentOrder = (itemId: string) => {
    const order = queryClient.getQueryData<NewOrder>(['currentOrder'])
    if (!order) return

    const newItems = order.items.filter((item) => item.id !== itemId)
    const newTotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0)

    queryClient.setQueryData(['currentOrder'], {
      ...order,
      items: newItems,
      total: newTotal
    })
  }

  const editItemInCurrentOrder = (itemId: string, newItem: OrderItem) => {
    const order = queryClient.getQueryData<NewOrder>(['currentOrder'])
    if (!order) return

    const filteredItems = order.items.filter((item) => item.id !== itemId)
    const updatedItems = [...filteredItems, newItem]
    const updatedTotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0)

    queryClient.setQueryData(['currentOrder'], {
      ...order,
      items: updatedItems,
      total: updatedTotal
    })
  }

  const completeCurrentOrder = () => {
    const order = queryClient.getQueryData<NewOrder>(['currentOrder'])
    if (!order || order.items.length === 0) return
    const updatedOrders = [...allOrders, order]
    queryClient.setQueryData(['allOrders'], updatedOrders)
    queryClient.removeQueries({ queryKey: ['currentOrder'] })
  }

  const clearCurrentOrder = () => {
    queryClient.removeQueries({ queryKey: ['currentOrder'] })
  }

  return {
    currentOrder,
    allOrders,
    startNewOrder,
    addItemToCurrentOrder,
    removeItemFromCurrentOrder,
    completeCurrentOrder,
    clearCurrentOrder,
    editItemInCurrentOrder
  }
}
