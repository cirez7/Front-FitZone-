# FitZone Sports — Informe General de Testing & Lista de Hallazgos (to_fix.md)

> **Fecha de auditoría:** Octubre 2026  
> **Alcance:** Proyecto completo (Módulos 1 a 5, Roles: Socio Activo, Socio Vencido, Cliente Externo, Recepción, Gerente Central, Flujos de Pago AFIP, Control de Aforo y Gestión de Turnos).  
> **Objetivo:** Registro exhaustivo de todos los errores encontrados, fallas funcionales, discrepancias con Figma, problemas de interfaz/UX y oportunidades de mejora (QOL) sin modificar código productivo.

---

## 1. Resumen Ejecutivo de la Auditoría

Se realizó una revisión integral del código fuente, arquitectura de componentes, contexto global (`AppContext.jsx`), hojas de estilo, responsive design y comparación con los 28 diseños exportados de Figma (`temp_figma/` y `screens_summary.json`).

El proyecto compila exitosamente bajo Vite y React 18, pero presenta varios **bugs funcionales de nivel medio y alto**, **estados huérfanos**, **hardcoding de datos que impide la reactividad adecuada**, **fallas en vistas móviles** (como la barra inferior tapando botones de acción y menú de hamburguesa inoperante) y **desconexiones en los flujos entre pantallas** (por ejemplo, reintento de pago rechazado).

---

## 2. Errores Críticos y Funcionales (Bugs)

### 🔴 BUG-01: El botón de menú móvil (Hamburguesa) no despliega ningún menú
- **Ubicación:** `src/components/layout/Navbar.jsx` (Líneas 176–181) y `src/App.jsx`.
- **Descripción:** Al hacer clic en el botón de hamburguesa en pantallas móviles/tablets (`< 1024px`), el estado `isMobileMenuOpen` cambia a `true` y el icono alterna de `Menu` a `X`, pero **ningún drawer, sidebar móvil o menú modal es renderizado**. El botón no realiza ninguna acción visible más allá de cambiar su icono.
- **Impacto:** En dispositivos móviles, los usuarios no pueden acceder al menú lateral ni a sus enlaces.

---

### 🔴 BUG-02: Se permite reservar clases grupales con estado "CANCELADA"
- **Ubicación:** `src/pages/socio/SocioClassDetailPage.jsx` (Líneas 167–182).
- **Descripción:** Cuando se abre el detalle de una clase cancelada por la administración (por ejemplo, *Yoga* `cls-3`, cuyo cupo es 0/14), el cálculo `freeSpots` da 14 lugares libres. La condición en el renderizado verifica `freeSpots <= 0` para enviar a lista de espera, y en caso contrario muestra el botón verde **"Confirmar Reserva de Clase"**.
- **Impacto:** Los socios pueden confirmar reservas en clases canceladas por licencia médica del instructor, generando una reserva inválida en el sistema.

---

### 🔴 BUG-03: Reintentar un pago rechazado desde el historial redirige a un cobro genérico erróneo
- **Ubicación:** `src/pages/socio/SocioHistoryPage.jsx` (Línea 158) y `src/pages/checkout/CheckoutPage.jsx` (Líneas 21–25).
- **Descripción:** En la tabla de historial de pagos, al hacer clic en "Reintentar pago" en la transacción rechazada (`FZ-P84102`, reserva de cancha por $8.000), se navega a `checkout` pasando `{ payment: p }`. Sin embargo, `CheckoutPage` solo verifica `routeParams?.booking` y `routeParams?.concept`, ignorando `routeParams?.payment`.
- **Impacto:** La pantalla de checkout cae en el fallback por defecto y le cobra al usuario **$15.000 de Membresía mensual** en lugar de reintentar la reserva de cancha rechazada por $8.000.

---

### 🔴 BUG-04: La reserva pagada no actualiza la disponibilidad del turno en la grilla de canchas
- **Ubicación:** `src/context/AppContext.jsx` (`processPayment`, Líneas 702–750) y `src/pages/socio/SocioCourtsGridPage.jsx`.
- **Descripción:** Al completarse exitosamente el pago de una cancha en `processPayment`, la reserva en `courtBookings` pasa a `CONFIRMADA`. Sin embargo, el slot correspondiente dentro del array global `courts` permanece con estado `'DISPONIBLE'`.
- **Impacto:** Si el usuario regresa a la grilla de canchas, el turno que acaba de reservar y pagar sigue mostrándose como disponible y seleccionable para una nueva reserva (sobreventa de turnos).

