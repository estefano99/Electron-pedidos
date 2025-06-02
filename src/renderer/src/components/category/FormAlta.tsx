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
import { createCategory } from "@/api/CategoryApi";
import { Tag } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  description: z.string().min(1, {
    message: "La Descripcion es requerida.",
  }),
  isActive: z.boolean(),
});

const FormAlta = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      isActive: true,
    },
  });

  const mutation = useMutation({
    mutationFn: createCategory,
    onError: (error: Error) => {
      console.log(error);
      toast({
        title: `Error al crear categoria`,
        variant: "destructive",
        description: error.message || `Error inoportuno al crear categoria`,
        className:
          "from-red-600 to-red-800 bg-gradient-to-tr bg-opacity-80 backdrop-blur-sm",
      });
    },
    onSuccess: (respuesta) => {
      toast({
        title: "Categoria creada con éxito",
        description: (
          <span>
            Se ha creado{" "} {respuesta.description}
          </span>
        ),
        className:
          "from-green to-green-800 bg-gradient-to-tr bg-opacity-80 backdrop-blur-sm",
      });

      queryClient.invalidateQueries({ queryKey: ["categories"] });
      form.reset();
      setOpen(false); //Cierra modal
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    await mutation.mutateAsync(values);
  }
  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogTrigger asChild className="h-8.5 2xl:h-10">
        <Button className="flex gap-2 text-xs 2xl:text-sm">
          <Tag className="h-4 w-4 2xl:h-5 2xl:w-5" />
          Crear Categoría</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full h-full md:h-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Crear Categoría</AlertDialogTitle>
          <AlertDialogDescription>
            Complete los campos para crear un nuevo Categoría
          </AlertDialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 pt-4"
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormLabel>Descripcion <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresar nombre" {...field} />
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
                <AlertDialogCancel onClick={() => form.reset()}>Cancelar</AlertDialogCancel>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Cargando..." : "Guardar"}
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
