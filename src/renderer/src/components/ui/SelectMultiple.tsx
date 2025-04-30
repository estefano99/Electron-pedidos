import Select, { MultiValue } from "react-select"
import { GetIngredientResponse, Ingredient } from "@/types/ingredient"
import { useQueryClient } from "react-query"

type OptionType = {
  label: string
  value: string
}

interface Props {
  selectedIds: string[] // importante: ids solamente
  onChange: (value: MultiValue<OptionType>) => void
}

export const SelectMultiple = ({ selectedIds, onChange }: Props) => {
  const queryClient = useQueryClient();
  const data: GetIngredientResponse[] | undefined = queryClient.getQueryData(["ingredients"]);
  console.log('Ingredients: ', data)

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
      placeholder="Seleccionar ingredientes..."
      className="basic-multi-select text-black cursor-pointer"
      classNamePrefix="select"
    />
  )
}
