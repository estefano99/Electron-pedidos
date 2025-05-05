import HeaderPages from '@/components/HeaderPages'
import { ProductTable } from '@/components/products/ProductTable'

import { category } from '@/types/category'
import { Ingredient } from '@/types/ingredient'
import { ProductWithIngredients } from '@/types/product'

export const mockProducts: ProductWithIngredients[] = [
  {
    id: "1",
    name: "Hamurguesa con queso",
    description: "Hamurguesa doble con rucula etc...",
    unitaryPrice: 12.5,
    urlImage: "https://example.com/images/pizza-margarita.jpg",
    isActive: true,
    created_at: new Date("2025-01-05T10:00:00Z"),
    updated_at: new Date("2025-01-10T15:30:00Z"),
    categoryId: '1232asd',
    category: { id: '1232asd', description: "Pizzas", isActive: true } as category,
    ingredients: [
      { ingredient: { id: 'asdasd', description: "Hamurguesa" } as Ingredient, isMandatory: true },
      { ingredient: { id: 'eeeee', description: "Pan" } as Ingredient, isMandatory: true },
      { ingredient: { id: '1231243', description: "Rucula" } as Ingredient, isMandatory: false },
      { ingredient: { id: 'fffff', description: "Tomate" } as Ingredient, isMandatory: false },
      { ingredient: { id: 'aaaa', description: "Queso" } as Ingredient, isMandatory: false },
    ],
  },
  {
    id: "2",
    name: "Ensalada César",
    description: "Lechuga romana, pollo a la plancha, croutons y aderezo César.",
    unitaryPrice: 9.75,
    urlImage: "https://example.com/images/ensalada-cesar.jpg",
    isActive: true,
    created_at: new Date("2025-02-01T09:15:00Z"),
    updated_at: new Date("2025-02-05T11:00:00Z"),
    categoryId: '1232asd',
    category: { id: '1ads43gd', description: "Ensaladas" } as category,
    ingredients: [
      { ingredient: { id: '1ads43gd', description: "Lechuga romana" } as Ingredient, isMandatory: true },
      { ingredient: { id: '1ads43gd', description: "Pechuga de pollo" } as Ingredient, isMandatory: true },
      { ingredient: { id: '1ads43gd', description: "Croutons" } as Ingredient, isMandatory: false },
      { ingredient: { id: '1ads43gd', description: "Aderezo César" } as Ingredient, isMandatory: true },
    ],
  },
  {
    id: "3",
    name: "Hamburguesa Clásica",
    description: "Pan artesanal, carne de vaca, cheddar, lechuga, tomate y cebolla.",
    unitaryPrice: 11.0,
    urlImage: "https://example.com/images/hamburguesa-clasica.jpg",
    isActive: false,
    created_at: new Date("2025-03-12T14:20:00Z"),
    updated_at: new Date("2025-03-15T16:45:00Z"),
    categoryId: '1232asd',
    category: { id: 'dfgk', description: "Hamburguesas" } as category,
    ingredients: [
      { ingredient: { id: 'kjoirgpo', description: "Pan artesanal" } as Ingredient, isMandatory: true },
      { ingredient: { id: 'kjoirgpo', description: "Carne de vaca" } as Ingredient, isMandatory: true },
      { ingredient: { id: 'kjoirgpo', description: "Queso cheddar" } as Ingredient, isMandatory: true },
      { ingredient: { id: 'kjoirgpo', description: "Lechuga" } as Ingredient, isMandatory: false },
      { ingredient: { id: 'kjoirgpo', description: "Tomate" } as Ingredient, isMandatory: false },
      { ingredient: { id: 'kjoirgpo', description: "Cebolla" } as Ingredient, isMandatory: false },
    ],
  },
]

const Products = () => {
  // const { data, isLoading } = useQuery<Product[]>({
  // queryKey: ["products"],
  // queryFn: getProducts,
  // staleTime: 60 * 1000,
  // });
  const isLoading = false;
  return (
    <div className='w-full'>
      <HeaderPages title='Productos' />
      {isLoading ? "Cargando..." : mockProducts && <ProductTable products={mockProducts} />}
    </div>
  )
}

export default Products
