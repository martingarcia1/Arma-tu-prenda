"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Upload, ImageIcon, Type, Palette, X, RotateCw, Move, ZoomIn, ZoomOut } from "lucide-react"

const predefinedDesigns = [
  "/cool-skull-design.jpg",
  "/abstract-geometric-pattern.png",
  "/vintage-logo.jpg",
  "/nature-leaf-design.jpg",
  "/abstract-composition.png",
  "/music-notes.jpg",
]

export function DesignEditor({ designs, onDesignsChange, onNext, onBack }) {
  const [activeTab, setActiveTab] = useState("gallery")
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [textInput, setTextInput] = useState("")
  const [textFont, setTextFont] = useState("Arial")
  const [textSize, setTextSize] = useState("24")
  const [textColor, setTextColor] = useState("#000000")
  const fileInputRef = useRef(null)

  const addDesign = (imageUrl) => {
    const newDesign = {
      id: Date.now().toString(),
      image: imageUrl,
      x: 40, // Center position
      y: 30,
      width: 80,
      height: 80,
      rotation: 0,
    }
    onDesignsChange([...designs, newDesign])
  }

  const addTextDesign = () => {
    if (!textInput.trim()) return

    // Create a canvas to render text as image
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 300
    canvas.height = 100

    // Set font and measure text
    ctx.font = `${textSize}px ${textFont}`
    ctx.fillStyle = textColor
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Fill background (transparent)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw text
    ctx.fillText(textInput, canvas.width / 2, canvas.height / 2)

    // Convert to data URL
    const dataUrl = canvas.toDataURL("image/png")
    addDesign(dataUrl)
    setTextInput("")
  }

  const removeDesign = (designId) => {
    onDesignsChange(designs.filter((d) => d.id !== designId))
    if (selectedDesign === designId) {
      setSelectedDesign(null)
    }
  }

  const updateDesign = (designId, updates) => {
    onDesignsChange(designs.map((design) => (design.id === designId ? { ...design, ...updates } : design)))
  }

  const rotateDesign = (designId) => {
    const design = designs.find((d) => d.id === designId)
    if (design) {
      updateDesign(designId, { rotation: (design.rotation + 15) % 360 })
    }
  }

  const resizeDesign = (designId, scale) => {
    const design = designs.find((d) => d.id === designId)
    if (design) {
      const newWidth = Math.max(20, Math.min(200, design.width * scale))
      const newHeight = Math.max(20, Math.min(200, design.height * scale))
      updateDesign(designId, { width: newWidth, height: newHeight })
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona un archivo de imagen válido")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("El archivo es demasiado grande. Máximo 5MB.")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          addDesign(e.target.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const addColorShape = (shape, color) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 100
    canvas.height = 100

    ctx.fillStyle = color

    switch (shape) {
      case "circle":
        ctx.beginPath()
        ctx.arc(50, 50, 40, 0, 2 * Math.PI)
        ctx.fill()
        break
      case "square":
        ctx.fillRect(10, 10, 80, 80)
        break
      case "triangle":
        ctx.beginPath()
        ctx.moveTo(50, 10)
        ctx.lineTo(10, 90)
        ctx.lineTo(90, 90)
        ctx.closePath()
        ctx.fill()
        break
      case "star":
        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5
          const x = 50 + Math.cos(angle) * (i % 2 === 0 ? 40 : 20)
          const y = 50 + Math.sin(angle) * (i % 2 === 0 ? 40 : 20)
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
        break
      case "heart":
        ctx.beginPath()
        ctx.moveTo(50, 80)
        ctx.bezierCurveTo(50, 70, 30, 50, 30, 35)
        ctx.bezierCurveTo(30, 20, 50, 20, 50, 35)
        ctx.bezierCurveTo(50, 20, 70, 20, 70, 35)
        ctx.bezierCurveTo(70, 50, 50, 70, 50, 80)
        ctx.fill()
        break
      case "hexagon":
        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3
          const x = 50 + Math.cos(angle) * 35
          const y = 50 + Math.sin(angle) * 35
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
        break
    }

    const dataUrl = canvas.toDataURL("image/png")
    addDesign(dataUrl)
  }

  const tabs = [
    { id: "gallery", label: "Galería", icon: ImageIcon },
    { id: "upload", label: "Subir", icon: Upload },
    { id: "text", label: "Texto", icon: Type },
    { id: "colors", label: "Formas", icon: Palette },
  ]

  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"]
  const shapes = ["circle", "square", "triangle", "star", "heart", "hexagon"]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Editor de Diseño</h2>
        <p className="text-muted-foreground text-sm">Agrega estampas, texto o diseños personalizados</p>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </CardHeader>

        <CardContent>
          {/* Gallery Tab */}
          {activeTab === "gallery" && (
            <div className="space-y-4">
              <h3 className="font-medium">Diseños Predefinidos</h3>
              <div className="grid grid-cols-2 gap-3">
                {predefinedDesigns.map((design, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="aspect-square border rounded-lg p-2 hover:border-primary transition-colors overflow-hidden"
                    onClick={() => addDesign(design)}
                  >
                    <img
                      src={design || "/placeholder.svg"}
                      alt={`Diseño ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === "upload" && (
            <div className="space-y-4">
              <h3 className="font-medium">Subir Imagen</h3>
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-1">Haz clic para subir una imagen</p>
                <p className="text-xs text-muted-foreground">PNG, JPG hasta 5MB</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </div>
          )}

          {/* Text Tab */}
          {activeTab === "text" && (
            <div className="space-y-4">
              <h3 className="font-medium">Agregar Texto</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Escribe tu texto aquí..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={textFont}
                    onChange={(e) => setTextFont(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times">Times</option>
                    <option value="Impact">Impact</option>
                    <option value="Georgia">Georgia</option>
                  </select>
                  <select
                    value={textSize}
                    onChange={(e) => setTextSize(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="16">16px</option>
                    <option value="20">20px</option>
                    <option value="24">24px</option>
                    <option value="32">32px</option>
                    <option value="48">48px</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Color:</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-8 h-8 border rounded cursor-pointer"
                  />
                </div>
                <Button className="w-full" onClick={addTextDesign} disabled={!textInput.trim()}>
                  Agregar Texto
                </Button>
              </div>
            </div>
          )}

          {/* Colors/Shapes Tab */}
          {activeTab === "colors" && (
            <div className="space-y-4">
              <h3 className="font-medium">Formas y Colores</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Formas:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {shapes.map((shape) => (
                      <Button
                        key={shape}
                        variant="outline"
                        className="text-xs capitalize bg-transparent"
                        onClick={() => addColorShape(shape, colors[0])}
                      >
                        {shape === "circle"
                          ? "Círculo"
                          : shape === "square"
                            ? "Cuadrado"
                            : shape === "triangle"
                              ? "Triángulo"
                              : shape === "star"
                                ? "Estrella"
                                : shape === "heart"
                                  ? "Corazón"
                                  : "Hexágono"}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Colores:</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded border-2 border-gray-300 hover:border-primary transition-colors"
                        style={{ backgroundColor: color }}
                        onClick={() => addColorShape("circle", color)}
                        title={`Agregar círculo ${color}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Designs with Enhanced Controls */}
      {designs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Diseños Aplicados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {designs.map((design, index) => (
                <div
                  key={design.id}
                  className={`p-3 border rounded-md transition-colors ${
                    selectedDesign === design.id ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={design.image || "/placeholder.svg"}
                        alt={`Diseño ${index + 1}`}
                        className="w-10 h-10 object-contain border rounded"
                      />
                      <div>
                        <span className="text-sm font-medium">Diseño {index + 1}</span>
                        <p className="text-xs text-muted-foreground">
                          {design.width}x{design.height}px • {design.rotation}°
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDesign(selectedDesign === design.id ? null : design.id)}
                      >
                        <Move className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => removeDesign(design.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Design Controls */}
                  {selectedDesign === design.id && (
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => resizeDesign(design.id, 0.9)}>
                          <ZoomOut className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => resizeDesign(design.id, 1.1)}>
                          <ZoomIn className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => rotateDesign(design.id)}>
                          <RotateCw className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex space-x-3">
        <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
          Volver
        </Button>
        <Button onClick={onNext} className="flex-1">
          Ver Preview
        </Button>
      </div>
    </div>
  )
}
