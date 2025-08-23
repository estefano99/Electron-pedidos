import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderFilterStatus, OrderStatus } from "@/types/order"
import { useQuery } from "@tanstack/react-query"
import { GetOrdersResponse, getOrdersTodayByStatus } from "@/api/OrderApi"
import { OrderCard } from "./orderCard/OrderCard"
import { AlertCircle } from "lucide-react"
import { orderFilterStatuses, statusColors } from "@/lib/functions"

//* orderFilterStatuses se utiliza solo en filtros porque tiene el estado all que en la db no existe
//* orderStatuses es el Enum como debe ir, que se utiliza para editar el estado y se manda al back
export function OrderHistory() {
  const [activeFilter, setActiveFilter] = useState<OrderFilterStatus>(OrderFilterStatus.PENDING)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const { data, isLoading } = useQuery<GetOrdersResponse>({
    queryKey: ["ordersTodayByStatus", activeFilter],
    queryFn: () => getOrdersTodayByStatus(activeFilter),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <Tabs value={activeFilter} onValueChange={(val) => setActiveFilter(val as OrderFilterStatus)}>
      <TabsList className="grid w-full grid-cols-3 h-auto p-1">
        {orderFilterStatuses.map((status) => (
          <TabsTrigger key={status} value={status} className="text-xs py-2">
            {statusColors[status].label}
          </TabsTrigger>
        ))}
      </TabsList>

      {orderFilterStatuses.map((status) => {
        const filtered =
          status === OrderFilterStatus.ALL
            ? data?.orders || []
            : data?.orders?.filter((o) => o.status === status as unknown as OrderStatus) || []

        return (
          <TabsContent key={status} value={status}>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Cargando...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="mx-auto h-6 w-6 mb-2" />
                <p>No hay pedidos {statusColors[status].label} en el día actual</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {filtered.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    isExpanded={expandedOrder === order.id}
                    onToggleExpand={() =>
                      setExpandedOrder(expandedOrder === order.id ? null : order.id)
                    }
                  />
                ))}
              </div>
            )}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
