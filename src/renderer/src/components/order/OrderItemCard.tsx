import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit } from "lucide-react"
import type { OrderItem } from "@/types/order"
import { formatPrice } from "@/lib/functions"

interface Props {
  item: OrderItem
  onRemove: () => void
  onEdit: (item: OrderItem) => void
}


export function OrderItemCard({ item, onRemove, onEdit }: Props) {
  // const extra = item.includedIngredients.filter(
  //   (ing) => !item.excludedIngredients.some((ex) => ex.id === ing.id)
  // )
  const removed = item.excludedIngredients.filter(
    (ex) => !item.includedIngredients.some((ing) => ing.id === ex.id)
  )

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h4 className="font-medium">{item.product.name}</h4>
            <p className="text-sm text-muted-foreground">{formatPrice(item.totalPrice)}</p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(item)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {(removed.length > 0) && (
          <div className="flex flex-col space-y-1 text-xs">
            {/* {extra.length > 0 && (
              <p className="text-green-600">+ {extra.map((i) => i.description).join(", ")}</p>
            )} */}
            {/* {removed.length > 0 && (
              <p className="text-red-600">- {removed.map((i) => i.description)}</p>
            )} */}
            {
              removed.length > 0 && (
                removed.map((ingredient => (
                  <p className="text-red-600">- {ingredient.description}</p>
                )))
              )
            }
          </div>
        )}
      </CardContent>
    </Card>
  )
}
