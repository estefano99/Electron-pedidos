import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Ingredient } from "@/types/ingredient";
import { Trash2, TriangleAlert } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { deleteIngredient } from "@/api/IngredientApi";

interface props {
  ingredient: Ingredient
}

const Delete = ({ ingredient }: props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteIngredient,
    onError: (error: Error) => {
      console.log(error);
      toast({
        title: `Error al eliminar Ingrediente`,
        variant: "destructive",
        description: error.message || "Error inoportuno al eliminar Ingrediente`",
        className:
          "from-red-600 to-red-800 bg-gradient-to-tr bg-opacity-80 backdrop-blur-sm",
      });
    },
    onSuccess: (respuesta) => {
      toast({
        title: respuesta.message,
        description: (
          <span>
            Se ha eliminado{" "}
            <span className="underline underline-offset-2">
              {ingredient.description}
            </span>
          </span>
        ),
        className:
          "from-green-600 to-green-800 bg-gradient-to-tr bg-opacity-80 backdrop-blur-sm",
      });

      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });

  const handleDelete = async (data: Ingredient) => {
    console.log(data)
    await mutation.mutateAsync(data);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="w-5 h-5" />
          <p>Eliminar Ingrediente</p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl mb-2">
            ¿Estás seguro que deseas eliminar la siguiente Ingrediente?
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-0.5">
            <span className="block"><span className="font-bold text-slate-400 mr-1">Ingrediente:</span> {`${ingredient.description || "-"}`}</span>
            <span className="flex bg-red-500/25 px-3 py-2 rounded-lg mt-6 text-red-300/80">
              <TriangleAlert className="w-5 h-5 mr-1" />
              Al eliminarlo se borrará de la base de datos de forma permanente.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => { handleDelete(ingredient) }}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Delete;
