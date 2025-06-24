import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { OrderStatus } from "@/types/order"
import { orderStatuses, statusColors } from "@/lib/functions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateStatusOrder } from "@/api/OrderApi"
import { toast } from "sonner"

interface DropdownStatusProps {
  currentStatus: OrderStatus
  orderId: string
}

export function DropdownStatus({ currentStatus, orderId }: DropdownStatusProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
      mutationFn: (newStatus: OrderStatus) => updateStatusOrder(orderId, newStatus),
      onError: (error: Error) => {
        console.log(error);
        toast.error("Error al actualizar el estado del pedido");
      },
      onSuccess: () => {
        toast.success("Estado del pedido actualizado");
        queryClient.invalidateQueries({ queryKey: ["ordersTodayByStatus"] });
      },
    });

  const handleClick = async (status: OrderStatus) => {
    await mutation.mutateAsync(status)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Abrir menú de estado">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {orderStatuses.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleClick(status)}
            className={status === currentStatus ? "font-semibold bg-muted cursor-pointer" : "cursor-pointer"}
          >
            {statusColors[status].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
