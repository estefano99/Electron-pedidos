import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { FormProvider, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { login } from "@/api/Auth"
import { Loader2 } from "lucide-react"
import { startRoute } from "@/lib/routes"
import electronLogo from '../assets/electron.svg';

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Nombre es requerido",
  }),
  password: z.string().min(1, {
    message: "Contraseña es requerida",
  }),
})

export function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: login,
    onError: (error: Error) => {
      console.log(error)
      toast({
        title: error.message || "Hubo un error al iniciar sesión",
        variant: "destructive",
        description: "Intente nuevamente o revise sus credenciales.",
        className: "from-red-600 to-red-800 bg-gradient-to-tr bg-opacity-80 backdrop-blur-sm",
      })
    },
    onSuccess: () => {
      navigate(startRoute)
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutation.mutateAsync(values)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Imagen del local para pantallas grandes */}
      <div className="flex-1 bg-muted hidden md:block relative">
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="text-center space-y-4">
              <img
                src={electronLogo}
                alt="Imagen del local comercial"
                loading="lazy"
                className="rounded-lg shadow-lg mx-auto max-w-[90%] max-h-[400px] object-contain bg-white"
              />
              <div className="max-w-[90%] max-h-[400px] bg-gray-200 animate-pulse rounded-lg mx-auto" />
            <h2 className="text-2xl font-bold">Sistema de Pedidos</h2>
          </div>
        </div>
      </div>

      {/* Formulario de login */}
      <div className="flex-1 flex items-center justify-center p-6 flex-col">
        {/* Logo para dispositivos móviles */}
        <div className="mb-6 text-center md:hidden">
          <img
            src={electronLogo}
            alt="Logo del local comercial"
            className="rounded-full shadow-md mx-auto w-[150px] h-[150px] object-cover"
          />
          <h2 className="text-2xl font-bold">Sistema de Pedidos</h2>
        </div>

        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">Ingrese sus credenciales para acceder al sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Ingresar contraseña"
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    Ingresando</span> : "Ingresar"}
                </Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
