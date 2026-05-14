# Plan de Pruebas: Tienda Virtual DSS

## 1. Introducción
Este documento define la estrategia de pruebas para la Tienda Virtual Demo, enfocándose en la automatización con Cypress para garantizar la funcionalidad y la seguridad básica.

## 2. Objetivos
- Validar el flujo de usuario de extremo a extremo (E2E).
- Automatizar pruebas de seguridad críticas para identificar vulnerabilidades comunes.
- Asegurar la estabilidad de las integraciones entre el frontend y el backend.

## 3. Alcance de las Pruebas
- **Plataforma:** Web.
- **Herramienta:** Cypress 13+.
- **Ambiente:** Local / Docker.

## 4. Casos de Prueba Funcionales
### CP01: Navegación y Carga de Productos
- **Descripción:** Verificar que la aplicación cargue y muestre el catálogo de productos universitarios.
- **Resultado Esperado:** Al menos 4 productos visibles con nombre y precio.

### CP02: Gestión del Carrito
- **Descripción:** Agregar múltiples productos al carrito y verificar el cálculo del total.
- **Resultado Esperado:** El total debe ser la suma exacta de los productos multiplicada por su cantidad.

### CP03: Flujo de Compra (Checkout)
- **Descripción:** Completar una compra simulada.
- **Resultado Esperado:** Mostrar un mensaje de éxito con el ID de la orden.

## 5. Pruebas de Seguridad Automatizadas (Seleccionadas)
Estas pruebas se implementarán en `cypress/e2e/security.cy.js`.

### SEC01: Verificación de Cabeceras de Seguridad (HTTP Security Headers)
- **Objetivo:** Asegurar que el backend utilice `helmet` para proteger contra ataques comunes (XSS, Clickjacking, etc.).
- **Verificación:** Comprobar la presencia de cabeceras como `X-Content-Type-Options`, `X-Frame-Options` y `Content-Security-Policy`.

### SEC02: Validación de Integridad en Checkout
- **Objetivo:** Verificar que el sistema maneje correctamente entradas inesperadas o maliciosas en el proceso de compra.
- **Verificación:** Enviar caracteres especiales y scripts (simulados) en el nombre del cliente y asegurar que la orden se procese de forma segura o falle con un error controlado sin exponer trazas.

### SEC03: Control de Exposición de Información
- **Objetivo:** Minimizar la información técnica expuesta por la API.
- **Verificación:** 
  1. Validar que los errores 404 devuelvan un JSON estructurado sin revelar detalles del servidor o rutas internas.
  2. Consultar el endpoint de entrenamiento de seguridad `/api/seg` para confirmar que los hallazgos conocidos están documentados.

## 6. Ejecución
Las pruebas se ejecutarán mediante:
```bash
npm run e2e
```
o abriendo el Cypress Runner:
```bash
npx cypress open
```
