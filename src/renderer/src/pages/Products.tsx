import { getProducts } from '@/api/ProductApi'
import HeaderPages from '@/components/HeaderPages'
import { ProductTable } from '@/components/products/ProductTable'
import { ProductWithIngredients } from '@/types/product'
import { useQuery } from '@tanstack/react-query'

const Products = () => {
  const { data, isLoading } = useQuery<ProductWithIngredients[]>({
    queryKey: ["products"],
    queryFn: getProducts,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false
  });
  return (
    <div className='w-full'>
      <HeaderPages title='Productos' />
      {isLoading ? "Cargando..." : data && <ProductTable products={data} />}
    </div>
  )
}

export default Products
