---
name: Smart Parking 3D
description: Sistema de control inteligente para estacionamiento con monitoreo en tiempo real
colors:
  primary: "#06b6d4"
  forest: "#015249"
  forest-muted: "#4a6b65"
  lime-soft: "#84cc16"
  coral-soft: "#fb7185"
typography:
  body:
    fontFamily: "Inter, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "10px"
    fontWeight: 500
    letterSpacing: "0.05em"
    textTransform: "uppercase"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  card:
    backgroundColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "16px 20px"
    border: "1px solid #e5e7eb"
  button-primary:
    backgroundColor: "{colors.lime-soft}"
    textColor: "{colors.forest}"
    rounded: "{rounded.md}"
    padding: "6px 16px"
    fontSize: "11px"
    fontWeight: 600
  sidebar-item:
    padding: "10px 16px"
    rounded: "{rounded.md}"
    fontSize: "13px"
    fontWeight: 500
---

# Design System: Smart Parking 3D

## 1. Overview

**Creative North Star: "La Central de Control"**

Un dashboard de monitoreo inteligente donde el operador tiene visión completa del estacionamiento desde una sola pantalla. El diseño prioriza la claridad sobre la decoración, usando colores pastel suaves que reducen la fatiga visual durante jornadas prolongadas. Cada elemento refleja su contraparte física: los semáforos en el croquis, las lámparas en el mapa de iluminación, los cajones de estacionamiento.

La interfaz rechaza deliberadamente la estética de dashboard industrial tradicional (grises oscuros, tablas densas, paneles recargados) en favor de un enfoque más limpio y amigable, con espacios amplios y una paleta calmada.

**Key Characteristics:**
- Fondos blancos con tarjetas sutilmente delineadas
- Paleta pastel con acento cian y verde lima
- Tipografía limpia y compacta (etiquetas en uppercase tracking)
- Croquis SVG interactivos que reemplazan tablas de datos
- Controles modales minimalistas con botones compactos

## 2. Colors

Una paleta pastel con acento cian y verde lima, diseñada para transmitir tecnología limpia y control amigable.

