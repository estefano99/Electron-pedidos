import { category } from './category'
import { Ingredient } from './ingredient'

export type Product = {
  id: string
  name: string
  description: string
  price: number
  imgUrl: string
  isActive: boolean
  categoryId: string
  category: category
  created_at: Date
  updated_at: Date
}

export type ProductIngredient = {
  id: string
  ingredientId: string
  productId: string
  isMandatory: boolean
  quantity: number
  ingredient: Ingredient
}

export type ProductWithIngredients = Product & {
  ingredients: {
    ingredient: Ingredient
    isMandatory: boolean
  }[]
}

//type que se utiliza en el formulario de alta de productos
export type CreateProductForm = {
  name: string
  description: string
  price: number
  categoryId: string
  isActive: boolean
  ingredients: {
    id: string
    description: string
    isMandatory: boolean
  }[]
  imgUrl: File
}

export type UpdateProductForm = CreateProductForm & {
  id: string
}
