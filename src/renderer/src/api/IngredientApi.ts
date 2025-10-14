import { GetIngredientResponse, Ingredient, IngredientForm } from '@/types/ingredient'
import { isAxiosError } from 'axios'
import { getIngredientsRoute, getIngredientRoute } from '@/lib/routes'
import clienteAxios from '@/config/axios'

const getIngredients = async (): Promise<GetIngredientResponse> => {
  try {
    const { data } = await clienteAxios.get(getIngredientsRoute())
    return data
  } catch (error) {
    console.error('[ERROR] getIngredients: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const createIngredient = async (ingredient: IngredientForm): Promise<Ingredient> => {
  try {
    const { data } = await clienteAxios.post(
      getIngredientsRoute(),
      ingredient
    )
    return data
  } catch (error) {
    console.error('[ERROR] createIngredients: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const editIngredient = async (ingredient: Ingredient): Promise<Ingredient> => {
  const { id, description, extraPrice, isActive } = ingredient
  try {
    const { data } = await clienteAxios.put(getIngredientRoute(id), {
      description,
      extraPrice,
      isActive
    })
    return data
  } catch (error) {
    console.error('[ERROR] editIngredient: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const deleteIngredient = async (ingredient: Ingredient) => {
  const { id } = ingredient
  try {
    const { data } = await clienteAxios.delete(
      getIngredientRoute(id)
    )
    return data
  } catch (error) {
    console.error('[ERROR] deleteIngredient: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

export { getIngredients, createIngredient, editIngredient, deleteIngredient }
