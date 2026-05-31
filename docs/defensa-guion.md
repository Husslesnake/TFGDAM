# Guion de defensa — Stockly

**Trabajo Fin de Ciclo · DAM · CDM Formación Alcorcón · Curso 2025/2026**
**Autores:** Adrián Bravo Santos y Miguel Ángel Florido · **Tutor:** Damián Sualdea Soy
**Duración objetivo:** 10 minutos (≈ 1.300 palabras) + 2-3 min de demo en vivo
**Slides asociadas:** `defensa-stockly.pptx` (15 diapositivas)

> Convenciones del guion:
> - **(N)** marca el cambio de diapositiva.
> - *Cursiva* = nota escénica (qué mostrar, dónde apuntar).
> - Ritmo: ~140 palabras/min. No leer literal: usar como guion de seguridad.

---

## (1) Portada — 20 s

Buenos días. Somos Adrián Bravo y Miguel Ángel Florido, y venimos a defender nuestro Trabajo Fin de Ciclo: **Stockly**, un sistema de gestión de inventario y reservas para almacén. El proyecto se ha desarrollado durante el curso 2025/2026 bajo la tutoría de Damián Sualdea.

---

## (2) El problema — 50 s

En muchas pymes —tiendas pequeñas, talleres, almacenes de distribución— el inventario sigue gestionándose con hojas de cálculo compartidas o anotaciones en papel. Esto crea tres problemas reales: **ventas duplicadas** cuando dos empleados venden lo mismo a la vez, **reservas que se pierden** porque no hay un control centralizado, y **movimientos de stock sin trazabilidad**, es decir, nadie sabe quién tocó qué ni cuándo.

Queríamos resolver estos tres problemas con un sistema **ligero pero serio**: que no exija infraestructura compleja, pero que sí ofrezca control de concurrencia real, autenticación por roles y auditoría.

---

## (3) La solución — 40 s

Stockly se compone de **tres piezas** que comparten una misma API REST:

1. Una **aplicación web instalable como PWA**, para clientes y administradores.
2. Una **app Android nativa** en Kotlin, pensada específicamente para el operario de almacén.
3. Un **backend Node.js + Express** con base de datos MySQL, que es el cerebro del sistema.

Todo está desplegado en producción y accesible públicamente en Railway, con HTTPS automático.

---

## (4) Objetivos — 40 s

El objetivo general era construir una aplicación web —con extensión móvil— para gestionar inventario y reservas con autenticación por roles, control de concurrencia y trazabilidad, desplegada en cloud.

De los objetivos específicos destacamos cuatro: modelar un esquema relacional normalizado, garantizar que dos reservas paralelas nunca puedan superar el stock disponible, implementar un frontend instalable como PWA, y desarrollar una app Android nativa para el operario.

Todos se han cumplido y los iremos viendo en las próximas diapositivas.

---

## (5) Stack tecnológico — 35 s

En el backend, Node.js 24 con Express, MySQL 8, JWT con bcrypt para la autenticación y Vitest para los tests. En el frontend, JavaScript vanilla —sin framework— con Service Worker para el modo PWA. Para la app móvil, Kotlin con Jetpack Compose, Retrofit para la red y EncryptedSharedPreferences para guardar el token de forma segura. Y en infraestructura, Railway como plataforma cloud, con deploy continuo desde GitHub.

La decisión de **no usar framework en el frontend** fue deliberada: el dominio es pequeño y queríamos mantener el control total del bundle.

---

## (6) Arquitectura — 50 s

*Apuntar al diagrama.*

La PWA y la app Android consumen exactamente la **misma API REST sobre HTTPS**, autenticándose con un JWT en la cabecera `Authorization`. El backend Express es **stateless** —la sesión vive en el JWT, no en memoria— lo que significa que cualquier instancia puede atender cualquier petición. El estado real vive en MySQL.

Esto nos da dos ventajas: **escalabilidad horizontal** si algún día hiciera falta, y un **único punto de verdad** para las reglas de negocio: si un cliente intenta saltarse la validación desde el navegador, el backend la aplica igual.

---

## (7) Modelo de datos — 35 s

Cinco tablas: **usuarios, categorías, productos, reservas y movimientos**. Las claves foráneas tienen política `ON DELETE` explícita; los estados de reserva son `ENUM` para forzar integridad a nivel de motor, no a nivel de aplicación. Y los campos críticos están indexados: SKU de producto, email de usuario, estado de reserva. Cualquier modificación de stock genera automáticamente un registro en la tabla `movimientos` — esa es la base de la trazabilidad.

---

## (8) Decisión clave 1 — Autorización por roles — 45 s

Manejamos tres roles: **cliente, operario y administrador**. La autorización vive en **dos capas**: el frontend oculta los botones que el usuario no debería ver, pero la barrera real está en el backend. Cada ruta declara explícitamente qué rol necesita mediante un middleware `requireRole`.

*Apuntar al snippet.*

Este patrón nos permite que **añadir una ruta protegida sea una línea**: declaras qué rol la puede usar y ya está. Y como el rol viaja firmado dentro del JWT, el cliente no puede modificarlo sin invalidar la firma.

---

## (9) Decisión clave 2 — Concurrencia — 55 s

Este fue probablemente el problema técnico más interesante. Si dos clientes intentan reservar **la última unidad** al mismo tiempo, ¿qué pasa?

