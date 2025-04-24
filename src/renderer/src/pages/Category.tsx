import { CategoryTable } from "@/components/category/CategoryTable";
import HeaderPages from "@/components/HeaderPages";
import { category } from "@/types/category";
import { useState } from "react";
import { useQuery } from "react-query";

const categorias: { id: number; description: string, isActive: boolean }[] = [
  { id: 1, description: "Bebidas", isActive: true },
  { id: 2, description: "Comidas rápidas", isActive: true },
  { id: 3, description: "Postres", isActive: false },
  { id: 4, description: "Ensaladas", isActive: true },
  { id: 5, description: "Desayunos", isActive: true },
];


const Category = () => {
  const [isActive, setIsActive] = useState(true);
  // const { data, isLoading } = useQuery<category[]>({
  //   queryKey: ["categories", activos],
  //   queryFn: () => getCategory(activos),
  // });
  const isLoading = false;

  return (
    <div className="w-full">
      <HeaderPages title="Categorías" />
      {isLoading ? "Cargando..." : categorias && <CategoryTable categories={categorias} isActive={isActive} setIsActive={setIsActive} />}
    </div>
  );
};

export default Category;
