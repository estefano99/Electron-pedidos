import Select, { MultiValue } from "react-select"
import { GetIngredientResponse, Ingredient } from "@/types/ingredient"
import { useQuery } from "@tanstack/react-query"
import { getIngredients } from "@/api/IngredientApi"

type OptionType = {
  label: string
  value: string
}

interface Props {
  selectedIds: string[] // importante: ids solamente
  onChange: (value: MultiValue<OptionType>) => void
}

export const SelectMultiple = ({ selectedIds, onChange }: Props) => {
  const { data, isLoading } = useQuery<GetIngredientResponse>({
    queryKey: ['ingredients'],
    queryFn: getIngredients,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });


  // Opciones posibles
  const ingredientOptions: OptionType[] | undefined = data?.ingredients.map((ingredient: Ingredient) => ({
    label: ingredient.description,
    value: ingredient.id,
  }))
  const selectedOptions = ingredientOptions?.filter(opt => selectedIds.includes(opt.value))

  return (
    <Select<OptionType, true>
      isMulti
      options={ingredientOptions ?? []}
      value={selectedOptions}
      onChange={onChange}
      isLoading={isLoading}
      placeholder="Seleccionar ingredientes..."
      className="basic-multi-select text-black cursor-pointer"
      classNamePrefix="select"
    />
  )
}