---

### 🔴 BUG-05: Estado de turno desincronizado al cambiar de deporte en la grilla
- **Ubicación:** `src/pages/socio/SocioCourtsGridPage.jsx` (Líneas 21–27 y 32).
- **Descripción:** El estado `selectedSlot` se inicializa con el slot `'s-19'` de Paddle Cancha 1 a $10.200 / $12.000. Si el usuario hace clic en otro deporte (por ejemplo, "Fútbol 5", tarifa base $16.000), el estado `selectedSlot` retiene el id y precio de la cancha de Paddle anterior hasta que se seleccione manualmente un slot nuevo.
- **Impacto:** El panel inferior "TU SELECCIÓN" muestra una mezcla incoherente (ejemplo: Fútbol 5 pero con el horario y precio de Paddle).

---

### 🔴 BUG-06: Múltiples canchas del mismo deporte son inaccesibles en la grilla de socios
- **Ubicación:** `src/pages/socio/SocioCourtsGridPage.jsx` (Línea 32).
- **Descripción:** La vista obtiene la cancha activa mediante:  
  `const currentCourt = courts.find(c => c.sport === selectedSport) || courts[0];`  
  Dado que existen dos canchas de Paddle (*Paddle · Cancha 1* y *Paddle · Cancha 2*), esta función siempre devuelve Cancha 1.
- **Impacto:** El socio nunca puede ver los horarios ni el estado de mantenimiento de Cancha 2, ni seleccionar entre distintas pistas del mismo deporte.

---

### 🔴 BUG-07: El registro de cobro en efectivo en recepción siempre asigna el pago a Martín García
- **Ubicación:** `src/pages/recepcion/RecepcionCashRegisterPage.jsx` (Líneas 19–25 y 90–115).
- **Descripción:** El estado `selectedUser` está hardcodeado con los datos de Martín García. Si la recepcionista escribe el nombre o DNI de otra persona en el campo de búsqueda `searchQuery`, no hay ningún mecanismo de filtrado ni selección que actualice `selectedUser`.
- **Impacto:** Cualquier cobro registrado en efectivo se emite y asocia invariablemente a Martín García.

---

### 🔴 BUG-08: El bloqueo por mantenimiento en recepción no permite corregir fechas manualmente
- **Ubicación:** `src/pages/recepcion/RecepcionCourtsManagementPage.jsx` (Líneas 40–45 y 316–364).
- **Descripción:** Al abrir el modal de mantenimiento, `hasOverlapError` se establece forzosamente en `true` para simular la protección contra reservas. Sin embargo, no existe lógica de validación que detecte si las fechas ingresadas manualmente en los campos de texto son válidas o libres; el botón "Guardar mantenimiento" permanece deshabilitado a menos que se haga clic en el botón de autocorrección automática.
- **Impacto:** No es posible programar un mantenimiento personalizado escribiendo los horarios deseados.

---

### 🔴 BUG-09: El aforo de recepción solo suma a "Palermo" y no admite egresos
- **Ubicación:** `src/context/AppContext.jsx` (`logAccessScan`, Líneas 792–815).
- **Descripción:** Cuando se registra un escaneo permitido, la función actualiza el aforo únicamente si `s.name.includes('Palermo')`, independientemente de qué sede esté seleccionada en el sistema. Además, no existe en la interfaz una acción para registrar salidas ("Egreso"), por lo que el aforo solo puede incrementarse hasta saturarse.
- **Impacto:** Los datos de aforo en otras sedes nunca cambian, y el aforo no refleja la ocupación real a lo largo de la jornada.

---

## 3. Discrepancias con Requerimientos y Diseños de Figma

### 📐 FIG-01: Grilla de turnos de canchas difiere del diseño original de Figma
- **En Figma (`grilla_canchas_socio.html` y `grilla_canchas_externo.html`):** Los turnos se presentan como una lista vertical de franjas horarias con tarjeta ancha (Horario, Tipo de Tarifa, Badge de Estado, Precio Calculado grande y botón interactivo "Elegir turno" / "Seleccionado" / "No disponible"). A la derecha se ubica un panel fijo "TU SELECCIÓN".
- **En la implementación:** Se presenta como una matriz de cuadrícula de 6 columnas horizontales compactas con botones inferiores condensados, perdiendo legibilidad en pantallas intermedias.