### Primary
- **Cyan Accent** (#06b6d4): Acciones seleccionadas, bordes de elementos activos, iconos de cámara y sensores. Representa el carácter tecnológico del sistema.

### Secondary
- **Forest** (#015249): Títulos, texto principal de alto impacto, etiquetas de sección. El verde oscuro aporta seriedad sin caer en el negro corporativo.
- **Forest Muted** (#4a6b65): Texto secundario, metadatos, descripciones. Un escalón más claro que forest para jerarquía visual.

### Tertiary
- **Lime Soft** (#84cc16): Estados activos (disponible, encendido, conectado). Botones de acción afirmativa. Representa lo que funciona correctamente.
- **Coral Soft** (#fb7185): Estados de alerta (ocupado, apagado, emergencia). Botones de acción destructiva. La advertencia es suave, no agresiva.

### Neutral
- **White** (#ffffff): Fondos de tarjetas, contenedores principales.
- **Gray-50** (#f9fafb): Fondos alternados, áreas de datos.
- **Gray-100** (#f3f4f6): Barras de progreso vacías, fondos secundarios.
- **Gray-200** (#e5e7eb): Bordes de tarjetas y contenedores.
- **Gray-400** (#9ca3af): Texto placeholder, iconos secundarios.
- **Gray-500** (#6b7280): Texto de metadatos, etiquetas de baja jerarquía.

### Named Rules
**The One Accent Rule.** El acento cian se usa en ≤10% de la superficie. Su rareza es lo que lo hace detectable. El verde lima y coral tienen roles semánticos fijos (bien/mal) y no compiten con el cian.

## 3. Typography

**Body Font:** Inter (con Segoe UI, system-ui, -apple-system, sans-serif como fallback)

**Character:** Limpia, moderna, eficiente. Inter aporta legibilidad técnica sin ser fría. Las etiquetas en uppercase con tracking amplio recuerdan a paneles de control profesionales.

### Hierarchy
- **Title** (Inter 600, 14-16px, 1.2): Nombres de secciones, encabezados de tarjetas.
- **Body** (Inter 400, 12-13px, 1.5): Texto de contenido, descripciones, valores.
- **Label** (Inter 500, 10px, 1.3, 0.05em tracking, uppercase): Títulos de secciones en panel, etiquetas de formulario, metadatos.
- **Display** (Inter 700, 24-28px, 1.1): Valores grandes de métricas (porcentajes, conteos).

### Named Rules
**The Compact Label Rule.** Todas las etiquetas de sección usan `text-[10px] uppercase tracking-wide`. Esto crea una jerarquía consistente sin depender del peso tipográfico.

## 4. Elevation

El sistema usa una elevación mínima y deliberada. Las tarjetas se diferencian del fondo por bordes (#e5e7eb) en lugar de sombras, manteniendo la interfaz plana y limpia. Las sombras aparecen solo en estados interactivos (hover en croquis, hover en botones).

- **Card border**: 1px solid #e5e7eb (rounded-xl)
- **Hover state**: shadow-md sutil en tarjetas hover

### Named Rules
**The Flat-By-Default Rule.** Las superficies son planas en reposo. Las sombras aparecen solo como respuesta a interacción (hover, selección). No hay sombras decorativas.

## 5. Components

### Cards
- **Corner Style:** Muy redondeados (12px / rounded-xl)
- **Background:** Blanco (#ffffff)
- **Border:** 1px solid #e5e7eb
- **Padding:** 16-20px (p-4/p-5)
- **Shadow Strategy:** Sin sombra en reposo; shadow-md en hover

### Buttons
- **Shape:** Redondeados (6px / rounded-md)
- **Size:** Compactos (py-1.5, 11px font)
- **Primary (affirmative):** bg-lime-soft/15 + border-lime-soft/40 + text-forest
- **Primary (danger):** bg-coral-soft/10 + border-coral-soft/40 + text-forest
- **Mode selector:** Flex row con border-200, overflow-hidden, active state tintado
- **Emergency:** bg-coral-soft/10 + border-coral-soft/30 + animate-pulse

### Navigation (Sidebar)
- **Style:** Vertical stack, icon + label
- **Active state:** bg-cyan-accent/10 + text-cyan-accent + border-l-2
- **Hover state:** bg-gray-50 transición suave

### Mode Selector (segmented control)
- **Container:** border + rounded-lg + overflow-hidden
- **Items:** flex-1, border-r separator, py-1.5
- **Active:** bg-cyan-accent/10 o bg-lime-soft/15 según el modo

### Range Sliders
- **Track:** h-1.5, bg-gray-100, rounded-full
- **Thumb:** w-3.5, bg-lime-soft o bg-cyan-accent, rounded-full, con glow sutil
- **Style:** appearance-none, accent-color personalizado via Tailwind

## 6. Do's and Don'ts

### Do:
- **Do** usar la paleta pastel con fondos blancos para mantener la interfaz limpia y legible.
- **Do** usar text-[10px] uppercase tracking-wide para etiquetas de sección en paneles laterales.
- **Do** mantener tarjetas con border en lugar de sombras para el estado reposo.
- **Do** usar croquis SVG interactivos para representar elementos físicos (semáforos, lámparas, cajones).
- **Do** usar espacios amplios (gap-4, gap-6) entre secciones para evitar saturación visual.

### Don't:
- **Don't** usar #000 o #fff puro. Los blancos son naturales (#ffffff está bien para fondos); los negros se evitan en favor de forest (#015249) o grises.
- **Don't** usar sombras decorativas en elementos en reposo. Solo en hover/interacción.
- **Don't** usar tablas densas para mostrar datos que pueden representarse visualmente (mapas, croquis).
- **Don't** usar barras laterales de color (border-left/border-right > 1px) como acento decorativo.
- **Don't** usar dashboards empresariales genéricos (grises, tablas densas, sin personalidad) como referencia de diseño.
