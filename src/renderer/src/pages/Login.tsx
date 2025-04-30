import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { login } from "@/api/Auth";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Nombre es requerido",
  }),
  password: z.string().min(1, {
    message: "Contraseña es requerida",
  }),
});

export function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: login,
    onError: (error: Error) => {
      console.log(error);
      toast({
        title: error.message || "Hubo un error al iniciar sesion",
        variant: "destructive",
        description:
          `Intente iniciar sesion nuevamente, o revise sus credenciales`,
        className:
          "from-red-600 to-red-800 bg-gradient-to-tr bg-opacity-80 backdrop-blur-sm",
      });
    },
    onSuccess: () => {
      console.log("success")
      navigate("/inicio");
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    await mutation.mutateAsync(values);
  }
  return (
    <div className="w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
            <p className="text-balance text-muted-foreground">
              Ingresa nombre de usuario y contraseña para ingresar al sistema.
            </p>
          </div>
          <FormProvider {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
              {/* Campo para Nombre */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresar nombre de usuario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Campo para Contraseña */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingresar contraseña"
                        {...field}
                        type="password"
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="../assets/electron.svg"
          alt="Foto de electron"
          className="h-full w-full dark:brightness-[0.8]"
        />
      </div>
    </div>
  );
}