### 📐 FIG-02: Posición en lista de espera hardcodeada
- **En Figma (`socio_lista_espera.html`):** La tarjeta de lista de espera muestra la posición calculada dinámicamente, cantidad de personas por delante y fecha exacta de suscripción a la espera.
- **En la implementación (`SocioWaitlistPage.jsx`):** La posición `#3`, el texto "2 personas antes que vos" y la fecha "28 Sep · 09:30" son strings fijos en el JSX. Si un usuario se suma a la lista de espera de otra clase, siempre ve que está en la posición `#3`.

### 📐 FIG-03: Las franjas horarias no varían según el día seleccionado
- **En Figma:** Seleccionar fechas distintas (Viernes 2 Oct, Sábado 3 Oct, etc.) refleja diferentes niveles de ocupación de las pistas.
- **En la implementación:** Al cambiar de pestaña de día en la grilla, únicamente cambia el string de la fecha en el encabezado; los turnos y sus estados ocupado/disponible son exactamente los mismos para todos los días.

### 📐 FIG-04: Al crear una cancha en recepción se omiten franjas horarias estándar
- **En Figma (`recepcion_canchas.html`):** Las canchas operan con 6 franjas diarias (16:00 a 22:00 hs).
- **En la implementación (`AppContext.jsx`, línea 840):** La función `addCourt` solo crea 3 franjas fijas (`16:00–17:00`, `17:00–18:00` y `19:00–20:00`), dejando fuera los horarios de 18:00, 20:00 y 21:00.

### 📐 FIG-05: Falta de vistas de reportes y parámetros en el rol Gerente Central
- **En Figma (`gerente_dashboard.html`):** El sidebar tiene accesos a "Membresías e Ingresos", "Reportes ejecutivos" y "Parámetros del sistema".
- **En la implementación (`Sidebar.jsx` y `App.jsx`):** Todos estos enlaces redirigen a `gerente-dashboard`. No existen vistas secundarias para visualizar el desglose detallado de membresías ni la configuración de parámetros.

---

## 4. Problemas de UX, UI y Responsividad (Mobile vs. Desktop)

### 📱 RESP-01: Elementos inferiores tapados por la barra `BottomNav` en dispositivos móviles
- **Ubicación:** `src/App.jsx` (Línea 183) y `src/components/layout/BottomNav.jsx`.
- **Descripción:** `BottomNav` es una barra fija (`fixed bottom-0 z-40`). El contenedor principal `<main>` tiene la clase `p-4 sm:p-6 lg:p-8`, pero **carece de `pb-20` o `pb-24` en resoluciones móviles**.
- **Impacto:** Botones primarios ubicados al fondo de las páginas (como "Continuar con este turno" en grilla de canchas, "Confirmar pago", "Guardar asistencia" o el botón de salir de lista de espera) quedan ocultos o superpuestos debajo de la barra de navegación móvil.

### 📱 RESP-02: Saturación de barras fijas superiores en pantallas pequeñas
- **Ubicación:** `src/components/layout/RoleSwitcher.jsx` y `src/components/layout/Navbar.jsx`.
- **Descripción:** En móviles de ancho reducido (< 400px), la barra superior de `RoleSwitcher` se divide en 3 o 4 líneas de altura debido a los múltiples botones de roles, el select de sedes y el desplegable de Figma. Sumado a la `Navbar` sticky y la `BottomNav` fija, el área visible efectiva para el contenido se reduce drásticamente.

### 📱 RESP-03: Impresión de comprobante (Voucher / Factura AFIP) imprime toda la web
- **Ubicación:** `src/pages/checkout/VoucherPage.jsx` y `src/index.css`.
- **Descripción:** El botón "Descargar PDF" ejecuta `window.print()`. Sin embargo, `Navbar`, `Sidebar`, `RoleSwitcher` y `BottomNav` no tienen clases `print:hidden`, ni existen directivas `@media print` en `index.css`.
- **Impacto:** Al imprimir o guardar como PDF, el comprobante fiscal sale contaminado con todas las barras de navegación, menús y botones de la aplicación.

### 📱 RESP-04: Indicador de aforo estático en el Sidebar
- **Ubicación:** `src/components/layout/Sidebar.jsx` (Línea 55).
- **Descripción:** El ítem "Control de Aforo" tiene un badge fijo que dice `86%`. Si el usuario cambia de sede a una con 45% o 92%, el badge del menú lateral sigue mostrando `86%`.

---

## 5. Inconsistencias de Datos y Estado Global

