import { Ingredient } from './ingredient'
import { ProductWithIngredients } from './product'

export interface OrderItem {
  id: string
  product: ProductWithIngredients
  includedIngredients: Ingredient[]
  excludedIngredients: Ingredient[]
  totalPrice: number
}

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PREPARATION = 'IN_PREPARATION',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum OrderSource {
  LOCAL = 'LOCAL',
  ONLINE = 'ONLINE'
}

export interface Order {
  id: string
  customerName?: string
  scheduledTime?: Date
  items: OrderItem[]
  total: number
  status: OrderStatus
  code: string
  source: OrderSource
  userId?: string
  tenantId: string
  createdAt: Date
}

export type NewOrder = Omit<Order, 'createdAt' | 'code'>
