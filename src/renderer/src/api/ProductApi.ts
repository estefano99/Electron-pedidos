import { isAxiosError } from 'axios'
import clienteAxios from '@/config/axios'
import { ProductWithIngredients } from '@/types/product'
import { productsRoute } from '@/lib/routes'

type response = {
  message: string
  product: ProductWithIngredients
}

const getProducts = async (): Promise<ProductWithIngredients[]> => {
  try {
    const { data } = await clienteAxios.get(`${productsRoute}`)
    return data
  } catch (error) {
    console.log('[ERROR] getProducts: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const createProduct = async (product: ProductWithIngredients): Promise<response> => {
  try {
    const { data } = await clienteAxios.post(productsRoute, product, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return data
  } catch (error) {
    console.log('[ERROR] createProducts: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

export { getProducts, createProduct }
