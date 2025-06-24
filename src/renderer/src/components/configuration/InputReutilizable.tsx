import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  name: string
  label: string
  required?: boolean
}

export function InputReutilizable({ name, label, required }: Props) {
  const { register, formState: { errors } } = useFormContext()

  return (
    <div className="space-y-1">
      <Label htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input id={name} {...register(name)} />
      {errors[name] && (
        <p className="text-sm text-red-500">{errors[name]?.message as string}</p>
      )}
    </div>
  )
}
