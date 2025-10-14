import { isAxiosError } from 'axios'
import clienteAxios from '@/config/axios'
import {
  CreateProductForm,
  Product,
  ProductWithIngredients,
  UpdateProductForm
} from '@/types/product'
import { getProductsRoute, getProductRoute } from '@/lib/routes'

const getProducts = async (): Promise<ProductWithIngredients[]> => {
  try {
    const { data } = await clienteAxios.get(getProductsRoute())
    return data
  } catch (error) {
    console.log('[ERROR] getProducts: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const createProduct = async (product: CreateProductForm): Promise<Product> => {
  try {
    // 1) Armás el FormData
    const formData = new FormData()
    formData.append('name', product.name)
    formData.append('description', product.description)
    formData.append('price', String(product.price))
    formData.append('categoryId', product.categoryId)
    formData.append('isActive', String(product.isActive))
    formData.append('ingredients', JSON.stringify(product.ingredients))
    if (product.imgUrl instanceof File) {
      formData.append('image', product.imgUrl)
    }

    const { data } = await clienteAxios.post<Product>(
      getProductsRoute(),
      formData
    )
    return data
  } catch (error) {
    console.log('[ERROR] createProducts: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const updateProduct = async (product: UpdateProductForm): Promise<Product> => {
  console.log(product)
  try {
    // 1) Armás el FormData
    const formData = new FormData()
    formData.append('name', product.name)
    formData.append('description', product.description)
    formData.append('price', String(product.price))
    formData.append('categoryId', product.categoryId)
    formData.append('isActive', String(product.isActive))
    formData.append('ingredients', JSON.stringify(product.ingredients))
    if (product.imgUrl instanceof File) {
      formData.append('image', product.imgUrl)
    }

    const { data } = await clienteAxios.put<Product>(
      getProductRoute(product.id),
      formData
    )
    return data
  } catch (error) {
    console.log('[ERROR] updateProduct: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const deleteProduct = async (product: ProductWithIngredients): Promise<Product> => {
  try {
    const { data } = await clienteAxios.delete(
      getProductRoute(product.id)
    )
    return data
  } catch (error) {
    console.log('[ERROR] deleteProduct: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

export { getProducts, createProduct, updateProduct, deleteProduct }
