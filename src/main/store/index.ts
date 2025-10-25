interface StoreSchema {
  tenantId: string | null
  user: {
    id: string
    username: string
    role: string
  } | null
}

let store: any = null

// Inicializar store de forma asíncrona
async function initStore() {
  if (!store) {
    const Store = (await import('electron-store')).default
    store = new Store<StoreSchema>({
      name: 'food-management-data',
      defaults: {
        tenantId: null,
        user: null
      }
    })
  }
  return store
}

// Funciones para gestionar el tenant
export const tenantStore = {
  // Obtener tenantId guardado
  getTenantId: async (): Promise<string | null> => {
    const s = await initStore()
    return s.get('tenantId')
  },

  // Guardar tenantId
  setTenantId: async (tenantId: string | null): Promise<void> => {
    const s = await initStore()
    s.set('tenantId', tenantId)
  },

  // Limpiar tenantId (logout)
  clearTenantId: async (): Promise<void> => {
    const s = await initStore()
    s.set('tenantId', null)
  }
}

// Funciones para gestionar el usuario
export const userStore = {
  // Obtener usuario guardado
  getUser: async (): Promise<StoreSchema['user']> => {
    const s = await initStore()
    return s.get('user')
  },

  // Guardar usuario
  setUser: async (user: StoreSchema['user']): Promise<void> => {
    const s = await initStore()
    s.set('user', user)
  },

  // Limpiar usuario (logout)
  clearUser: async (): Promise<void> => {
    const s = await initStore()
    s.set('user', null)
  }
}

// Función para limpiar todo (logout completo)
export const clearAllStore = async (): Promise<void> => {
  const s = await initStore()
  s.clear()
}