La solución está en la base de datos. Cuando se crea una reserva, abrimos una transacción y hacemos `SELECT … FOR UPDATE` sobre la fila del producto. Eso **bloquea la fila** durante la transacción: el segundo cliente espera, ve que el stock ya no está disponible, y recibe un **HTTP 409 Conflict** con un mensaje claro.

Esto está cubierto por un test automatizado que lanza dos reservas en paralelo sobre el mismo producto y verifica que solo una tiene éxito. Es la diferencia entre "parece que funciona" y "está demostrado que funciona".

---

## (10) Frontend PWA — 35 s

*Mostrar capturas.*

El frontend es una **SPA en JavaScript vanilla** con un único `index.html` y vistas que se intercambian con CSS. Tiene modo claro y modo oscuro, es **instalable como PWA** —tanto en escritorio como en móvil— y el Service Worker cachea el shell de la aplicación para que el segundo arranque sea inmediato. Las pantallas principales son catálogo, mis reservas, cola del operario, dashboard de KPIs e inventario para el administrador.

---

## (11) App Android nativa — 40 s

La app Android está pensada **específicamente para el operario de almacén**. Está construida con Jetpack Compose y consume la misma API que la web. Tiene cuatro pantallas: login, lista de reservas activas, detalle de la reserva con botones para confirmar y entregar, y un formulario de incidencias para reportar roturas, faltantes o pedidos en mal estado.

El JWT se guarda con `EncryptedSharedPreferences` cifrado contra el Android Keystore — **nunca se escribe en texto plano**. La sesión se mantiene entre arranques.

---

## (12) Despliegue — 30 s

El sistema está en producción en **Railway**: backend Node.js y MySQL gestionado, con HTTPS automático y deploy continuo desde GitHub. Cada `push` a `main` dispara un redespliegue. El esquema de base de datos se aplica solo la primera vez —si las tablas están vacías— para que los redespliegues no pisen datos reales.

La URL pública está en la última diapositiva y al final de la demo.

---

## (13) Pruebas y resultados — 40 s

Tests automatizados con **Vitest + Supertest** sobre los flujos críticos: autenticación, CRUD de productos con autorización por rol, y el caso de **concurrencia simulada** que mencionábamos antes.

Resultado funcional: un catálogo con **500 productos** generados, dashboard con KPIs agregados, exportación CSV de reservas, importación CSV en lote con validación fila a fila, albarán A4 imprimible al entregar, y modo oscuro. El backend responde el listado de catálogo en **menos de 200 milisegundos** con esos 500 productos.

---

## (14) Demo en vivo — 2 a 3 min

*Demo guiada, en este orden:*

1. *Abrir la URL pública en el navegador.* Login como cliente, navegación por el catálogo, **reservar una unidad**.
2. *Cambiar a operario.* Mostrar la cola, **confirmar y entregar** la reserva creada.
3. *Cambiar a administrador.* Abrir el dashboard, comentar los KPIs.
4. *Abrir la app Android* (emulador o dispositivo). Login del operario, lista de reservas, confirmar una incidencia.

> Plan B si falla la red: vídeo pregrabado / capturas en las propias slides.

---

## (15) Conclusiones — 40 s

Stockly cumple los objetivos planteados: API REST con JWT y control por roles, reservas concurrentes consistentes, PWA instalable, app Android nativa funcional, y despliegue cloud público. El proyecto integra prácticamente todos los contenidos del ciclo: modelado de datos, API REST, autenticación, frontend, control de concurrencia, PWA, despliegue, pruebas y Android nativo.

Como mejoras futuras planteamos: documentación OpenAPI/Swagger, validación centralizada con Zod, escáner de código de barras en la app Android, cola offline con Room, y biometría antes de exponer la sesión.

Muchas gracias por su atención. Quedamos a disposición para las preguntas que quieran plantearnos.

---

## Anexo — posibles preguntas del tribunal

| Pregunta probable | Respuesta corta |
|---|---|
| ¿Por qué JavaScript vanilla y no React/Vue? | Dominio pequeño, control del bundle, evita acoplarnos a versiones de framework. |
| ¿Qué pasa si Railway cae? | El backend es stateless: redespliegue en otro proveedor con `MYSQL_URL` y `JWT_SECRET` y vuelve. |
| ¿Por qué `FOR UPDATE` y no `OPTIMISTIC LOCK`? | Es un caso de **alta contención sobre fila única** (la última unidad); el pesimista es más simple y predecible. |
| ¿Por qué JWT y no sesiones server-side? | Backend stateless → escalabilidad horizontal sin sticky sessions. |
| ¿Cómo se evita XSS? | `textContent` en lugar de `innerHTML`; `helmet` añade cabeceras `X-Content-Type-Options`. |
| ¿Y SQL injection? | Todas las consultas son `prepared statements` con `mysql2`; no se concatenan strings. |
| ¿Por qué Kotlin nativo y no React Native / Flutter? | Aprovecha capacidades nativas (Keystore, CameraX) y es la pila estándar del ciclo. |
| ¿Tests E2E? | No implementados; pendientes como mejora. Sí tests de integración con BD real en Vitest. |
| ¿Por qué no hay Swagger? | Decisión consciente: la API es pequeña y está descrita en la memoria; pendiente como mejora futura. |
