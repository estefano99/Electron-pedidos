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

export enum suscriptionType {
  DEMO = 'DEMO',
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  PREMIUM = 'PREMIUM'
}
