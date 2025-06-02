import { formatPrice } from "@/lib/functions"
import { Ingredient } from "@/types/ingredient"
import { ProductWithIngredients } from "@/types/product"
import { X } from "lucide-react"

interface OrderSummaryProps {
  product: ProductWithIngredients
  includedIngredients: Ingredient[]
  excludedIngredients: Ingredient[]
  totalPrice: number
}

export function OrderSummary({ product, includedIngredients, totalPrice }: OrderSummaryProps) {
  // const extraIngredients = includedIngredients.filter(
  //   (ing) => !product.ingredients.some((defIng) => defIng.ingredient.id === ing.id),
  // )

  // Si el ingrediente no esta en includedIngredients, entonces lo agrego a removedDefaultIngredients
  const removedDefaultIngredients = product.ingredients.filter(
    (defIng) => !includedIngredients.some((ing) => ing.id === defIng.ingredient.id),
  )

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Resumen del Pedido</h3>

      <div className="space-y-2">
        <p className="font-medium">{product.name}</p>

        {/* {extraIngredients.length > 0 && (
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium">Extra ingredients:</p>
            {extraIngredients.map((ingredient) => (
              <div key={ingredient.id} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>{ingredient.description}</span>
                <span className="text-muted-foreground ml-auto">+${ingredient.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )} */}

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
