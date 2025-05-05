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
  })
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
      console.log(respuesta);
      toast({
        title: "Ingrediente editado exitosamente!",
        description: (
          <span>
            Se ha editado el Ingrediente{" "}
            <span className="underline underline-offset-2">
              {respuesta.ingredient.description}
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
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                {/* <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Cargando..." : "Guardar"}
                </Button> */}
                <Button type="submit">Guardar</Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FormEditar;
