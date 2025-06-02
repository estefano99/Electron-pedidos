import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { HousePlus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "@/api/ProductApi";
import { SelectMultiple } from "../ui/SelectMultiple";
import TableIngredientsSelect from "./TableIngredientsSelect";
import { SelectCategory } from "./SelectCategory";
import { ProductWithIngredients } from "@/types/product";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre es requerido.",
  }),
  description: z.string().min(1, {
    message: "La Descripcion es requerida.",
  }),
  price: z
    .coerce.number({
      required_error: "Precio unitario es obligatorio.",
      invalid_type_error: "Precio unitario debe ser un número.",
    })
    .min(1, { message: "Precio unitario debe ser mayor a 0." }),
  categoryId: z.string().min(1, {
    message: "La Categoria es requerida.",
  }),
  isActive: z.boolean(),
  ingredients: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
      isMandatory: z.boolean(),
    })
  ),
  imgUrl: z
    .instanceof(File)
    .refine((file) => file.size < 5 * 1024 * 1024, {
      message: "La imagen debe ser menor a 5MB",
    }),
});

type Props = {
  product: ProductWithIngredients;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit: boolean;
  setProductEdit: React.Dispatch<React.SetStateAction<ProductWithIngredients | null>>;
};

const FormEditar = ({ product, setIsEdit, isEdit, setProductEdit }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      isActive: product.isActive,
      ingredients: product.ingredients ? product.ingredients.map((ingredient: any) => ({
        id: ingredient.ingredient.id,
        description: ingredient.ingredient.description,
        isMandatory: ingredient.isMandatory,
      })) : [],
    },
  });

  const mutation = useMutation({
    mutationFn: updateProduct,
    onError: (error: Error) => {
      console.log(error);
      toast({
        title: `Error al editar Producto`,
        variant: "destructive",
        description: error.message || `Error inoportuno al editar Producto`,
        className:
          "from-red-600 to-red-800 bg-gradient-to-tr bg-opacity-80 backdrop-blur-sm",
      });
    },
    onSuccess: (respuesta) => {
      toast({
        title: "Producto editado con éxito",
        description: (
          <span>
            Se ha creado{" "} {respuesta.name || product.name}
          </span>
        ),
        className:
          "from-green-600 to-green-800 bg-gradient-to-tr bg-opacity-80 backdrop-blur-sm",
      });

      queryClient.invalidateQueries({ queryKey: ["products"] });
      setTimeout(() => {
        setProductEdit(null);
        setIsEdit(true);
      }, 500);
    },
  });

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>, onChange: (file: File) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file); // Se Envia el archivo al hook sin controlar el valor
      setFilePreview(URL.createObjectURL(file));
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      ...values,
      id: product.id,
    }
    await mutation.mutateAsync(data);
  }
  return (
    <AlertDialog onOpenChange={setIsEdit} open={isEdit}>
      <AlertDialogTrigger asChild className="h-8.5 2xl:h-10">
        <Button className="flex gap-2 text-xs px-2 py-1 2xl:text-sm" >
          <HousePlus className="h-4 w-4 2xl:h-5 2xl:w-5" />
          Editar Producto</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="!w-[80vw] !max-w-none h-full md:h-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Editar Producto</AlertDialogTitle>
          <AlertDialogDescription>
            Complete los campos para Editar el Producto
          </AlertDialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 pt-4"
            >
              <div className="w-full flex space-x-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="grow">
                          <FormLabel>Nombre <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Ingresar nombre" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="grow">
                          <FormLabel>Descripcion <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Ingresar descripcion" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="grow">
                          <FormLabel>Precio <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Ingresar precio" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem className="grow">
                          <FormLabel>Categoría <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <SelectCategory
                              value={field.value}
                              onValueChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              value={field.value ? "true" : "false"}
                              onChange={(e) => field.onChange(e.target.value === "true")}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            >
                              <option className="rounded-full" value="true">Activo</option>
                              <option className="" value="false">Inactivo</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <FormField
                        control={form.control}
                        name="imgUrl"
                        render={({ field: { onChange, onBlur, ref, name } }) => (
                          <FormItem>
                            <FormLabel>Imagen</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                accept="image/*"
                                name={name}
                                onBlur={onBlur}
                                ref={ref}
                                onChange={(e) => handleChangeFile(e, onChange)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center justify-center">
                        {!filePreview && product?.imgUrl && (
                          <div className="mt-2">
                            <img
                              src={product?.imgUrl}
                              alt="Preview"
                              className="w-20 h-20 object-contain"
                            />
                          </div>
                        )}
                        {filePreview && (
                          <div className="mt-2">
                            <img
                              src={filePreview}
                              alt="Preview"
                              className="w-16 h-16 object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* INGREDIENTES */}
                <div className="flex flex-col">
                  <FormField
                    control={form.control}
                    name="ingredients"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ingredientes</FormLabel>
                        <FormControl>
                          <SelectMultiple
                            selectedIds={(field.value ?? []).map((i) => i.id)} // Solo ids
                            onChange={(selectedOptions) => {
                              const ingredients = selectedOptions.map(option => {
                                // busco en los valores actuales del formulario si ya venía ese ingrediente
                                const existing = field.value.find(i => i.id === option.value)
                                return {
                                  id: option.value,
                                  description: option.label,
                                  isMandatory: existing?.isMandatory ?? false,
                                }
                              })
                              field.onChange(ingredients)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Tabla de ingredientes seleccionados */}
                  {form.watch("ingredients")?.length > 0 && (
                    <TableIngredientsSelect
                      ingredientsSelected={form.watch("ingredients")}
                      setValue={form.setValue}
                    />
                  )}
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => form.reset()}>Cancelar</AlertDialogCancel>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Guardando..." : "Guardar"}
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog >
  );
};

export default FormEditar;
