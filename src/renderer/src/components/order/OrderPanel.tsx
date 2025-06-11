import { useOrder } from "@/hooks/use-order"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, Loader, User } from "lucide-react"
import { OrderItemCard } from "./OrderItemCard"
import { useState } from "react"
import { NewOrder, OrderItem } from "@/types/order"
import { IngredientSelector } from "./IngredientSelector"
import { formatPrice } from "@/lib/functions"
import { Badge } from "../ui/badge"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createOrder } from "@/api/OrderApi"
import { toast } from "sonner"

interface OrderPanelProps {
  setCustomerName: (name: string) => void
  setScheduledTime: (time: Date | null) => void
  setActiveTab: (tab: string) => void
}

export function OrderPanel({ setCustomerName, setScheduledTime, setActiveTab }: OrderPanelProps) {
  const { currentOrder, removeItemFromCurrentOrder } = useOrder()
  const queryClient = useQueryClient()

  const [editingItem, setEditingItem] = useState<OrderItem | null>(null)
  const [_isModalOpen, setModalOpen] = useState(false)

  const mutation = useMutation({
    mutationFn: createOrder,
    onError: (error: Error) => {
      console.log(error);
      toast.error("Error al crear el pedido");
    },
    onSuccess: () => {
      toast.success("Pedido creado exitosamente");
      queryClient.removeQueries({ queryKey: ['currentOrder'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      setCustomerName("")
      setScheduledTime(null)
      setActiveTab("current-order")
    },
  });

  const handleEdit = (item: OrderItem) => {
    setEditingItem(item)
    removeItemFromCurrentOrder(item.id)
    setModalOpen(true)
  }

  const handleCompleteOrder = async () => {
    // if (currentOrder.items.length > 0) completeCurrentOrder()
    const order = queryClient.getQueryData<NewOrder>(['currentOrder'])

    if (!order || order.items.length === 0) {
      toast.error("No hay productos en el pedido")
      return
    }
    await mutation.mutateAsync(order);
  }

  if (!currentOrder) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-muted-foreground mb-4">
          <User className="h-12 w-12 mx-auto mb-2" />
          <p>No hay pedido activo</p>
          <p className="text-sm">Inicie un nuevo pedido ingresando el nombre del cliente</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            {currentOrder.customerName}
          </CardTitle>
          <Badge variant="outline" className="flex items-center gap-1 text-md">
            <Clock className="h-3 w-3" />
            {currentOrder.scheduledTime
              ? new Date(currentOrder.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Sin horario'}
          </Badge>
        </CardHeader>
      </Card>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {currentOrder.items.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No hay productos en el pedido</p>
            <p className="text-sm">Seleccione productos del menú</p>
          </div>
        ) : (
          currentOrder.items.map((item) => (
            <OrderItemCard
              key={item.id}
              item={item}
              onRemove={() => removeItemFromCurrentOrder(item.id)}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      {currentOrder.items.length > 0 && (
        <div className="space-y-4">
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>{formatPrice(currentOrder.total)}</span>
          </div>

          <div className="space-y-2">
            <Button onClick={handleCompleteOrder} disabled={mutation.isPending} className="w-full" size="lg">
              {mutation.isPending ? <span className="flex items-center gap-2"><Loader /> Creando Pedido</span> : <span>Confirmar pedido</span>}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              El pedido se enviará a cocina
            </p>
          </div>
        </div>
      )}
      {editingItem && (
        <IngredientSelector
          product={editingItem.product}
          onClose={() => {
            setModalOpen(false)
            setEditingItem(null)
          }}
          preselectedIncluded={editingItem.includedIngredients}
          preselectedExcluded={editingItem.excludedIngredients}
        />
      )}
    </div>
  )
}