### 💾 DATA-01: El catálogo de canchas y clases no responde a la sede seleccionada
- **Descripción:** Aunque el usuario cambie la sede activa a "Sede Belgrano", "Sede Córdoba" o "Sede Rosario", la grilla de canchas y la agenda de clases siguen mostrando únicamente las canchas y clases de "Sede Palermo". Las demás sedes carecen de catálogo propio.

### 💾 DATA-02: Falta de persistencia en recarga de página (F5)
- **Descripción:** Todo el estado del sistema (`sedes`, `classes`, `courts`, `courtBookings`, `payments`, `accessLogs`) vive exclusivamente en memoria en `useState` dentro de `AppContext.jsx`. Una recarga de página reinicia todas las reservas, cobros y modificaciones realizadas durante la sesión de testing.

### 💾 DATA-03: Fechas estáticas y desfasadas
- **Descripción:** Existen fechas hardcodeadas mixtas a lo largo de las vistas (ej. "Jueves 1 de octubre de 2026", "Lunes 28 de septiembre de 2026", "Viernes 2 de octubre de 2026"). Esto produce que en la misma vista convivan clases marcadas como "Hoy" en días de la semana diferentes.

### 💾 DATA-04: Cierre de sesión no reinicia el estado de usuario
- **Descripción:** Al pulsar "Cerrar sesión" en el menú o barra lateral, únicamente se ejecuta `navigate('login')`. No se limpian los datos de sesión, por lo que volver a ingresar puede mantener estados modificados del rol anterior.

---

## 6. Oportunidades de Calidad de Vida (QOL) & Accesibilidad

1. **Accesibilidad en Formularios e Inputs:**
   - Varios inputs carecen de atributos `id` vinculados a sus etiquetas mediante `htmlFor`, dificultando la navegación por lectores de pantalla.
   - Botones basados únicamente en iconos (como el cierre de modales y la hamburguesa móvil) carecen de `aria-label`.

2. **Feedback al Guardar Asistencia:**
   - En la pantalla de toma de asistencia de recepción, el botón "Guardar asistencia" emite un toast pero no bloquea la edición ni marca la clase como auditada/asistida.

3. **Filtro de Socios en Recepción:**
   - En la pantalla de cobro en efectivo (`RecepcionCashRegisterPage`), la búsqueda por DNI o nombre debería autocompletar o listar socios encontrados en una lista desplegable en lugar de estar fija.

4. **Confirmación Visual al Cancelar Reserva:**
   - En "Mis Reservas" (`SocioMyReservationsPage`), pulsar "Cancelar" cancela inmediatamente la reserva con un toast. Sería conveniente un modal o diálogo de confirmación para evitar cancelaciones accidentales.

5. **Modo Oscuro / Contraste:**
   - La paleta principal posee excelentes contrastes en la mayoría de sus tarjetas, pero textos auxiliares con clase `text-slate-400` y tamaño `text-[10px]` pueden resultar difíciles de leer para personas con visión reducida.

---

## 7. Matriz de Prioridad de Corrección

| ID | Módulo | Severidad | Descripción Resumida |
|---|---|---|---|
| **BUG-01** | Layout / Mobile | **Alta** | Menú hamburguesa no abre drawer en móviles |
| **BUG-02** | Clases Grupales | **Alta** | Permite reservar clases en estado CANCELADA |
| **BUG-03** | Facturación / Checkout | **Alta** | Reintentar pago rechazado cobra membresía en vez del turno |
| **BUG-04** | Canchas / Reservas | **Alta** | Pago confirmado no pasa el slot de la cancha a OCUPADO |
| **BUG-05** | Canchas / Grilla | **Alta** | Cambio de deporte no limpia ni recalcula `selectedSlot` |
| **BUG-06** | Canchas / Grilla | **Media** | Cancha 2 de Paddle inaccesible en la grilla |
| **BUG-07** | Recepción / Caja | **Media** | Búsqueda de socio en cobro en efectivo no actualiza usuario |
| **BUG-08** | Recepción / Canchas | **Media** | Modal de mantenimiento no recalcula error al tipear fecha libre |
| **BUG-09** | Recepción / Aforo | **Media** | Aforo solo computa ingresos para Palermo y no admite egresos |
| **RESP-01** | Mobile / UX | **Alta** | `BottomNav` tapa botones de acción finales por falta de padding |
| **RESP-03** | Facturación / Imprimir | **Media** | Impresión de comprobante imprime navbars y menús |
| **FIG-02** | Clases / Espera | **Baja** | Posición `#3` en lista de espera hardcodeada |
| **DATA-01** | Catálogos / Sedes | **Media** | Canchas y clases no varían según la sede activa |
