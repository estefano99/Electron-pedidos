import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, User, ChefHat, Eye } from "lucide-react"
import { Order, OrderStatus } from "@/types/order"
import { formatPrice, statusColors } from "@/lib/functions"

interface OrderCardProps {
  order: Order
  isExpanded: boolean
  onToggleExpand: () => void
  onUpdateStatus: (status: OrderStatus) => void
}
export function OrderCard({ order, isExpanded, onToggleExpand, onUpdateStatus }: OrderCardProps) {
  console.log(order)
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-4 w-4" />
              {order.customerName || "No hay nombre"}
            </CardTitle>
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p className="flex items-center gap-1"><ChefHat className="h-4 w-4" /> #{order.code}</p>
              <p className="flex items-center gap-1">
                <Clock className="h-4 w-4" />{" "}
                {order?.scheduledTime
                  ? new Date(order.scheduledTime).toLocaleTimeString()
                  : 'No hay tiempo programado'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${statusColors[order.status].bg} ${statusColors[order.status].text} `}>{statusColors[order.status].label}</Badge>
            <Button variant="ghost" size="icon" onClick={onToggleExpand} aria-label={isExpanded ? "Ocultar detalles del pedido" : "Ver detalles del pedido"}>
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-center mb-3">
          <span className="font-medium">{order.items.length} productos</span>
          {!isExpanded && <span className="font-bold">{formatPrice(order.total)}</span>}
        </div>

        {isExpanded && (
          <div className="space-y-3">
            <Separator />
            <div className="space-y-2">
              {order.items.map((item) => (
                <div className="flex-1">
                  <p className="flex justify-between"><span className="font-medium">{item.product.name}</span> <span className="text-sm">{item?.unitPrice && formatPrice(item?.unitPrice)}</span></p>
                  {item.excludedIngredients.length > 0 && (
                    item.excludedIngredients.map((ingredient) => (
                      <p key={ingredient.id} className="text-muted-foreground">
                        - {ingredient.description}
                      </p>
                    ))
                  )}
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span>Total</span>
              <span className="font-medium">{formatPrice(order.total)}</span>
            </div>
          </div>
        )}

        {/* {nextStatus && (
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
          )} */}
      </CardContent>
    </Card>
  )
}
