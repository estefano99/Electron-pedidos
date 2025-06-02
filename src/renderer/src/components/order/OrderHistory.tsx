import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useOrder } from "@/hooks/use-order"
import { Clock, User, ChefHat, CheckCircle, Eye } from "lucide-react"
import type { Order, OrderStatus } from "@/types/order"

export function OrderHistory() {
  const { allOrders, updateOrderStatus } = useOrder()
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "preparing":
        return "bg-blue-500"
      case "ready":
        return "bg-green-500"
      case "delivered":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "preparing":
        return "En Preparación"
      case "ready":
        return "Listo"
      case "delivered":
        return "Entregado"
      default:
        return "Desconocido"
    }
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "preparing":
        return <ChefHat className="h-4 w-4" />
      case "ready":
        return <CheckCircle className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (allOrders.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">No hay pedidos</h3>
        <p className="text-muted-foreground text-sm">Los pedidos completados aparecerán aquí</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      {allOrders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          isExpanded={expandedOrder === order.id}
          onToggleExpand={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
          onUpdateStatus={(status) => updateOrderStatus(order.id, status)}
        />
      ))}
    </div>
  )
}

interface OrderCardProps {
  order: Order
  isExpanded: boolean
  onToggleExpand: () => void
  onUpdateStatus: (status: OrderStatus) => void
}

function OrderCard({ order, isExpanded, onToggleExpand, onUpdateStatus }: OrderCardProps) {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "preparing":
        return "bg-blue-500"
      case "ready":
        return "bg-green-500"
      case "delivered":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "preparing":
        return "En Preparación"
      case "ready":
        return "Listo"
      case "delivered":
        return "Entregado"
      default:
        return "Desconocido"
    }
  }

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case "pending":
        return "preparing"
      case "preparing":
        return "ready"
      case "ready":
        return "delivered"
      default:
        return null
    }
  }

  const nextStatus = getNextStatus(order.status)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-4 w-4" />
              {order.customerName}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Pedido #{order.id.slice(-6)} • {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(order.status)} text-white`}>{getStatusText(order.status)}</Badge>
            <Button variant="ghost" size="icon" onClick={onToggleExpand}>
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-center mb-3">
          <span className="font-medium">{order.items.length} productos</span>
          <span className="font-bold">${(order.total * 1.1).toFixed(2)}</span>
        </div>

        {isExpanded && (
          <div className="space-y-3">
            <Separator />
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-sm">
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    {item.includedIngredients.length !== item.product.defaultIngredients.length && (
                      <p className="text-xs text-muted-foreground">Personalizado</p>
                    )}
                  </div>
                  <span>${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span>Total con impuestos:</span>
              <span className="font-medium">${(order.total * 1.1).toFixed(2)}</span>
            </div>
          </div>
        )}

        {nextStatus && (
          <div className="mt-3 pt-3 border-t">
            <Button
              onClick={() => onUpdateStatus(nextStatus)}
              size="sm"
              className="w-full"
              variant={order.status === "ready" ? "default" : "outline"}
            >
              {nextStatus === "preparing" && "Enviar a Cocina"}
              {nextStatus === "ready" && "Marcar como Listo"}
              {nextStatus === "delivered" && "Marcar como Entregado"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
