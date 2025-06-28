import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Settings, Save, MapPin, Store, ImageIcon, Loader2 } from "lucide-react"
import { createConfiguration, getConfiguration } from "@/api/ConfigurationApi"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form"
import { InputReutilizable } from "./InputReutilizable"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { RestaurantSettings, suscriptionType } from "@/types/configuration"

const formSchema = z.object({
  id: z.string(),

  displayName: z.string().min(1, {
    message: "El nombre del restaurante es obligatorio.",
  }),

  instagramUrl: z
    .string()
    .url({ message: "La URL de Instagram no es válida." })
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .optional(),

  address: z.string().optional(),
  latitude: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === null ||
        val === "" ||
        (!isNaN(Number(val)) && Math.abs(Number(val)) <= 90),
      {
        message: "Latitud inválida. Debe estar entre -90 y 90.",
      }
    ),

  longitude: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === null ||
        val === "" ||
        (!isNaN(Number(val)) && Math.abs(Number(val)) <= 180),
      {
        message: "Longitud inválida. Debe estar entre -180 y 180.",
      }
    ),
  imageFile: z
    .instanceof(File)
    .refine((file) => file.size < 5 * 1024 * 1024, {
      message: "La imagen debe ser menor a 5MB",
    })
    .optional(),
  suscriptionType: z.nativeEnum(suscriptionType)
}
)

export function SettingsPanel() {
  const { toast } = useToast()
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<RestaurantSettings>({
    queryKey: ["settings"],
    queryFn: getConfiguration,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  const mutation = useMutation({
    mutationFn: createConfiguration,
    onError: (error: Error) => {
      console.log(error);
      toast({
        title: `Error al setear configuracion`,
        variant: "destructive",
        description: error.message || `Error inoportuno al setear configuracion`,
        className:
          "from-red-600 to-red-800 bg-gradient-to-tr bg-opacity-80 backdrop-blur-sm",
      });
    },
    onSuccess: () => {
      toast({
        title: "Configuraacion seteada con exito",
        description: (
          <span>
            se han editado los campos de configuracion
          </span>
        ),
        className:
          "from-green-600 to-green-800 bg-gradient-to-tr bg-opacity-80 backdrop-blur-sm",
      });

      queryClient.invalidateQueries({ queryKey: ["settings"] });
      setFilePreview(null);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      displayName: "",
      instagramUrl: "",
      phone: "",
      address: "",
      latitude: "",
      longitude: "",
      imageFile: undefined,
    },
  });
  //Mostrar por consola los errores al submit
  console.log(form.formState.errors);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>, onChange: (file: File) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file); // Se Envia el archivo al hook sin controlar el valor
      setFilePreview(URL.createObjectURL(file));
    }
  }

  const handleGetLocation = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      if (!res.ok) throw new Error("No se pudo obtener la ubicación desde IP");

      const data = await res.json();

      if (data.latitude && data.longitude) {
        form.setValue("latitude", data.latitude.toString());
        form.setValue("longitude", data.longitude.toString());

        toast({
          title: "Ubicación obtenida",
          description: `Latitud: ${data.latitude}, Longitud: ${data.longitude}`,
        });
      } else {
        throw new Error("Datos de ubicación incompletos");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error al obtener la ubicación",
        description: "No se pudo obtener la ubicación automáticamente",
        variant: "destructive",
      });
    }
  };
  console.log(data)

  useEffect(() => {
    if (data) {
      form.reset({
        id: data.id ?? "",
        displayName: data.displayName ?? "",
        instagramUrl: data.instagramUrl ?? "",
        phone: data.phone ?? "",
        address: data.address ?? "",
        latitude: String(data.latitude) ?? "",
        longitude: String(data.longitude) ?? "",
        imageFile: undefined,
        suscriptionType: data.suscriptionType ?? suscriptionType.BASIC,
      });
    }
    if (data?.logoUrl) {
      setLogoUrl(data.logoUrl);
    }
  }, [data, form]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutation.mutateAsync(values);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-11/12 mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Configuración del Restaurante</h2>
          </div>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" /> Información Básica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Restaurante</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Restaurante el buen sabor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 3465123413" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="instagramUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: https://www.instagram.com/example" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Ubicación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Ej: Av. Principal 123, Centro, Ciudad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputReutilizable name="latitude" label="Latitud" />
                <InputReutilizable name="longitude" label="Longitud" />
              </div>
              <Button variant="outline" type="button" onClick={handleGetLocation} className="w-full">
                <MapPin className="h-4 w-4 mr-2" /> Obtener Ubicación Actual
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" /> Imagen del Restaurante
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="imageFile"
                    render={({ field: { onChange, onBlur, ref, name } }) => (
                      <FormItem>
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
                  <Badge variant="secondary">Máximo 5MB - JPG, PNG, GIF, WEBP</Badge>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
              </div>
              {(filePreview || logoUrl) && (
                <div className="space-y-2">
                  <Label>Vista previa:</Label>
                  <div className="relative w-48 h-48 border rounded-lg overflow-hidden">
                    <img
                      src={filePreview || logoUrl || ""}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <Badge variant="secondary">{data?.suscriptionType}</Badge>
                </div>
                <Button type="submit" disabled={isLoading} className="min-w-[140px]">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Guardando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4 mr-2" /> Guardar Configuración
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </FormProvider>
  )
}
