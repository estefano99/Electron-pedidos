export const startRoute = '/inicio'
export const productsRoute = '/productos'
export const ingredientsRoute = '/ingredientes'
export const categoryRoute = '/categorias'
export const ordersRoute = '/pedidos'
export const loginRoute = 'auth/login'
export const configurationRoute = 'configuracion'

//Rutas al backend
export const tenantRoute = '/tenant'
export const categoriesBack = 'categories'
export const ingredientsBack = 'ingredients'
export const productsBack = 'products'
export const ordersBack = 'orders'
export const orderCreateLocal = 'create-local'
export const configurationBack = 'configuration'
export const configurationPublicBack = 'configuration-public'

// Helpers para armar rutas del backend con tenantId automático
export const buildTenantRoute = (resource: string, id?: string): string => {
  const basePath = `${tenantRoute}/{tenantId}/${resource}`
  return id ? `${basePath}/${id}` : basePath
}

// Helpers específicos para cada recurso
export const getProductsRoute = () => buildTenantRoute(productsBack)
export const getProductRoute = (id: string) => buildTenantRoute(productsBack, id)

export const getCategoriesRoute = () => buildTenantRoute(categoriesBack)
export const getCategoryRoute = (id: string) => buildTenantRoute(categoriesBack, id)

export const getIngredientsRoute = () => buildTenantRoute(ingredientsBack)
export const getIngredientRoute = (id: string) => buildTenantRoute(ingredientsBack, id)

export const getOrdersRoute = () => buildTenantRoute(ordersBack)
export const getOrderRoute = (id: string) => buildTenantRoute(ordersBack, id)
export const getCreateLocalOrderRoute = () => buildTenantRoute(ordersBack)
export const getUpdateOrderStatusRoute = (orderId: string) => buildTenantRoute(ordersBack, orderId)

export const getConfigurationRoute = () => buildTenantRoute(configurationBack)
export const getPublicConfigurationRoute = () => buildTenantRoute(configurationPublicBack)
