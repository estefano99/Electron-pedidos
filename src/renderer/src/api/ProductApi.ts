import { isAxiosError } from 'axios'
import clienteAxios from '@/config/axios'
import {
  CreateProductForm,
  Product,
  ProductWithIngredients,
  UpdateProductForm
} from '@/types/product'
import { productsBack, tenantRoute } from '@/lib/routes'
import { getTenantId } from '@/lib/functions'

const getProducts = async (): Promise<ProductWithIngredients[]> => {
  const tenantId = getTenantId()
  try {
    const { data } = await clienteAxios.get(`${tenantRoute}/${tenantId}/${productsBack}`)
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
    const tenantId = getTenantId()
    // 1) Armás el FormData
    const formData = new FormData()
    formData.append('name', product.name)
    formData.append('description', product.description)
    formData.append('price', String(product.price))
    formData.append('categoryId', product.categoryId)
    formData.append('isActive', String(product.isActive))
    formData.append('ingredients', JSON.stringify(product.ingredients))
    formData.append('image', product.imgUrl)

    // formData.forEach((value, key) => {
    //   console.log(key, value)
    // })

    const { data } = await clienteAxios.post<Product>(
      `${tenantRoute}/${tenantId}/${productsBack}`,
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
    const tenantId = getTenantId()
    // 1) Armás el FormData
    const formData = new FormData()
    formData.append('name', product.name)
    formData.append('description', product.description)
    formData.append('price', String(product.price))
    formData.append('categoryId', product.categoryId)
    formData.append('isActive', String(product.isActive))
    formData.append('ingredients', JSON.stringify(product.ingredients))
    formData.append('image', product.imgUrl)

    const { data } = await clienteAxios.put<Product>(
      `${tenantRoute}/${tenantId}/${productsBack}/${product.id}`,
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
  const tenantId = getTenantId()
  try {
    const { data } = await clienteAxios.delete(
      `${tenantRoute}/${tenantId}/${productsBack}/${product.id}`
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
