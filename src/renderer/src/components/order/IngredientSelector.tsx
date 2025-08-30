import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { OrderSummary } from "@/components/order/OrderSummary"
import { OrderItem } from "@/types/order"
import { ProductWithIngredients } from "@/types/product"
import { Ingredient } from "@/types/ingredient"
import { useOrder } from "@/hooks/use-order"
import { toast } from "sonner"
import { v4 as uuidv4 } from 'uuid'

interface IngredientSelectorProps {
  product: ProductWithIngredients
  onClose: () => void
  preselectedIncluded?: Ingredient[]
  preselectedExcluded?: Ingredient[]
  editingItem: OrderItem | null
}

export function IngredientSelector({ product, onClose, preselectedIncluded, preselectedExcluded, editingItem }: IngredientSelectorProps) {
  const { currentOrder, addItemToCurrentOrder } = useOrder()
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([])
  const [excludedIngredients, setExcludedIngredients] = useState<Ingredient[]>([])

  // Initialize with default ingredients
  useEffect(() => {
    if (preselectedIncluded || preselectedExcluded) {
      setSelectedIngredients(preselectedIncluded || [])
      setExcludedIngredients(preselectedExcluded || [])
    } else {
      setSelectedIngredients(product.ingredients.filter((pi) => !pi.isMandatory).map((pi) => pi.ingredient))
      setExcludedIngredients([])
    }
  }, [product])


  const handleIngredientToggle = (ingredient: Ingredient, included: boolean) => {

    if (included) {
      setSelectedIngredients((prev) => [...prev, ingredient])
      setExcludedIngredients((prev) => prev.filter((i) => i.id !== ingredient.id))
    } else {
      setSelectedIngredients((prev) => prev.filter((i) => i.id !== ingredient.id))
      setExcludedIngredients((prev) => [...prev, ingredient])
    }
  }
  const calculateTotalPrice = () => {
    const basePrice = product.price
    // const extraIngredientsPrice = selectedIngredients
    //   .filter((ing) => !product.ingredients.some((defIng) => defIng.ingredient.id === ing.id))
    //   .reduce((sum, ing) => sum + ing.price, 0)

    return basePrice
  }

  const handleAddToOrder = () => {
    if (!currentOrder) {
      toast.warning("Primero iniciá un pedido", {
        richColors: true
      })
      return
    }
    const orderItem: OrderItem = {
      id: uuidv4(),
      product,
      includedIngredients: selectedIngredients,
      excludedIngredients,
      totalPrice: calculateTotalPrice(),
      quantity: 1
    }
    addItemToCurrentOrder(orderItem)
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Personaliza tu {product.name}</DialogTitle>
          <DialogDescription>Seleccione ingredientes para personalizar su pedido</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <h3 className="font-medium">Ingredientes predeterminados</h3>
          {product.ingredients
            .filter((pi) => !pi.isMandatory) // mostrar solo los opcionales
            .map((pi) => {
              const isSelected = selectedIngredients.some(
                (ing) => ing.id === pi.ingredient.id
              )

              return (
                <div key={pi.ingredient.id} className="flex items-center justify-between py-2">
                  <span className="text-sm">{pi.ingredient.description}</span>
                  <Switch
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      handleIngredientToggle(pi.ingredient, checked)
                    }
                  />
                </div>
              )
            })}

          <Separator className="my-4" />

          {/* <h3 className="font-medium">Extra Ingredients</h3>
          {product.ingredients.map((ingredient) => (
            <div key={ingredient.ingredient.id} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={`ingredient-${ingredient.ingredient.id}`}>{ingredient.ingredient.name}</Label>
                <p className="text-sm text-muted-foreground">+${ingredient.ingredient.price.toFixed(2)}</p>
              </div>
              <Switch
                id={`ingredient-${ingredient.id}`}
                checked={selectedIngredients.some((i) => i.id === ingredient.ingredient.id)}
                onCheckedChange={(checked) => handleIngredientToggle(ingredient.ingredient, checked)}
              />
            </div>
          ))} */}
        </div>

        {/* <Separator className="my-4" /> */}

        <OrderSummary
          product={product}
          includedIngredients={selectedIngredients}
          excludedIngredients={excludedIngredients}
          totalPrice={calculateTotalPrice()}
        />

        <DialogFooter className="mt-4">
          {
            !editingItem &&
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          }
          <Button onClick={handleAddToOrder}>{editingItem ? "Editar Pedido" : "Agregar al pedido"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
