import { category } from './category'
import { Ingredient } from './ingredient'

export type Product = {
  id: string
  name: string
  description: string
  unitaryPrice: number
  urlImage: string
  isActive: boolean
  categoryId: string
  category: category
  created_at: Date
  updated_at: Date
}

export type ProductIngredient = {
  id: string
  idProduct: number
  idIngredient: number
  isMandatory: boolean
}

export type ProductWithIngredients = Product & {
  ingredients: {
    ingredient: Ingredient
    isMandatory: boolean
  }[]
}
