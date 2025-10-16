import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RotateCcw, Maximize2, Eye, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PreviewPanel({ selectedShirt, designs, isInteractive = false, onDesignsChange }) {
  const containerRef = useRef(null)
  const [draggedDesign, setDraggedDesign] = useState(null)
  const [viewMode, setViewMode] = useState("front")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [shirtRotation, setShirtRotation] = useState(0)

  const getShirtSVG = (view = "front") => {
    const { model, color } = selectedShirt

    let shirtPath = ""
    let neckPath = ""
    let sleevePaths = ""
    let details = ""

    if (view === "front") {
      switch (model) {
        case "classic":
          shirtPath = "M60 30 L140 30 L160 50 L160 200 L40 200 L40 50 Z"
          neckPath = "M80 30 L80 45 Q100 55 120 45 L120 30"
          sleevePaths = "M40 50 L20 70 L25 120 L40 110 Z M160 50 L180 70 L175 120 L160 110 Z"
          details = "M40 50 L160 50 M60 200 L140 200"
          break
        case "fitted":
          shirtPath = "M70 30 L130 30 L145 50 L140 200 L60 200 L55 50 Z"
          neckPath = "M85 30 L85 45 Q100 55 115 45 L115 30"
          sleevePaths = "M55 50 L35 65 L40 110 L55 105 Z M145 50 L165 65 L160 110 L145 105 Z"
          details = "M55 50 L145 50 M70 200 L130 200"
          break
        case "oversized":
          shirtPath = "M50 30 L150 30 L175 50 L175 210 L25 210 L25 50 Z"
          neckPath = "M75 30 L75 45 Q100 55 125 45 L125 30"
          sleevePaths = "M25 50 L5 75 L10 130 L25 120 Z M175 50 L195 75 L190 130 L175 120 Z"
          details = "M25 50 L175 50 M50 210 L150 210"
          break
        default:
          shirtPath = "M60 30 L140 30 L160 50 L160 200 L40 200 L40 50 Z"
          neckPath = "M80 30 L80 45 Q100 55 120 45 L120 30"
          sleevePaths = "M40 50 L20 70 L25 120 L40 110 Z M160 50 L180 70 L175 120 L160 110 Z"
          details = "M40 50 L160 50 M60 200 L140 200"
      }
    } else {
      // Back view - simpler design
      switch (model) {
        case "classic":
          shirtPath = "M60 30 L140 30 L160 50 L160 200 L40 200 L40 50 Z"
          neckPath = "M80 30 Q100 25 120 30"
          sleevePaths = "M40 50 L20 70 L25 120 L40 110 Z M160 50 L180 70 L175 120 L160 110 Z"
          details = "M40 50 L160 50 M60 200 L140 200 M100 30 L100 200"
          break
        case "fitted":
          shirtPath = "M70 30 L130 30 L145 50 L140 200 L60 200 L55 50 Z"
          neckPath = "M85 30 Q100 25 115 30"
          sleevePaths = "M55 50 L35 65 L40 110 L55 105 Z M145 50 L165 65 L160 110 L145 105 Z"
          details = "M55 50 L145 50 M70 200 L130 200 M100 30 L100 200"
          break
        case "oversized":
          shirtPath = "M50 30 L150 30 L175 50 L175 210 L25 210 L25 50 Z"
          neckPath = "M75 30 Q100 25 125 30"
          sleevePaths = "M25 50 L5 75 L10 130 L25 120 Z M175 50 L195 75 L190 130 L175 120 Z"
          details = "M25 50 L175 50 M50 210 L150 210 M100 30 L100 210"
          break
        default:
          shirtPath = "M60 30 L140 30 L160 50 L160 200 L40 200 L40 50 Z"
          neckPath = "M80 30 Q100 25 120 30"
          sleevePaths = "M40 50 L20 70 L25 120 L40 110 Z M160 50 L180 70 L175 120 L160 110 Z"
          details = "M40 50 L160 50 M60 200 L140 200 M100 30 L100 200"
      }
    }

    return (
      <svg viewBox="0 0 200 220" className="w-full h-full">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3" />
          </filter>
          <linearGradient id="shirtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.85 }} />
          </linearGradient>
          <linearGradient id="sleeveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.7 }} />
          </linearGradient>
        </defs>

        {/* Sleeves */}
        <path d={sleevePaths} fill="url(#sleeveGradient)" stroke="#00000020" strokeWidth="1" filter="url(#shadow)" />

        {/* Main shirt body */}
        <path d={shirtPath} fill="url(#shirtGradient)" stroke="#00000020" strokeWidth="1" filter="url(#shadow)" />

        {/* Neck opening */}
        <path d={neckPath} fill="none" stroke="#00000030" strokeWidth="2" />

        {/* Shirt details/seams */}
        <path d={details} fill="none" stroke="#00000015" strokeWidth="1" />

        {/* Fabric texture overlay */}
        <rect x="40" y="50" width="120" height="150" fill="url(#fabricTexture)" opacity="0.1" />

        <defs>
          <pattern id="fabricTexture" patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill="transparent" />
            <circle cx="2" cy="2" r="0.5" fill="#00000005" />
          </pattern>
        </defs>
      </svg>
    )
  }

  const handleDesignDrag = (designId, newX, newY) => {
    if (!isInteractive || !onDesignsChange) return

    // Constrain to shirt area with better boundaries
    const constrainedX = Math.max(15, Math.min(75, newX))
    const constrainedY = Math.max(20, Math.min(80, newY))

    const updatedDesigns = designs.map((design) =>
      design.id === designId ? { ...design, x: constrainedX, y: constrainedY } : design,
    )
    onDesignsChange(updatedDesigns)
  }

  const resetView = () => {
    setShirtRotation(0)
    setViewMode("front")
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const PreviewContent = () => (
    <motion.div
      ref={containerRef}
      className="relative bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-8 min-h-[500px] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* View Controls */}
      <div className="absolute top-4 right-4 flex space-x-2 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode(viewMode === "front" ? "back" : "front")}
          className="bg-white/80 backdrop-blur-sm"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          {viewMode === "front" ? "Ver Atrás" : "Ver Frente"}
        </Button>
        <Button variant="outline" size="sm" onClick={resetView} className="bg-white/80 backdrop-blur-sm">
          <Eye className="w-4 h-4" />
        </Button>
        {!isFullscreen && (
          <Button variant="outline" size="sm" onClick={toggleFullscreen} className="bg-white/80 backdrop-blur-sm">
            <Maximize2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Color indicator */}
      <div className="absolute top-4 left-4 flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 z-40">
        <Palette className="w-4 h-4" />
        <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: selectedShirt.color }} />
        <span className="text-sm font-medium capitalize">
          {selectedShirt.model} • {selectedShirt.size}
        </span>
      </div>

      {/* Shirt Container with 3D effect */}
      <motion.div
        className="relative w-80 h-96 z-10"
        animate={{
          rotateY: shirtRotation,
          scale: viewMode === "back" ? 0.95 : 1,
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        <div className="w-full h-full">{getShirtSVG(viewMode)}</div>

        {/* Design Overlays - only show on front view or if specifically placed on back */}
        <AnimatePresence>
          {viewMode === "front" &&
            designs.map((design) => (
              <motion.div
                key={design.id}
                className={`absolute ${isInteractive ? "cursor-move" : ""} z-20`}
                style={{
                  left: `${design.x}%`,
                  top: `${design.y}%`,
                  width: `${design.width}px`,
                  height: `${design.height}px`,
                  transform: `rotate(${design.rotation}deg)`,
                }}
                drag={isInteractive}
                dragMomentum={false}
                dragConstraints={containerRef}
                onDragStart={() => setDraggedDesign(design.id)}
                onDragEnd={() => setDraggedDesign(null)}
                onDrag={(event, info) => {
                  if (!containerRef.current) return
                  const rect = containerRef.current.getBoundingClientRect()
                  const newX = ((info.point.x - rect.left - 64) / (rect.width - 128)) * 100
                  const newY = ((info.point.y - rect.top - 64) / (rect.height - 128)) * 100
                  handleDesignDrag(design.id, newX, newY)
                }}
                whileHover={isInteractive ? { scale: 1.05 } : {}}
                whileDrag={{ scale: 1.1, zIndex: 30 }}
                animate={{
                  scale: draggedDesign === design.id ? 1.1 : 1,
                  zIndex: draggedDesign === design.id ? 30 : 20,
                }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={design.image || "/placeholder.svg"}
                  alt="Design"
                  className="w-full h-full object-contain drop-shadow-lg"
                  draggable={false}
                  style={{
                    filter:
                      draggedDesign === design.id ? "brightness(1.1) drop-shadow(0 0 10px rgba(0,0,0,0.3))" : "none",
                  }}
                />

                {/* Interactive indicators */}
                {isInteractive && (
                  <>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-sm" />
                    <div className="absolute inset-0 border-2 border-primary/30 rounded opacity-0 hover:opacity-100 transition-opacity" />
                  </>
                )}
              </motion.div>
            ))}
        </AnimatePresence>

        {/* Design Area Indicator */}
        {isInteractive && designs.length === 0 && viewMode === "front" && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <motion.div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white/50"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p className="text-gray-500 text-sm">Arrastra diseños aquí</p>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Lighting and depth effects */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 rounded-lg pointer-events-none" />
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-8 bg-black/10 rounded-full blur-sm" />

      {/* Ambient lighting */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-200/10 rounded-full blur-2xl" />
    </motion.div>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Preview en Tiempo Real</h2>
        <div className="text-sm text-muted-foreground">Vista: {viewMode === "front" ? "Frente" : "Atrás"}</div>
      </div>

      {/* Main Preview */}
      {!isFullscreen ? (
        <PreviewContent />
      ) : (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative w-full h-full max-w-4xl max-h-4xl p-8">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-50 bg-white"
            >
              ✕
            </Button>
            <PreviewContent />
          </div>
        </motion.div>
      )}

      {/* Design Info and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-card p-3 rounded-lg border">
          <div className="font-medium text-foreground">Diseños</div>
          <div className="text-muted-foreground">
            {designs.length} elemento{designs.length !== 1 ? "s" : ""} aplicado{designs.length !== 1 ? "s" : ""}
          </div>
        </div>
        <div className="bg-card p-3 rounded-lg border">
          <div className="font-medium text-foreground">Vista</div>
          <div className="text-muted-foreground">
            {viewMode === "front" ? "Frente" : "Atrás"} • {isInteractive ? "Interactivo" : "Solo vista"}
          </div>
        </div>
        <div className="bg-card p-3 rounded-lg border">
          <div className="font-medium text-foreground">Producto</div>
          <div className="text-muted-foreground">
            {selectedShirt.model} • Talla {selectedShirt.size}
          </div>
        </div>
      </div>

      {/* Interactive Tips */}
      {isInteractive && designs.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-sm text-blue-800">
            <strong>💡 Tips:</strong> Arrastra los diseños para reposicionarlos • Cambia entre vista frontal y trasera •
            Usa pantalla completa para mejor detalle
          </div>
        </div>
      )}
    </div>
  )
}