import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, User, ChefHat, Eye, CheckCircle } from "lucide-react"
import { Order } from "@/types/order"
import { formatPrice, statusColors } from "@/lib/functions"
import { DropdownStatus } from "../DropdownStatus"

interface OrderCardProps {
  order: Order
  isExpanded: boolean
  onToggleExpand: () => void
}
export function OrderCard({ order, isExpanded, onToggleExpand }: OrderCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          {/* IZQUIERDA: Nombre, código y hora */}
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-4 w-4" />
              {order.customerName || "No hay nombre"}
            </CardTitle>
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p className="flex items-center gap-1">
                <ChefHat className="h-4 w-4" /> #{order.code}
              </p>
              <p className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {order?.scheduledTime
                  ? new Date(order.scheduledTime).toLocaleTimeString()
                  : 'No hay tiempo programado'}
              </p>
            </div>
          </div>

          {/* DERECHA: Badge de estado, Dropdown y botón */}
          <div className="flex flex-col items-end gap-2">
            <Badge className={`${statusColors[order.status].bg} ${statusColors[order.status].text}`}>
              {statusColors[order.status].label}
            </Badge>
            <div className="flex items-center gap-2">
              <DropdownStatus currentStatus={order.status} orderId={order.id} />
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleExpand}
                aria-label={isExpanded ? "Ocultar detalles del pedido" : "Ver detalles del pedido"}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
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
              {order.items.map((item, key) => (
                <div className="flex-1" key={key}>
                  {/* Fila nombre + precio */}
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 font-medium">
                      <CheckCircle className="w-3 h-3 shrink-0" />
                      {item.product.name}
                    </span>
                    {item?.unitPrice && (
                      <span className="text-sm">{formatPrice(item.unitPrice)}</span>
                    )}
                  </div>

                  {/* Ingredientes excluidos, indentados */}
                  {item.excludedIngredients.length > 0 && (
                    <div className="ml-2">
                      {item.excludedIngredients.map((ingredient) => (
                        <p key={ingredient.id} className="text-red-400/80 text-sm">
                          - {ingredient.description}
                        </p>
                      ))}
                    </div>
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
      </CardContent>
    </Card>
  )
}
