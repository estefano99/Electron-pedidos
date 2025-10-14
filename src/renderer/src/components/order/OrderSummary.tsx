import { formatPrice } from "@/lib/functions"
import { Ingredient } from "@/types/ingredient"
import { ProductWithIngredients } from "@/types/product"
import { Check, X } from "lucide-react"

interface OrderSummaryProps {
  product: ProductWithIngredients
  includedIngredients: Ingredient[]
  excludedIngredients: Ingredient[]
  totalPrice: number
}

export function OrderSummary({ product, includedIngredients, totalPrice }: OrderSummaryProps) {

  // Los extras son ingredientes que aparecen duplicados en includedIngredients
  // Necesitamos contar cuántas veces aparece cada ingrediente
  const ingredientCounts = includedIngredients.reduce((acc, ing) => {
    acc[ing.id] = (acc[ing.id] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Los extras son los que aparecen más de una vez
  // Guardamos el ingrediente y la cantidad de extras (no contamos el base)
  const extraIngredients = includedIngredients
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

  // Si el ingrediente no esta en includedIngredients, entonces lo agrego a removedDefaultIngredients
  const removeDefaultIngredients = (product: ProductWithIngredients, includedIngredients: Ingredient[]) => {
    const filteredIngredients = product.ingredients.filter(ingredient => !ingredient.isMandatory)
    return filteredIngredients.filter(ingredient => !includedIngredients.some(ing => ing.id === ingredient.ingredient.id))
  }
  const removedDefaultIngredients = removeDefaultIngredients(product, includedIngredients)
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Resumen del Pedido</h3>

      <div className="space-y-2">
        <p className="font-medium">{product.name}</p>

        {extraIngredients.length > 0 && (
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium">Extras:</p>
            {extraIngredients.map((extra) => (
              <div key={extra.ingredient.id} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>
                  {extra.extraQuantity}x {extra.ingredient.description}
                </span>
                <span className="text-muted-foreground ml-auto">
                  +${extra.totalExtraPrice}
                  {extra.extraQuantity > 1 && (
                    <span className="text-xs"> (${extra.ingredient.extraPrice} c/u)</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}

        {removedDefaultIngredients.length > 0 && (
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium">Ingredientes sacados:</p>
            {removedDefaultIngredients.map((ingredient) => (
              <div key={ingredient.ingredient.id} className="flex items-center gap-2 text-sm">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-muted-foreground">{ingredient.ingredient.description}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center font-semibold text-lg pt-2 border-t">
        <span>Total:</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>
    </div>
  )
}
