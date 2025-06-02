
import { getCategories } from "@/api/CategoryApi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GetCategoriesResponse } from "@/types/category";
import { useQuery } from "@tanstack/react-query";

type Props = {
  value: string
  onValueChange: (value: string) => void
}

export function SelectCategory({ value, onValueChange }: Props) {
  const { data, isLoading } = useQuery<GetCategoriesResponse>({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  // console.log(data)

  return (
    isLoading ? <p className="text-bold">Cargando...</p> : data && (
      <Select onValueChange={onValueChange} defaultValue={value}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Seleccionar..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {data.map((category) => (
              <SelectItem className="hover:bg-blue-600" key={category.id} value={category.id}>
                {category.description}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  )
}
