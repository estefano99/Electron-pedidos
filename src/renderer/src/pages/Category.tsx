import { getCategories } from "@/api/CategoryApi";
import { CategoryTable } from "@/components/category/CategoryTable";
import HeaderPages from "@/components/HeaderPages";
import { GetCategoriesResponse } from "@/types/category";
import { useQuery } from "react-query";

const Category = () => {
  const { data, isLoading } = useQuery<GetCategoriesResponse>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <div className="w-full">
      <HeaderPages title="Categorías" />
      {isLoading ? "Cargando..." : data && <CategoryTable categories={data.categories} />}
    </div>
  );
};

export default Category;
