import { Ingredient } from '@/types/ingredient'
import { isAxiosError } from 'axios'
import { ingredientsRoute } from '@/lib/routes'
import clienteAxios from '@/config/axios'

type response = {
  message: string
  ingredient: Ingredient
}

const getIngredients = async (): Promise<Ingredient[]> => {
  try {
    const { data } = await clienteAxios.get(ingredientsRoute)
    return data
  } catch (error) {
    console.log('[ERROR] getIngredients: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const createIngredient = async (ingredient: Ingredient): Promise<response> => {
  try {
    const { data } = await clienteAxios.post(ingredientsRoute, ingredient)
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
    const { data } = await clienteAxios.put(`${ingredientsRoute}/${id}`, { description })
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
    const { data } = await clienteAxios.delete(`${ingredientsRoute}/${id}`)
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
