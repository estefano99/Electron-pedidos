import { GetOrdersResponse, getOrdersTodayByStatus } from "@/api/OrderApi"
import { getProducts } from "@/api/ProductApi"
import CalendarDashboard from "@/components/dashboard/CalendarDashboard"
import HeaderPages from "@/components/HeaderPages"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice, orderStatuses, statusColors } from "@/lib/functions"
import { Order, OrderFilterStatus, OrderStatus } from "@/types/order"
import { ProductWithIngredients } from "@/types/product"
import { useQuery } from "@tanstack/react-query"
import { Clock, DollarSign, Pizza, ShoppingBag, Star, Users } from "lucide-react"
import { useMemo, useState } from "react"

interface ProductStats {
  id: string;
  name: string;
  revenue: number;
  quantity: number;
}

interface HourlyStats {
  hour: number
  orders: number
  revenue: number
}

const Start = () => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const { data } = useQuery<GetOrdersResponse>({
    queryKey: ["ordersTodayByStatus", OrderFilterStatus.ALL, selectedDate],
    queryFn: () => getOrdersTodayByStatus(OrderFilterStatus.ALL, selectedDate),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { data: products } = useQuery<ProductWithIngredients[]>({
    queryKey: ["products"],
    queryFn: getProducts,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false
  });

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`
  }

  const totalProducts = products?.length;

  //Ordenes que vienen del back y las guardamos en un nombre mas declarativo
  const todayOrders = data?.orders || [];

  // Filtrar solo órdenes válidas (no canceladas) para cálculos de revenue y estadísticas
  const validOrders = todayOrders.filter(order => order.status !== OrderStatus.CANCELLED);

  const todayRevenue = validOrders.reduce((acumulador: number, order: Order) => Number(acumulador) + Number(order.total), 0) || 0 //Ganancia del dia
  const todayOrdersCount = todayOrders?.length; // Total incluyendo canceladas (para mostrar volumen)
  const completedOrders = todayOrders.filter(order => order.status === OrderStatus.READY || order.status === OrderStatus.DELIVERED).length; //Ordenes listas o delivery. Cuenta como completadas
  const completionRate = todayOrdersCount > 0 ? (completedOrders / todayOrdersCount) * 100 : 0; //Porcentaje de ordenes completadas

  const productMap = new Map<string, ProductStats>(); // clave valor de products de tipo ProductStats, cada clave es el id

  const productStats = useMemo(() => {
    // Solo contar productos de órdenes válidas (no canceladas)
    validOrders?.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product.id

        // Calcular revenue total del item (base + extras)
        const baseRevenue = Number(item.unitPrice ?? 0) * item.quantity

        // Sumar extras de ingredientes
        const extrasRevenue = (item.ingredientCustomizations || []).reduce((sum, customization) => {
          if (customization.isAdded && customization.unitPrice > 0) {
            return sum + (Number(customization.unitPrice) * customization.quantity * item.quantity)
          }
          return sum
        }, 0)

        const totalItemRevenue = baseRevenue + extrasRevenue

        const existing = productMap.get(productId)

        if (existing) {
          productMap.set(productId, {
            ...existing,
            quantity: existing.quantity + item.quantity,
            revenue: existing.revenue + totalItemRevenue,
          })
        } else {
          productMap.set(productId, {
            id: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            revenue: totalItemRevenue,
          })
        }
      })
    })
    return Array.from(productMap.values()).sort((a, b) => b.quantity - a.quantity); //Retorna el array ordenado en forma descendente
  }, [validOrders]);

  // Calculate hourly statistics
  const { hourlyStats, peakHour } = useMemo(() => {
    // Inicializar todas las horas
    const hourlyMap = new Map<number, HourlyStats>()
    for (let i = 0; i < 24; i++) {
      hourlyMap.set(i, { hour: i, orders: 0, revenue: 0 })
    }

    // Rellenar solo con órdenes válidas (no canceladas)
    validOrders.forEach((order) => {
      const hour = new Date(order.createdAt).getHours()
      const existing = hourlyMap.get(hour)!
      hourlyMap.set(hour, {
        ...existing,
        orders: existing.orders + 1,
        revenue: existing.revenue + Number(order.total),
      })
    })

    const stats = Array.from(hourlyMap.values())

    // Calcular peakHour sobre esos datos
    const peak = stats.reduce(
      (max, current) => (current.orders > max.orders ? current : max),
      { hour: 0, orders: 0, revenue: 0 }
    )

    return { hourlyStats: stats, peakHour: peak }
  }, [validOrders])

  return (
    <div className="min-h-screen w-full overflow-auto">
      <HeaderPages title="Dashboard" />
      <div className="p-6 space-y-6">
        <div className="flex justify-center items-center gap-2">
          <p className="text-muted-foreground text-center text-lg">Análisis de rendimiento del</p>
          <CalendarDashboard
            calendarOpen={calendarOpen}
            setCalendarOpen={setCalendarOpen}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Primer card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos del Día</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatPrice(todayRevenue)}</div>
              <p className="text-xs text-muted-foreground">+{todayOrdersCount} pedidos procesados</p>
            </CardContent>
          </Card>

          {/* Segunda Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Totales</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayOrdersCount}</div>
              <p className="text-xs text-muted-foreground">
                {completedOrders} entregados ({completionRate.toFixed(1)}%)
              </p>
            </CardContent>
          </Card>

          {/* Tercera Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos Totales</CardTitle>
              <Pizza className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Productos creados en el sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hora Pico</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatHour(peakHour.hour)}</div>
              <p className="text-xs text-muted-foreground">{peakHour.orders} pedidos en esa hora</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Productos más vendidos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Productos Más Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {productStats.length > 0 ? (
                <div className="space-y-4">
                  {productStats.slice(0, 8).map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.quantity} vendidos • {formatPrice(product.revenue / product.quantity)}/unidad
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{formatPrice(product.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay ventas registradas en la fecha seleccionada</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ventas por hora */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Ventas por Hora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hourlyStats
                  .filter((stat) => stat.orders > 0)
                  .sort((a, b) => b.orders - a.orders)
                  .slice(0, 10)
                  .map((stat) => (
                    <div key={stat.hour} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-16 justify-center">
                          {formatHour(stat.hour)}
                        </Badge>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${(stat.orders / Math.max(...hourlyStats.map((h) => h.orders))) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold">{stat.orders} pedidos</p>
                        <p className="text-sm text-green-600">{formatPrice(stat.revenue)}</p>
                      </div>
                    </div>
                  ))}
                {hourlyStats.every((stat) => stat.orders === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay ventas registradas en la fecha seleccionada</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumen de estados de pedidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Estado de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {orderStatuses.map((status) => {
                const estado = statusColors[status]
                if (!estado) return null

                const count = todayOrders.filter((order: Order) => order.status === status).length
                const percentage = todayOrdersCount > 0 ? (count / todayOrdersCount) * 100 : 0

                return (
                  <div key={status} className="text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${estado.bg} ${estado.text}`}>
                      {estado.label}
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


export default Start
