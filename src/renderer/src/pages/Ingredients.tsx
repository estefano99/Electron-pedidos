import HeaderPages from "@/components/HeaderPages"
import { IngredientTable } from "@/components/ingredients/IngredientTable";
import { ingredient } from "@/types/ingredient";
import { useQuery } from "react-query";

export const ingredientsMock: { id: string; description: string }[] = [
  { id: 'gfg', description: "Bacon" },
  { id: 'asdasd', description: "Ketchup" },
  { id: 'qweqwe', description: "Mayonesa" },
  { id: 'zczxc', description: "Lechuga" },
  { id: 'ouilu', description: "Tomate" },
  { id: 'llll', description: "Pan" },
  { id: '14gdf', description: "Hamurguesa" },
];

const Ingredients = () => {
  // const { data, isLoading } = useQuery<category[]>({
  //   queryKey: ["inmuebles"],
  //   queryFn: obtenerInmuebles,
  // });
  const isLoading = false;
  return (
    <div className="w-full">
      <HeaderPages title="Ingedientes" />
      {isLoading ? "Cargando..." : ingredientsMock && <IngredientTable ingredients={ingredientsMock} />}
    </div>
  )
}

export default Ingredients
