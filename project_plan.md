# Invitación Digital Premium - 15 Años

## 1. Project Description
Invitación digital premium para eventos (quinceañeras, bodas, aniversarios) que funciona como:
- Invitación digital interactiva con diseño elegante
- Sistema de confirmación de asistencia (RSVP)
- Panel de administración para gestionar invitados

La plantilla es completamente reutilizable cambiando solo un archivo de configuración.

## 2. Page Structure
- `/` - Página principal de la invitación (single page con secciones)
- `/admin` - Panel de administración protegido con contraseña

## 3. Core Features
- [x] Archivo de configuración centralizado para reutilización
- [x] Hero section con foto, nombre y cuenta regresiva
- [x] Sección de información del evento
- [x] Mapa de ubicación con Google Maps
- [x] Sección de regalos con alias bancario
- [x] Galería de fotos con carrusel y lightbox
- [x] Cronograma del evento
- [x] Formulario RSVP completo con validaciones
- [x] Botón flotante de WhatsApp
- [x] Personalización por parámetro URL (?guest=Familia+Perez)
- [x] Panel admin con estadísticas, filtros y tabla
- [ ] Diseño responsive mobile-first
- [ ] Animaciones suaves

## 4. Data Model Design
No se requiere base de datos en esta fase. El formulario RSVP usará el sistema de formularios de Readdy.

## 5. Backend / Third-party Integration Plan
- Formularios de Readdy: Para el envío del RSVP
- Google Maps: Iframe embebido para ubicación
- Sin Supabase/Shopify/Stripe en esta fase

## 6. Development Phase Plan

### Phase 1: Estructura base + Config + Hero + Info del evento
- Goal: Crear archivo de configuración, hero section con countdown, y sección de info del evento
- Deliverable: Página principal con hero funcional e información del evento visible

### Phase 2: Ubicación + Regalos + Galería + Cronograma
- Goal: Completar secciones informativas y visuales
- Deliverable: Mapa, sección de regalos, galería con lightbox, y timeline
- Status: COMPLETED ✅

### Phase 3: RSVP + WhatsApp + Personalización URL
- Goal: Implementar formulario completo y features interactivas
- Deliverable: Formulario RSVP funcional, botón WhatsApp, y personalización por URL
- Status: COMPLETED ✅

### Phase 4: Panel de Administración
- Goal: Panel protegido con estadísticas y gestión de invitados
- Deliverable: Panel admin con stats, filtros y tabla
- Status: COMPLETED ✅