import { ingredientsMock } from '@/pages/Ingredients'
import Select from 'react-select'
import { Ingredient } from '@/types/ingredient'
import { MultiValue } from "react-select"

type OptionType = {
  label: string
  value: string
}

interface Props {
  value: MultiValue<OptionType>
  onChange: (value: MultiValue<OptionType>) => void
}

//transformar ingredientes en opciones de react-select
const ingredientOptions: OptionType[] = ingredientsMock.map((ingredient: Ingredient) => ({
  label: ingredient.description,
  value: ingredient.id,
}))

export const SelectMultiple = ({ value, onChange }: Props) => {
  return (
    <Select<OptionType, true>
      isMulti
      options={ingredientOptions}
      value={value}
      onChange={onChange}
      placeholder="Seleccionar ingredientes..."
      className="basic-multi-select text-black"
      classNamePrefix="select"
    />
  )
}
