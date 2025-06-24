import { Ingredient } from './ingredient'
import { ProductWithIngredients } from './product'

export interface OrderItem {
  id: string
  product: ProductWithIngredients
  includedIngredients: Ingredient[]
  excludedIngredients: Ingredient[]
  totalPrice: number
  unitPrice?: number //Se usa cuando viene del back, pero no cuando se crea una orden del front
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
  tenantDisplayName?: string
  createdAt: Date
}

export type NewOrder = Omit<Order, 'createdAt' | 'code'>
