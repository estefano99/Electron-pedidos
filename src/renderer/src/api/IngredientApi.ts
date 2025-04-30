import { GetIngredientResponse, Ingredient, IngredientForm } from '@/types/ingredient'
import { isAxiosError } from 'axios'
import { ingredientsBack, tenantRoute } from '@/lib/routes'
import clienteAxios from '@/config/axios'
import { getTenantId } from '@/lib/functions'

type response = {
  message: string
  ingredient: Ingredient
}

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

const createIngredient = async (ingredient: IngredientForm): Promise<response> => {
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

const editIngredient = async (ingredient: Ingredient): Promise<response> => {
  const { id, description } = ingredient
  try {
    const { data } = await clienteAxios.put(`${ingredientsBack}/${id}`, { description })
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
  const { id } = ingredient
  try {
    const { data } = await clienteAxios.delete(`${ingredientsBack}/${id}`)
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
