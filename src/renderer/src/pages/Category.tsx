import { getCategories } from "@/api/CategoryApi";
import { CategoryTable } from "@/components/category/CategoryTable";
import HeaderPages from "@/components/HeaderPages";
import { GetCategoriesResponse } from "@/types/category";
import { useQuery } from "@tanstack/react-query";

const Category = () => {
  const { data, isLoading } = useQuery<GetCategoriesResponse>({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  return (
    <div className="w-full">
      <HeaderPages title="Categorías" />
      {isLoading ? "Cargando..." : data && <CategoryTable categories={data || []} />}
    </div>
  );
};

export default Category;
