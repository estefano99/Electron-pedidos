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
  // Contar cuántas veces aparece cada ingrediente en includedIngredients
  const ingredientCounts = item.includedIngredients.reduce((acc, ing) => {
    acc[ing.id] = (acc[ing.id] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Los extras son ingredientes que aparecen más de una vez
  // Guardamos el ingrediente y la cantidad de extras (no contamos el base)
  const extras = item.includedIngredients
    .filter((ing) => ingredientCounts[ing.id] > 1)
    .filter((ing, index, arr) => {
      // Solo mostrar una vez cada ingrediente extra
      return arr.findIndex(i => i.id === ing.id) === index
    })
    .map(ing => ({
      ingredient: ing,
      extraQuantity: ingredientCounts[ing.id] - 1, // Restar el base
      totalExtraPrice: Number(ing.extraPrice || 0) * (ingredientCounts[ing.id] - 1)
    }))

  // Los removidos son ingredientes que están en excludedIngredients pero NO en includedIngredients
  const removed = item.excludedIngredients.filter(
    (ex) => !item.includedIngredients.some((ing) => ing.id === ex.id)
  )

  console.log("🚀 ~ OrderItemCard ~ extras:", extras)
  console.log("🚀 ~ OrderItemCard ~ removed:", removed)

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
        {(extras.length > 0 || removed.length > 0) && (
          <div className="flex flex-col space-y-1 text-xs">
            {extras.length > 0 && (
              <div>
                <p className="font-medium text-xs text-muted-foreground mb-1">Extras:</p>
                {extras.map((extra) => (
                  <p key={`extra-${extra.ingredient.id}`} className="text-green-600">
                    + {extra.extraQuantity}x {extra.ingredient.description} {formatPrice(extra.totalExtraPrice)}
                  </p>
                ))}
              </div>
            )}

            {removed.length > 0 && (
              <div>
                <p className="font-medium text-xs text-muted-foreground mb-1">Removidos:</p>
                {removed.map((ingredient, index) => (
                  <p key={`removed-${ingredient.id}-${index}`} className="text-red-600">
                    - {ingredient.description}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
