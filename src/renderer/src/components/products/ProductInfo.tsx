import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Product } from "@/types/product"
import { formatPrice } from "@/lib/functions"
import { Eye } from "lucide-react"
import { Badge } from "../ui/badge"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <button> para que funcione dentro del Dropdown */}
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 w-full px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          <Eye className="w-4 h-4" />
          Ver producto
        </button>
      </DialogTrigger>

      <DialogContent onClick={(e) => e.stopPropagation()} className="max-w-md">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>{product.description}</DialogDescription>
        </DialogHeader>

        <div className="relative w-full h-52 rounded overflow-hidden">
          <img
            src={product.imgUrl || "/placeholder.svg"}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain"
          />
          <Badge className="absolute top-2 right-2 text-xs px-2 py-1 rounded">
            {product.category?.description || "Sin categoría"}
          </Badge>
        </div>

        <p className="mt-4 font-semibold text-lg text-primary">
          {formatPrice(product.price)}
        </p>
      </DialogContent>
    </Dialog>
  )
}
