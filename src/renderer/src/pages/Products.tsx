import { getProducts } from '@/api/ProductApi'
import HeaderPages from '@/components/HeaderPages'
import { ProductTable } from '@/components/products/ProductTable'
import { ProductWithIngredients } from '@/types/product'
import { useQuery } from '@tanstack/react-query'

const Products = () => {
  const { data, isLoading } = useQuery<ProductWithIngredients[]>({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000,
  });
  return (
    <div className='w-full'>
      <HeaderPages title='Productos' />
      {isLoading ? "Cargando..." : data && <ProductTable products={data} />}
    </div>
  )
}

export default Products
