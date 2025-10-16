import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  Star,
} from "lucide-react"

const shirtPrices = {
  classic: 25,
  fitted: 28,
  oversized: 30,
}

const shirtNames = {
  classic: "Clásica",
  fitted: "Entallada",
  oversized: "Oversized",
}

export function OrderSummary({ selectedShirt, designs, onBack }) {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  })

  const [orderStep, setOrderStep] = useState("form")
  const [orderNumber, setOrderNumber] = useState("")
  const [estimatedDelivery, setEstimatedDelivery] = useState("")
  const [errors, setErrors] = useState({})

  const basePrice = shirtPrices[selectedShirt.model] || 25
  const designPrice = designs.length * 5 // $5 por diseño
  const subtotal = basePrice + designPrice
  const tax = Math.round(subtotal * 0.1 * 100) / 100 // 10% tax
  const shipping = subtotal > 50 ? 0 : 8 // Free shipping over $50
  const total = subtotal + tax + shipping

  const validateForm = () => {
    const newErrors = {}

    if (!customerInfo.name.trim()) newErrors.name = "Nombre es requerido"
    if (!customerInfo.email.trim()) newErrors.email = "Email es requerido"
    else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) newErrors.email = "Email inválido"
    if (!customerInfo.phone.trim()) newErrors.phone = "Teléfono es requerido"
    if (!customerInfo.address.trim()) newErrors.address = "Dirección es requerida"
    if (!customerInfo.city.trim()) newErrors.city = "Ciudad es requerida"
    if (!customerInfo.postalCode.trim()) newErrors.postalCode = "Código postal es requerido"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setOrderStep("processing")

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate order number and delivery date
    const orderNum = `RP${Date.now().toString().slice(-6)}`
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + 7) // 7 days from now

    setOrderNumber(orderNum)
    setEstimatedDelivery(
      deliveryDate.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    )

    // Simulate success/error (90% success rate)
    if (Math.random() > 0.1) {
      setOrderStep("success")
    } else {
      setOrderStep("error")
    }
  }

  const updateCustomerInfo = (field, value) => {
    setCustomerInfo({ ...customerInfo, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const getModelName = (model) => {
    return shirtNames[model] || model
  }

  const getColorName = (color) => {
    const colorNames = {
      "#ffffff": "Blanco",
      "#000000": "Negro",
      "#6b7280": "Gris",
      "#1e3a8a": "Azul Marino",
      "#dc2626": "Rojo",
      "#16a34a": "Verde",
      "#ec4899": "Rosa",
      "#eab308": "Amarillo",
    }
    return colorNames[color] || "Personalizado"
  }

  if (orderStep === "processing") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-xl font-semibold mb-2">Procesando tu Pedido</h2>
          <p className="text-muted-foreground">
            Estamos preparando tu remera personalizada. Esto puede tomar unos momentos...
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-4 h-4 bg-primary rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-sm">Validando información del pedido...</span>
              </div>
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-4 h-4 bg-primary rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                />
                <span className="text-sm">Preparando diseños para producción...</span>
              </div>
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-4 h-4 bg-primary rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 1 }}
                />
                <span className="text-sm">Calculando tiempo de entrega...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (orderStep === "success") {
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">¡Pedido Confirmado!</h2>
          <p className="text-muted-foreground">Tu remera personalizada está en producción</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Detalles del Pedido</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Número de Pedido</label>
                <p className="font-mono text-lg">{orderNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Pagado</label>
                <p className="text-lg font-bold">${total}</p>
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-muted-foreground">Entrega Estimada</label>
              <div className="flex items-center space-x-2 mt-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="capitalize">{estimatedDelivery}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Enviado a</label>
              <div className="flex items-start space-x-2 mt-1">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{customerInfo.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {customerInfo.address}, {customerInfo.city} {customerInfo.postalCode}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Pasos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium">Producción</p>
                  <p className="text-sm text-muted-foreground">3-5 días hábiles</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium">Envío</p>
                  <p className="text-sm text-muted-foreground">2-3 días hábiles</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium">Entrega</p>
                  <p className="text-sm text-muted-foreground">¡Disfruta tu remera!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Confirmación Enviada</p>
              <p className="text-sm text-blue-600">Hemos enviado los detalles del pedido a {customerInfo.email}</p>
            </div>
          </div>
        </div>

        <Button onClick={() => window.location.reload()} className="w-full">
          Hacer Otro Pedido
        </Button>
      </motion.div>
    )
  }

  if (orderStep === "error") {
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error en el Pedido</h2>
          <p className="text-muted-foreground">Hubo un problema procesando tu pedido. Por favor intenta nuevamente.</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Si el problema persiste, puedes contactarnos directamente:
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">soporte@ropapersonalizada.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setOrderStep("form")} className="flex-1">
            Intentar Nuevamente
          </Button>
          <Button onClick={onBack} className="flex-1">
            Volver al Editor
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Resumen del Pedido</h2>
        <p className="text-muted-foreground text-sm">Completa tus datos para finalizar la compra</p>
      </div>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <span>Detalles del Producto</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
            <div
              className="w-12 h-12 rounded-lg border-2 border-white shadow-sm"
              style={{ backgroundColor: selectedShirt.color }}
            />
            <div className="flex-1">
              <h3 className="font-medium">Remera {getModelName(selectedShirt.model)}</h3>
              <p className="text-sm text-muted-foreground">
                {getColorName(selectedShirt.color)} • Talla {selectedShirt.size}
              </p>
              {designs.length > 0 && (
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-muted-foreground">
                    {designs.length} diseño{designs.length !== 1 ? "s" : ""} personalizado
                    {designs.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="font-medium">${basePrice}</p>
              {designs.length > 0 && <p className="text-sm text-muted-foreground">+${designPrice} diseños</p>}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Impuestos</span>
              <span>${tax}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Envío</span>
              <span>{shipping === 0 ? "GRATIS" : `$${shipping}`}</span>
            </div>
            {shipping === 0 && (
              <Badge variant="secondary" className="text-xs">
                Envío gratis por compras mayores a $50
              </Badge>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Información de Contacto</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Nombre completo *</label>
              <Input
                value={customerInfo.name}
                onChange={(e) => updateCustomerInfo("name", e.target.value)}
                placeholder="Tu nombre"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email *</label>
              <Input
                type="email"
                value={customerInfo.email}
                onChange={(e) => updateCustomerInfo("email", e.target.value)}
                placeholder="tu@email.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Teléfono *</label>
            <Input
              value={customerInfo.phone}
              onChange={(e) => updateCustomerInfo("phone", e.target.value)}
              placeholder="+1 234 567 8900"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Dirección *</label>
            <Input
              value={customerInfo.address}
              onChange={(e) => updateCustomerInfo("address", e.target.value)}
              placeholder="Calle y número"
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Ciudad *</label>
              <Input
                value={customerInfo.city}
                onChange={(e) => updateCustomerInfo("city", e.target.value)}
                placeholder="Tu ciudad"
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Código Postal *</label>
              <Input
                value={customerInfo.postalCode}
                onChange={(e) => updateCustomerInfo("postalCode", e.target.value)}
                placeholder="12345"
                className={errors.postalCode ? "border-red-500" : ""}
              />
              {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Notas adicionales</label>
            <Textarea
              value={customerInfo.notes}
              onChange={(e) => updateCustomerInfo("notes", e.target.value)}
              placeholder="Instrucciones especiales, preferencias de entrega, etc."
            />
          </div>
        </CardContent>
      </Card>

      {/* Shipping Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="w-5 h-5" />
            <span>Información de Envío</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Package className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="font-medium">Producción</p>
              <p className="text-muted-foreground">3-5 días hábiles</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Truck className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="font-medium">Envío</p>
              <p className="text-muted-foreground">2-3 días hábiles</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="font-medium">Entrega</p>
              <p className="text-muted-foreground">5-8 días total</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Te enviaremos un email con el tracking una vez que tu pedido esté en camino.
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
          Volver al Preview
        </Button>
        <motion.div className="flex-1">
          <Button
            onClick={handleSubmit}
            disabled={!customerInfo.name || !customerInfo.email || !customerInfo.address}
            className="w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Confirmar Pedido - ${total}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}