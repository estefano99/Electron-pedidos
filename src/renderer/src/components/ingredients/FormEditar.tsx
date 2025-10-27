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
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ingredient } from "@/types/ingredient";
import { editIngredient } from "@/api/IngredientApi";

const formSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, {
    message: "Descripción debe tener al menos 1 letra.",
  }),
  extraPrice: z
    .coerce.number({
      required_error: "Precio es obligatorio.",
      invalid_type_error: "Precio debe ser un número.",
    })
    .min(0, { message: "Precio debe ser mayor o igual a 0." }),
  isActive: z.boolean(),
});

interface props {
  ingredient: Ingredient;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  isEdit: boolean;
  setIngredientEdit: Dispatch<SetStateAction<Ingredient | null>>;
}

const FormEditar = ({
  ingredient,
  setIsEdit,
  isEdit,
  setIngredientEdit,
}: props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: ingredient.description,
      extraPrice: ingredient.extraPrice,
      isActive: ingredient.isActive,
    },
  });

  const mutation = useMutation({
    mutationFn: editIngredient,
    onError: (error: Error) => {
      console.log(error);
      toast({
        title: "Error al editar Ingrediente.",
        variant: "destructive",
        description: error.message || "Error inoportuno en el servidor al editar Ingrediente",
        className:
          "from-red-600 to-red-800 bg-gradient-to-tr bg-opacity-80 backdrop-blur-sm",
      });
    },
    onSuccess: (respuesta) => {
      toast({
        title: "Ingrediente editado exitosamente!",
        description: (
          <span>
            Se ha editado el Ingrediente{" "}
            <span className="underline underline-offset-2">
              {respuesta.description}
            </span>
          </span>
        ),
        className:
          "from-green-600 to-green-800 bg-gradient-to-tr bg-opacity-80 backdrop-blur-sm",
      });

      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      setTimeout(() => {
        setIngredientEdit(null);
        setIsEdit(true);
      }, 500);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data: Ingredient = {
      id: ingredient?.id,
      ...values
    };

    await mutation.mutateAsync(data);
  }
  return (
    <AlertDialog onOpenChange={setIsEdit} open={isEdit}>
      <AlertDialogContent className="w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>Editar Ingrediente</AlertDialogTitle>
          <AlertDialogDescription>
            Edita los campos que deseas modificar.
          </AlertDialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingesar Descripción" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="extraPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio Extra<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresar Precio" type="number" {...field} />
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
                    <FormLabel>Activo <span className="text-red-500">*</span></FormLabel>
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
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Guardando..." : "Guardar"}
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FormEditar;
