import { isAxiosError } from 'axios'
import { configurationBack, tenantRoute } from '@/lib/routes'
import clienteAxios from '@/config/axios'
import { getTenantId } from '@/lib/functions'
import { RestaurantSettings } from '@/types/configuration'

const getConfiguration = async () => {
  const tenantId = getTenantId()
  try {
    const { data } = await clienteAxios.get(`${tenantRoute}/${tenantId}/${configurationBack}`)
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
  const tenantId = getTenantId()

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
      `${tenantRoute}/${tenantId}/${configurationBack}`,
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

export { getConfiguration, createConfiguration }
