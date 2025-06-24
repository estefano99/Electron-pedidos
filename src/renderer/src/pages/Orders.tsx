import { useState } from "react"
import { ProductList } from "@/components/order/ProductList"
import { OrderPanel } from "@/components/order/OrderPanel"
import { OrderHistory } from "@/components/order/OrderHistory"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useOrder } from "@/hooks/use-order"
import { User, ShoppingCart } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import { useQueryClient } from "@tanstack/react-query"
import { Order } from "@/types/order"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import HeaderPages from "@/components/HeaderPages"

export default function Orders() {
  const { currentOrder, startNewOrder } = useOrder()
  const [customerName, setCustomerName] = useState("")
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null)
  const [activeTab, setActiveTab] = useState("current-order")
  const queryClient = useQueryClient()

  const allOrders = queryClient.getQueryData(["orders"]) as Order[] || []

  const handleNewOrder = () => {
    if (customerName.trim() && scheduledTime) {
      startNewOrder(customerName.trim(), scheduledTime)
      setCustomerName("")
      setScheduledTime(null)
      setActiveTab("current-order")
    }
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-auto">
      <HeaderPages title="Pedidos" />

      <div className="flex-1 flex">
        {/* Left Panel - Products */}
        <div className="w-2/3 p-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Menú de Productos</CardTitle>
            </CardHeader>
            <CardContent className="h-full overflow-y-auto">
              <ProductList />
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Order Management */}
        <div className="w-1/3 p-6 pl-0">
          <div className="h-full flex flex-col gap-4">
            {/* New Order Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Nuevo Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Nombre del Cliente</Label>
                  <Input
                    id="customer-name"
                    placeholder="Ingrese el nombre..."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    onClick={() => handleNewOrder()}
                  />
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="scheduled-time">Horario del Pedido</Label>
                    <DatePicker
                      selected={scheduledTime}
                      onChange={(date) => setScheduledTime(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="dd/MM/yyyy HH:mm"
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      placeholderText="Seleccionar fecha y hora"
                    />
                  </div>
                </div>
                <Button onClick={handleNewOrder} className="w-full" disabled={!customerName.trim() || !scheduledTime}>
                  <User className="h-4 w-4 mr-2" />
                  Iniciar Pedido
                </Button>
              </CardContent>
            </Card>

            {/* Order Tabs */}
            <Card className="flex-1">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="flex justify-center mb-2">
                  <TabsList className="grid w-[90%] grid-cols-2 mt-4">
                    <TabsTrigger value="current-order" className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      <p className="text-xs md:text-sm">Pedido Actual</p>
                      {currentOrder && (
                        <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                          {currentOrder.items.length}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="all-orders" className="flex items-center gap-2">
                      <p className="text-xs md:text-sm"> Todos los Pedidos </p>
                      {allOrders.length > 0 && (
                        <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                          {allOrders.length}
                        </span>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="current-order" className="flex-1 px-6 pb-6">
                  <OrderPanel setCustomerName={setCustomerName} setScheduledTime={setScheduledTime} setActiveTab={setActiveTab} />
                </TabsContent>

                <TabsContent value="all-orders" className="flex-1 px-6 pb-6">
                  <OrderHistory />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
