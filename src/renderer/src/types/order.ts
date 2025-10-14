import { Ingredient } from './ingredient'
import { ProductWithIngredients } from './product'

// Estructura para enviar ingredientes al backend
export interface OrderItemIngredientForBackend {
  ingredientId: string
  isAdded: boolean // true = agregado; false = remoción
  quantity: number
  unitPrice?: number // precio unitario del ingrediente al momento del pedido
}

// Estructura que viene del backend para ingredientes customizados
export interface OrderItemIngredientCustomization {
  isAdded: boolean
  quantity: number
  unitPrice: number
  ingredient: {
    id: string
    description: string
  }
}

export interface OrderItem {
  id: string
  product: ProductWithIngredients
  includedIngredients: Ingredient[] // Para mostrar en UI (compatibilidad)
  excludedIngredients: Ingredient[] // Para mostrar en UI (compatibilidad)
  totalPrice: number
  unitPrice?: number //Se usa cuando viene del back, pero no cuando se crea una orden del front
  quantity: number
  // Nueva estructura para el backend (al crear orden)
  ingredientsForBackend?: OrderItemIngredientForBackend[]
  // Estructura que viene del backend (al leer órdenes)
  ingredientCustomizations?: OrderItemIngredientCustomization[]
}

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PREPARATION = 'IN_PREPARATION',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

//Este se utiliza para los filtros, porque tiene every, el modelo de la db no tiene every.
export enum OrderFilterStatus {
  ALL = "ALL",
  PENDING = "PENDING",
  IN_PREPARATION = "IN_PREPARATION",
  READY = "READY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
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
  tenantId?: string
  tenantDisplayName?: string
  createdAt: Date
}

export type NewOrder = Omit<Order, 'createdAt' | 'code'>
