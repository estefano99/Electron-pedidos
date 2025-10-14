export interface Ingredient {
  id: string
  description: string
  extraPrice: number
  isActive: boolean
}

export type IngredientForm = Omit<Ingredient, 'id'>

export type GetIngredientResponse = Ingredient[]
