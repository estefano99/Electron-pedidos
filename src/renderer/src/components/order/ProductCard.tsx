
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { ProductWithIngredients } from "@/types/product"
import { formatPrice } from "@/lib/functions"

interface ProductCardProps {
  product: ProductWithIngredients
  onSelect: (product: ProductWithIngredients) => void
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-shadow"

    >
      <div className="relative h-32 w-full overflow-hidden">
        <img src={product.imgUrl || "/placeholder.svg"} alt={product.name} className="object-cover h-full w-full" />
        <Badge className="absolute top-2 right-2" variant="secondary">
          {product.category.description}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription className="text-sm line-clamp-2">{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-1">
          <span className="font-bold text-lg text-primary">{formatPrice(product.price)}</span>
          <Button size="sm" className="h-8" onClick={() => onSelect(product)}>
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
