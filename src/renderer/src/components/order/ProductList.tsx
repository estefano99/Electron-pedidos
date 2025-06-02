"use client"

import { useState } from "react"
import { ProductCard } from "@/components/order/ProductCard"
import { IngredientSelector } from "@/components/order/IngredientSelector"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, SearchX } from "lucide-react"
import { getCategories } from "@/api/CategoryApi"
import { useQuery } from "@tanstack/react-query"
import { category, GetCategoriesResponse } from "@/types/category"
import { getProducts } from "@/api/ProductApi"
import { ProductWithIngredients } from "@/types/product"
import { Button } from "../ui/button"

export function ProductList() {
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<GetCategoriesResponse>({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });
  const { data: products = [], isLoading: isLoadingProducts } = useQuery<ProductWithIngredients[]>({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000,
  });
  const [selectedProduct, setSelectedProduct] = useState<ProductWithIngredients | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categoriesActive = categories?.filter(category => category.isActive) // Filtra las categorías activas y se muestran en el select

  // Esta función filtra los productos a mostrar según:
  // 1) La categoría seleccionada (si hay una).
  // 2) El texto ingresado en el buscador, comparándolo con el nombre del producto.
  // Devuelve solo los productos que coinciden con ambos criterios.
  const filteredProducts = products?.filter(product => {
    const categoryMatch = selectedCategory ? product.category.id === selectedCategory : true
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return categoryMatch && searchMatch
  })

  const handleProductSelect = (product: ProductWithIngredients) => {
    setSelectedProduct(product)
  }

  const handleCloseModal = () => {
    setSelectedProduct(null)
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-3 mt-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            Todos
          </Badge>
          {isLoadingCategories && "Cargando categorías..."}
          {!isLoadingCategories && categoriesActive && categoriesActive.length === 0 && (
            <Badge variant="secondary" className="cursor-pointer">
              No hay categorías activas
            </Badge>
          )}
          {categoriesActive && categoriesActive.map((category: category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.description}
            </Badge>
          ))}
        </div>
      </div>
      {/* Si no hay productos en base a categorias y filtros, muestra un mensaje */}
      {!isLoadingProducts && filteredProducts?.length === 0 && (
        <div className="flex flex-col items-center justify-center text-muted-foreground py-8 space-y-4">
          <SearchX className="w-10 h-10 text-gray-400" />
          <span>No se encontraron productos, revise los filtros o cargue uno .</span>
          <Button variant="outline" onClick={() => setSelectedCategory(null)}>
            Ver todos los productos
          </Button>
        </div>
      )}
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoadingProducts && <div>Cargando productos...</div>}
        {filteredProducts && filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onSelect={handleProductSelect} />
        ))}
      </div>

      {selectedProduct && <IngredientSelector product={selectedProduct} onClose={handleCloseModal} />}
    </div>
  )
}
