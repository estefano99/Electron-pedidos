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
import { category } from "@/types/category";
import { Trash2, TriangleAlert } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { deleteCategory } from "@/api/CategoryApi";

interface props {
  category: category
}

const Delete = ({ category }: props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteCategory,
    onError: (error: Error) => {
      console.log(error);
      toast({
        title: `Error al eliminar Categoria`,
        variant: "destructive",
        description: error.message || "Error inoportuno al eliminar Categoria",
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
              {category.description}
            </span>
          </span>
        ),
        className:
          "from-green-600 to-green-800 bg-gradient-to-tr bg-opacity-80 backdrop-blur-sm",
      });

      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const handleDelete = async (data: category) => {
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
          <p>Eliminar Categoria</p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl mb-2">
            ¿Estás seguro que deseas eliminar la siguiente Categoria?
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-0.5">
            <span className="block"><span className="font-bold text-slate-400 mr-1">Categoria:</span> {`${category.description || "-"}`}</span>
            <span className="flex bg-red-500/25 px-3 py-2 rounded-lg mt-6 text-red-300/80">
              <TriangleAlert className="w-5 h-5 mr-1" />
              Al eliminarlo se borrará de la base de datos de forma permanente.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => { handleDelete(category) }}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Delete;
