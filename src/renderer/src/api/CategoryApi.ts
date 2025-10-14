import { category, categoryForm, GetCategoriesResponse } from '@/types/category'
import { isAxiosError } from 'axios'
import { getCategoriesRoute, getCategoryRoute } from '@/lib/routes'
import clienteAxios from '@/config/axios'

const getCategories = async (): Promise<GetCategoriesResponse> => {
  try {
    const { data } = await clienteAxios.get(getCategoriesRoute())
    return data
  } catch (error) {
    console.error('[ERROR] getCategories: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const createCategory = async (category: categoryForm): Promise<category> => {
  try {
    const { data } = await clienteAxios.post(
      getCategoriesRoute(),
      category
    )
    return data
  } catch (error) {
    console.error('[ERROR] createCategory: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}

const editCategory = async (category: category): Promise<category> => {
  const { id, description, isActive } = category

  try {
    const { data } = await clienteAxios.put(getCategoryRoute(id), {
      description,
      isActive
    })
    return data
  } catch (error) {
    console.error('[ERROR] editCategory: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const deleteCategory = async (category: category) => {
  const { id } = category
  try {
    const { data } = await clienteAxios.delete(getCategoryRoute(id))
    return data
  } catch (error) {
    console.error('[ERROR] deleteCategory: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

export { getCategories, createCategory, editCategory, deleteCategory }
