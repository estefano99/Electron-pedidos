import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderStatus } from "@/types/order"
import { useQuery } from "@tanstack/react-query"
import { GetOrdersResponse, getOrdersTodayByStatus } from "@/api/OrderApi"
import { OrderCard } from "./orderCard/OrderCard"
import { AlertCircle } from "lucide-react"
import { orderStatuses, statusColors } from "@/lib/functions"

export function OrderHistory() {
  const [activeFilter, setActiveFilter] = useState<OrderStatus>(OrderStatus.PENDING)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const { data, isLoading, isError } = useQuery<GetOrdersResponse>({
    queryKey: ["ordersTodayByStatus", activeFilter],
    queryFn: () => getOrdersTodayByStatus(activeFilter),
  });

  return (
    <Tabs value={activeFilter} onValueChange={(val) => setActiveFilter(val as OrderStatus)}>
      <TabsList className="grid w-full grid-cols-3 h-auto p-1">
        {orderStatuses.map((status) => (
          <TabsTrigger key={status} value={status} className="flex flex-col items-center gap-2 py-2 text-xs">
            {statusColors[status].label}
          </TabsTrigger>
        ))}
      </TabsList>

      {isError && (
        <div className="text-center py-8 text-muted-foreground">
          <AlertCircle className="mx-auto h-6 w-6 mb-2" />
          <p>Error al cargar los pedidos</p>
        </div>
      )}

      {orderStatuses.map((status) => (
        <TabsContent key={status} value={status}>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Cargando...</div>
          ) : data?.orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="mx-auto h-6 w-6 mb-2" />
              <p>No hay pedidos {statusColors[status].label} en el día actual</p>
            </div>
          ) : (
            <div className="space-y-4 h-full overflow-y-auto">
              {data?.orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isExpanded={expandedOrder === order.id}
                  onToggleExpand={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}
