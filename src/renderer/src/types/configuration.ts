export type RestaurantSettings = {
  id: string
  displayName: string
  suscriptionType: suscriptionType
  instagramUrl?: string
  phone?: string
  address?: string
  latitude?: string
  longitude?: string
  imageFile?: File
  logoUrl?: string
}

//Type para la data del login, osea sin validacion del middleware del back
export type RestaurantSettingsPublic = Omit<RestaurantSettings, 'id' | 'phone' | 'suscriptionType' | 'imageFile'>

export enum suscriptionType {
  DEMO = 'DEMO',
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  PREMIUM = 'PREMIUM'
}
