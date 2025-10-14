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
import { OrderItem, OrderItemIngredientForBackend } from "@/types/order"
import { ProductWithIngredients } from "@/types/product"
import { Ingredient } from "@/types/ingredient"
import { useOrder } from "@/hooks/use-order"
import { toast } from "sonner"
import { v4 as uuidv4 } from 'uuid'
import { Label } from "../ui/label"

interface IngredientSelectorProps {
  product: ProductWithIngredients
  onClose: () => void
  preselectedIncluded?: Ingredient[]
  preselectedExcluded?: Ingredient[]
  editingItem?: OrderItem | null
}

export function IngredientSelector({
  product,
  onClose,
  preselectedIncluded,
  preselectedExcluded,
  editingItem
}: IngredientSelectorProps) {
  const { currentOrder, addItemToCurrentOrder } = useOrder()
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([])
  const [excludedIngredients, setExcludedIngredients] = useState<Ingredient[]>([])
  // Cambiar a un objeto que maneje cantidad de extras
  const [extraIngredients, setExtraIngredients] = useState<Record<string, { ingredient: Ingredient, quantity: number }>>({})

  // Initialize with default ingredients
  useEffect(() => {
    if (preselectedIncluded || preselectedExcluded) {
      setSelectedIngredients(preselectedIncluded || [])
      setExcludedIngredients(preselectedExcluded || [])
    } else {
      // Solo ingredientes predeterminados opcionales, NO todos los ingredientes
      const defaultOptionalIngredients = product.ingredients
        .filter((pi) => !pi.isMandatory)
        .map((pi) => pi.ingredient)

      setSelectedIngredients(defaultOptionalIngredients)
      setExcludedIngredients([])
    }
    // Los extra ingredients siempre empiezan vacíos
    setExtraIngredients({})
  }, [product])

  const handleDefaultIngredientToggle = (ingredient: Ingredient, included: boolean) => {
    if (included) {
      setSelectedIngredients((prev) => [...prev, ingredient])
      setExcludedIngredients((prev) => prev.filter((i) => i.id !== ingredient.id))
    } else {
      setSelectedIngredients((prev) => prev.filter((i) => i.id !== ingredient.id))
      setExcludedIngredients((prev) => [...prev, ingredient])
      // Si se saca el predeterminado, también se saca el extra
      setExtraIngredients((prev) => {
        const newExtras = { ...prev }
        delete newExtras[ingredient.id]
        return newExtras
      })
    }
  }

  const handleExtraIngredientToggle = (ingredient: Ingredient, included: boolean) => {
    if (included) {
      setExtraIngredients((prev) => ({
        ...prev,
        [ingredient.id]: {
          ingredient,
          quantity: (prev[ingredient.id]?.quantity || 0) + 1
        }
      }))
      // Si se agrega el extra, el predeterminado debe estar en true también
      if (!selectedIngredients.some((i) => i.id === ingredient.id)) {
        setSelectedIngredients((prev) => [...prev, ingredient])
        setExcludedIngredients((prev) => prev.filter((i) => i.id !== ingredient.id))
      }
    } else {
      setExtraIngredients((prev) => {
        const newExtras = { ...prev }
        delete newExtras[ingredient.id]
        return newExtras
      })
    }
  }

  const calculateTotalPrice = () => {
    const basePrice = Number(product.price);

    // Sumar solo los ingredientes extras (cantidad × precio)
    const extraIngredientsPrice = Object.values(extraIngredients).reduce((sum, extraItem) => {
      const price = Number(extraItem.ingredient.extraPrice || 0)
      return sum + (price * extraItem.quantity)
    }, 0)

    const total = basePrice + extraIngredientsPrice
    return total
  }

  const handleAddToOrder = () => {
    if (!currentOrder) {
      toast.warning("Primero iniciá un pedido", {
        richColors: true
      })
      return
    }

    // Crear estructura para el backend: ingredientes base + extras con cantidad
    const ingredientsForBackend: OrderItemIngredientForBackend[] = [
      // Ingredientes predeterminados seleccionados que NO tienen extras
      // (precio 0 porque ya están incluidos en el precio base)
      ...selectedIngredients
        .filter(ing => !extraIngredients[ing.id]) // excluir los que tienen extras
        .map(ing => ({
          ingredientId: ing.id,
          isAdded: true,
          quantity: 1,
          unitPrice: 0
        })),
      // Ingredientes excluidos (precio 0 porque no se cobra por quitar)
      ...excludedIngredients.map(ing => ({
        ingredientId: ing.id,
        isAdded: false,
        quantity: 1,
        unitPrice: 0
      })),
      // Ingredientes extras con su cantidad y precio
      // La cantidad incluye el base (1) + los extras (n)
      ...Object.values(extraIngredients).map(extraItem => ({
        ingredientId: extraItem.ingredient.id,
        isAdded: true,
        quantity: extraItem.quantity + 1, // +1 para incluir el predeterminado
        unitPrice: Number(extraItem.ingredient.extraPrice || 0)
      }))
    ]

    // Para compatibilidad con OrderSummary, creamos allIncludedIngredients expandido
    const allIncludedIngredients = [
      ...selectedIngredients,
      ...Object.values(extraIngredients).flatMap(extraItem =>
        Array(extraItem.quantity).fill(extraItem.ingredient)
      )
    ]

    const orderItem: OrderItem = {
      id: uuidv4(),
      product,
      includedIngredients: allIncludedIngredients,
      excludedIngredients,
      totalPrice: calculateTotalPrice(),
      quantity: 1,
      ingredientsForBackend: ingredientsForBackend
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
                      handleDefaultIngredientToggle(pi.ingredient, checked)
                    }
                  />
                </div>
              )
            })}

          <Separator className="my-4" />
          <h3 className="font-medium">Ingredientes Extras</h3>
          {product.ingredients
            .filter((pi) => !pi.isMandatory) // solo los opcionales pueden ser extras
            .map((pi) => pi.ingredient)
            .map((ingredient) => {
              const isDefaultSelected = selectedIngredients.some((i) => i.id === ingredient.id)
              const extraItem = extraIngredients[ingredient.id]
              const extraQuantity = extraItem?.quantity || 0

              return (
                <div key={`extra-${ingredient.id}`} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor={`extra-ingredient-${ingredient.id}`}
                      className={!isDefaultSelected ? "text-muted-foreground" : ""}
                    >
                      {ingredient.description}
                      {!isDefaultSelected && " (requiere ingrediente base)"}
                      {extraQuantity > 0 && ` (x${extraQuantity})`}
                    </Label>
                    <p className="text-sm text-muted-foreground">+${ingredient.extraPrice || 0}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {extraQuantity > 0 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (extraQuantity === 1) {
                              handleExtraIngredientToggle(ingredient, false)
                            } else {
                              setExtraIngredients(prev => ({
                                ...prev,
                                [ingredient.id]: { ...prev[ingredient.id], quantity: prev[ingredient.id].quantity - 1 }
                              }))
                            }
                          }}
                          className="h-8 w-8 p-0"
                        >
                          -
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{extraQuantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExtraIngredientToggle(ingredient, true)}
                          className="h-8 w-8 p-0"
                          disabled={!isDefaultSelected}
                        >
                          +
                        </Button>
                      </>
                    )}
                    {extraQuantity === 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExtraIngredientToggle(ingredient, true)}
                        disabled={!isDefaultSelected}
                        className="h-8 w-8 p-0"
                      >
                        +
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
        </div>

        <Separator className="my-4" />

        <OrderSummary
          product={product}
          includedIngredients={[
            ...selectedIngredients,
            ...Object.values(extraIngredients).flatMap(extraItem =>
              Array(extraItem.quantity).fill(extraItem.ingredient)
            )
          ]}
          excludedIngredients={excludedIngredients}
          totalPrice={calculateTotalPrice()}
        />

        <DialogFooter className="mt-4">
          {!editingItem && (
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          )}
          <Button onClick={handleAddToOrder}>
            {editingItem ? "Editar Pedido" : "Agregar al pedido"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
