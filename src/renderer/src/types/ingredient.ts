export interface Ingredient {
  id: string
  description: string
}

export type IngredientForm = Omit<Ingredient, 'id'>

export type GetIngredientResponse = {
  message: string
  ingredients: Ingredient[]
}
