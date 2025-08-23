import { GetOrdersResponse, getOrdersTodayByStatus } from "@/api/OrderApi"
import { getProducts } from "@/api/ProductApi"
import HeaderPages from "@/components/HeaderPages"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useOrder } from "@/hooks/use-order"
import { formatPrice } from "@/lib/functions"
import { Order, OrderFilterStatus, OrderStatus } from "@/types/order"
import { ProductWithIngredients } from "@/types/product"
import { useQuery } from "@tanstack/react-query"
import { Clock, DollarSign, ShoppingBag, Star, TrendingUp } from "lucide-react"
import { useMemo, useState } from "react"

interface ProductStats {
  id: string;
  name: string;
  revenue: number;
  quantity: number;
}

const Start = () => {

  const { data } = useQuery<GetOrdersResponse>({
    queryKey: ["ordersTodayByStatus", OrderFilterStatus.ALL],
    queryFn: () => getOrdersTodayByStatus(OrderFilterStatus.ALL),
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

  const totalProducts = products?.length;

  //Ordenes que vienen del back y las guardamos en un nombre mas declarativo
  const todayOrders = data?.orders || [];

  const todayRevenue = todayOrders.reduce((acumulador: number, order: Order) => acumulador + order.total, 0) || 0 //Ganancia del dia
  const todayOrdersCount = todayOrders?.length;
  const completedOrders = todayOrders.filter(order => order.status === OrderStatus.READY || order.status === OrderStatus.DELIVERED).length; //Ordenes listas o delivery. Cuenta como completadas
  const completionRate = todayOrdersCount > 0 ? (completedOrders / todayOrdersCount) * 100 : 0; //Porcentaje de ordenes completadas

  const productMap = new Map<string, ProductStats>(); // clave valor de products de tipo ProductStats, cada clave es el id

  const productStats = useMemo(() => {
    todayOrders?.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product.id
        const existing = productMap.get(productId)

        if (existing) {
          productMap.set(productId, {
            ...existing,
            quantity: existing.quantity + item.quantity,
            revenue: existing.revenue + (item.unitPrice ?? 0) * item.quantity,
          })
        } else {
          productMap.set(productId, {
            id: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            revenue: (item.unitPrice ?? 0) * item.quantity,
          })
        }
      })
    })
    return Array.from(productMap.values()).sort((a, b) => b.quantity - a.quantity); //Retprma el array ordenado en forma descendente
  }, [todayOrders]);

  return (
    <div className="min-h-screen w-full">
      <HeaderPages title="Dashboard" />
      <div className="p-6 space-y-6">
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
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hora Pico</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatHour(peakHour.hour)}</div>
              <p className="text-xs text-muted-foreground">{peakHour.orders} pedidos en esa hora</p>
            </CardContent>
          </Card> */}
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
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{product.quantity} vendidos</p>
                        <p className="text-sm text-green-600">{formatPrice(product.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay ventas registradas hoy</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ventas por hora */}
          {/* <Card>
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
                        <p className="text-sm text-green-600">{formatCurrency(stat.revenue)}</p>
                      </div>
                    </div>
                  ))}
                {hourlyStats.every((stat) => stat.orders === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay ventas registradas hoy</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Resumen de estados de pedidos */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Estado de Pedidos del Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { status: "pending", label: "Pendientes", color: "bg-yellow-100 text-yellow-800" },
                { status: "preparing", label: "En Preparación", color: "bg-blue-100 text-blue-800" },
                { status: "ready", label: "Listos", color: "bg-green-100 text-green-800" },
                { status: "delivered", label: "Entregados", color: "bg-gray-100 text-gray-800" },
              ].map(({ status, label, color }) => {
                const count = todayOrders.filter((order) => order.status === status).length
                const percentage = todayOrdersCount > 0 ? (count / todayOrdersCount) * 100 : 0

                return (
                  <div key={status} className="text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}>
                      {label}
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
        </Card> */}
      </div>
    </div>
  )
}


export default Start
