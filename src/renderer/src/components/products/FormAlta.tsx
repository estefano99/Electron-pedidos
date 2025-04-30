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
import { useMutation, useQueryClient } from "react-query";
import { createProduct } from "@/api/ProductApi";
import { SelectMultiple } from "../ui/SelectMultiple";
import TableIngredientsSelect from "./TableIngredientsSelect";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre es requerido.",
  }),
  description: z.string().min(1, {
    message: "La Descripcion es requerida.",
  }),
  unitaryPrice: z
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
  ).min(1, { message: "Debe seleccionar al menos un ingrediente" }),
});

const FormAlta = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      unitaryPrice: undefined,
      categoryId: undefined,
      isActive: true,
      ingredients: [],
    },
  });

  const mutation = useMutation({
    mutationFn: createProduct,
    onError: (error: Error) => {
      console.log(error);
      toast({
        title: `Error al crear Producto"`,
        variant: "destructive",
        description: error.message || `Error inoportuno al crear Producto`,
        className:
          "from-red-600 to-red-800 bg-gradient-to-tr bg-opacity-80 backdrop-blur-sm",
      });
    },
    onSuccess: (respuesta) => {
      toast({
        title: respuesta.message,
        description: (
          <span>
            Se ha creado{" "} {respuesta.product.name}
          </span>
        ),
        className:
          "from-green-600 to-green-800 bg-gradient-to-tr bg-opacity-80 backdrop-blur-sm",
      });

      queryClient.invalidateQueries({ queryKey: ["products"] });
      form.reset();
      setOpen(false); //Cierra modal
    },
  });

  console.log(form.watch());

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const ingredientsToSend = values.ingredients.map(ingredient => ({
      id: ingredient.id,
      isMandatory: ingredient.isMandatory
    }));

    console.log("Datos para enviar:", ingredientsToSend);
    // await mutation.mutateAsync(values);
  }
  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogTrigger asChild className="h-8.5 2xl:h-10">
        <Button className="flex gap-2 text-xs 2xl:text-sm" >
          <HousePlus className="h-4 w-4 2xl:h-5 2xl:w-5" />
          Crear Producto</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full h-full md:h-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Crear Producto</AlertDialogTitle>
          <AlertDialogDescription>
            Complete los campos para crear un nuevo Producto
          </AlertDialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 pt-4"
            >
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
                  name="unitaryPrice"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormLabel>Precio unitario <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Ingresar precio unitario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              </div>
              <div className="grid grid-cols-1 gap-4">
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
                            const ingredients = selectedOptions.map(option => ({
                              id: option.value,
                              description: option.label,
                              isMandatory: false, // Por defecto no obligatorio
                            }))
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
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => form.reset()}>Cancelar</AlertDialogCancel>
                <Button type="submit" disabled={mutation.isLoading}>
                  {mutation.isLoading ? "Cargando..." : "Guardar"}
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog >
  );
};

export default FormAlta;
