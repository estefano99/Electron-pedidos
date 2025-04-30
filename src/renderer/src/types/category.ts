export interface category {
  id: string
  description: string
  isActive: boolean
}

export type categoryForm = Omit<category, 'id'>

export type GetCategoriesResponse = {
  message: string
  categories: category[]
}
