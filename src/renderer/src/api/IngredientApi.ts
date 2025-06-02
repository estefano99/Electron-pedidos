import { GetIngredientResponse, Ingredient, IngredientForm } from '@/types/ingredient'
import { isAxiosError } from 'axios'
import { ingredientsBack, tenantRoute } from '@/lib/routes'
import clienteAxios from '@/config/axios'
import { getTenantId } from '@/lib/functions'

const getIngredients = async (): Promise<GetIngredientResponse> => {
  const tenantId = getTenantId()
  try {
    const { data } = await clienteAxios.get(`${tenantRoute}/${tenantId}/${ingredientsBack}`)
    return data
  } catch (error) {
    console.log('[ERROR] getIngredients: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const createIngredient = async (ingredient: IngredientForm): Promise<Ingredient> => {
  const tenantId = getTenantId()
  try {
    const { data } = await clienteAxios.post(
      `${tenantRoute}/${tenantId}/${ingredientsBack}`,
      ingredient
    )
    return data
  } catch (error) {
    console.log('[ERROR] createIngredients: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const editIngredient = async (ingredient: Ingredient): Promise<Ingredient> => {
  const tenantId = getTenantId()

  const { id, description } = ingredient
  try {
    const { data } = await clienteAxios.put(`${tenantRoute}/${tenantId}/${ingredientsBack}/${id}`, {
      description
    })
    return data
  } catch (error) {
    console.log('[ERROR] editIngredient: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const deleteIngredient = async (ingredient: Ingredient) => {
  const tenantId = getTenantId()

  const { id } = ingredient
  try {
    const { data } = await clienteAxios.delete(
      `${tenantRoute}/${tenantId}/${ingredientsBack}/${id}`
    )
    return data
  } catch (error) {
    console.log('[ERROR] deleteIngredient: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

export { getIngredients, createIngredient, editIngredient, deleteIngredient }
