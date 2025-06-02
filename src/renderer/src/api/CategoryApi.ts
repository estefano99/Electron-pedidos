import { category, categoryForm, GetCategoriesResponse } from '@/types/category'
import { isAxiosError } from 'axios'
import { categoriesBack, tenantRoute } from '@/lib/routes'
import clienteAxios from '@/config/axios'
import { getTenantId } from '@/lib/functions'

const getCategories = async (): Promise<GetCategoriesResponse> => {
  const tenantId = getTenantId()
  try {
    const { data } = await clienteAxios.get(`${tenantRoute}/${tenantId}/${categoriesBack}`)
    return data
  } catch (error) {
    console.log('[ERROR] getCategories: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const createCategory = async (category: categoryForm): Promise<category> => {
  const tenantId = getTenantId()
  try {
    const { data } = await clienteAxios.post(
      `${tenantRoute}/${tenantId}/${categoriesBack}`,
      category
    )
    return data
  } catch (error) {
    console.log('[ERROR] createCategory: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
}

const editCategory = async (category: category): Promise<category> => {
  const tenantId = getTenantId()
  const { id, description } = category

  try {
    const { data } = await clienteAxios.put(`${tenantRoute}/${tenantId}/${categoriesBack}/${id}`, {
      description
    })
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
  const tenantId = getTenantId()
  const { id } = category
  try {
    const { data } = await clienteAxios.delete(`${tenantRoute}/${tenantId}/${categoriesBack}/${id}`)
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
