import { category, categoryForm } from '@/types/category'
import { isAxiosError } from 'axios'
import { categoryRoute } from '@/lib/routes'
import clienteAxios from '@/config/axios'

type response = {
  message: string
  category: category
}

const getCategories = async (isActive?: boolean): Promise<category[]> => {
  const state = isActive === undefined ? true : isActive ? true : false;
  try {
    const { data } = await clienteAxios.get(`${categoryRoute}?isActive=${state}`)
    return data
  } catch (error) {
    console.log('[ERROR] getCategories: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const createCategory = async (category: categoryForm): Promise<response> => {
  try {
    const { data } = await clienteAxios.post(categoryRoute, category)
    return data
  } catch (error) {
    console.log('[ERROR] createCategory: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const editCategory = async (category: category): Promise<response> => {
  const { id, description } = category
  try {
    const { data } = await clienteAxios.put(`${categoryRoute}/${id}`, { description })
    return data
  } catch (error) {
    console.log('[ERROR] editCategory: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const deleteCategory = async (category: category) => {
  const { id } = category
  try {
    const { data } = await clienteAxios.delete(`${categoryRoute}/${id}`)
    return data
  } catch (error) {
    console.log('[ERROR] deleteCategory: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

export { getCategories, createCategory, editCategory, deleteCategory }
