import { isAxiosError } from 'axios'
import { getConfigurationRoute, getPublicConfigurationRoute } from '@/lib/routes'
import clienteAxios from '@/config/axios'
import { RestaurantSettings } from '@/types/configuration'

const getConfiguration = async () => {
  try {
    const { data } = await clienteAxios.get(getConfigurationRoute())
    return data
  } catch (error) {
    console.log('[ERROR] getConfiguration: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const getConfigurationPublic = async () => {
  try {
    const { data } = await clienteAxios.get(getPublicConfigurationRoute())
    return data
  } catch (error) {
    console.log('[ERROR] getConfiguration: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

const createConfiguration = async (settings: RestaurantSettings) => {
  console.log(settings)

  const formData = new FormData()
  formData.append('displayName', settings.displayName)
  formData.append('instagramUrl', settings.instagramUrl ?? '')
  formData.append('phone', settings.phone ?? '')
  formData.append('address', settings.address ?? '')
  formData.append('latitude', settings.latitude ?? '')
  formData.append('longitude', settings.longitude ?? '')

  if (settings.imageFile instanceof File) {
    formData.append('image', settings.imageFile)
  }
  console.log(formData)
  try {
    const { data } = await clienteAxios.put(
      getConfigurationRoute(),
      formData
    )
    return data
  } catch (error) {
    console.log('[ERROR] createConfiguration: ', error)
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    }
    throw error
  }
}

export { getConfiguration, createConfiguration, getConfigurationPublic }
