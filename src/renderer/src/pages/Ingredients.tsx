import { getIngredients } from "@/api/IngredientApi";
import HeaderPages from "@/components/HeaderPages"
import { IngredientTable } from "@/components/ingredients/IngredientTable";
import { GetIngredientResponse } from "@/types/ingredient";
import { useQuery } from "@tanstack/react-query";

const Ingredients = () => {
  const { data, isLoading } = useQuery<GetIngredientResponse>({
    queryKey: ["ingredients"],
    queryFn: getIngredients,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });
  console.log(data)
  return (
    <div className="w-full">
      <HeaderPages title="Ingedientes" />
      {isLoading ? "Cargando..." : data && <IngredientTable ingredients={data} />}
    </div>
  )
}

export default Ingredients
