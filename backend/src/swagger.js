// Especificación OpenAPI 3.0 completa de la API Stockly
const swaggerSpec = {
    openapi: '3.0.3',
    info: {
        title: 'Stockly API',
        version: '1.0.0',
        description:
            'API REST del sistema de gestión de almacén y reservas Stockly.\n\n' +
            'Usa el botón **Authorize** para introducir tu token JWT (formato: `Bearer <token>`).\n\n' +
            'Puedes obtener un token en **POST /api/auth/login**.',
        contact: {
            name: 'Adrián Bravo Santos y Miguel Ángel Florido',
            email: 'tfgdammigueladri@gmail.com',
        },
    },
    servers: [
        { url: '/api', description: 'Servidor actual' },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Token JWT obtenido en /auth/login o /auth/register',
            },
        },
        schemas: {
            Error: {
                type: 'object',
                properties: { error: { type: 'string', example: 'Mensaje de error' } },
            },
            Usuario: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    nombre: { type: 'string', example: 'Admin Stockly' },
                    email: { type: 'string', format: 'email', example: 'admin@stockly.com' },
                    rol: { type: 'string', enum: ['admin', 'operario', 'cliente'], example: 'admin' },
                },
            },
            TokenResponse: {
                type: 'object',
                properties: {
                    token: { type: 'string', description: 'JWT firmado (HS256)' },
                    user: { $ref: '#/components/schemas/Usuario' },
                },
            },
            Categoria: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    nombre: { type: 'string', example: 'Electrónica' },
                    icono: { type: 'string', nullable: true, example: '💡' },
                    color: { type: 'string', nullable: true, example: '#3b82f6' },
                    productos: { type: 'integer', description: 'Nº de productos activos en esta categoría', example: 12 },
                },
            },
            Producto: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    sku: { type: 'string', example: 'SKU-00001' },
                    nombre: { type: 'string', example: 'Destornillador Phillips' },
                    descripcion: { type: 'string', nullable: true },
                    ubicacion: { type: 'string', example: 'A1-B2' },
                    stock: { type: 'integer', example: 50 },
                    stock_reservado: { type: 'integer', example: 5 },
                    stock_minimo: { type: 'integer', example: 10 },
                    precio: { type: 'number', format: 'float', example: 4.99 },
                    imagen_url: { type: 'string', nullable: true },
                    categoria_id: { type: 'integer', nullable: true, example: 1 },
                    categoria: { type: 'string', nullable: true, example: 'Herramientas' },
                    categoria_icono: { type: 'string', nullable: true },
                    categoria_color: { type: 'string', nullable: true },
                },
            },
            ProductoInput: {
                type: 'object',
                required: ['sku', 'nombre', 'ubicacion'],
                properties: {
                    sku: { type: 'string', example: 'DESTPHIL-M6', description: '1-20 alfanuméricos, _ o -' },
                    nombre: { type: 'string', example: 'Destornillador Phillips M6', description: 'Mínimo 3 caracteres' },
                    descripcion: { type: 'string', nullable: true },
                    ubicacion: { type: 'string', example: 'A1-B2' },
                    stock: { type: 'integer', default: 0, example: 50 },
                    stock_minimo: { type: 'integer', default: 5, example: 10 },
                    precio: { type: 'number', default: 0, example: 4.99 },
                    categoria_id: { type: 'integer', nullable: true, example: 1 },
                    imagen_url: { type: 'string', nullable: true },
                },
            },
            Movimiento: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    tipo: { type: 'string', enum: ['entrada', 'salida', 'ajuste', 'reserva', 'liberacion'] },
                    cantidad: { type: 'integer' },
                    stock_anterior: { type: 'integer' },
                    stock_posterior: { type: 'integer' },
                    motivo: { type: 'string', nullable: true },
                    fecha: { type: 'string', format: 'date-time' },
                    usuario: { type: 'string', nullable: true },
                },
            },
            Reserva: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    cantidad: { type: 'integer', example: 3 },
                    estado: { type: 'string', enum: ['pendiente', 'confirmada', 'entregada', 'cancelada'] },
                    fecha_reserva: { type: 'string', format: 'date-time' },
                    fecha_recogida: { type: 'string', format: 'date', nullable: true },
                    fecha_entrega: { type: 'string', format: 'date-time', nullable: true },
                    notas: { type: 'string', nullable: true },
                    usuario_id: { type: 'integer' },
                    usuario: { type: 'string', example: 'Juan García' },
                    usuario_email: { type: 'string', format: 'email' },
                    producto_id: { type: 'integer' },
                    sku: { type: 'string' },
                    producto: { type: 'string' },
                    ubicacion: { type: 'string' },
                    precio: { type: 'number', format: 'float' },
                },
            },
        },
    },
    paths: {
        '/health': {
            get: {
                tags: ['Sistema'],
                summary: 'Comprobación de salud',
                description: 'Verifica que el servidor y la base de datos están operativos.',
                responses: {
                    200: {
                        description: 'Servicio operativo',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        ok: { type: 'boolean' },
                                        db: { type: 'boolean' },
                                        ts: { type: 'string', format: 'date-time' },
                                    },
                                },
                            },
                        },
                    },
                    500: { description: 'Error en la base de datos' },
                },
            },
        },

        // ─── AUTH ───────────────────────────────────────────────────────────
        '/auth/login': {
            post: {
                tags: ['Autenticación'],
                summary: 'Iniciar sesión',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', format: 'email', example: 'admin@stockly.com' },
                                    password: { type: 'string', example: 'password123' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Login correcto',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } } },
                    },
                    400: { description: 'Email o contraseña ausentes' },
                    401: { description: 'Credenciales inválidas o usuario inactivo' },
                },
            },
        },
        '/auth/register': {
            post: {
                tags: ['Autenticación'],
                summary: 'Registro de cliente',
                description: 'Crea una cuenta con rol `cliente` y devuelve el token directamente.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nombre', 'email', 'password'],
                                properties: {
                                    nombre: { type: 'string', example: 'María López' },
                                    email: { type: 'string', format: 'email', example: 'maria@ejemplo.com' },
                                    password: { type: 'string', minLength: 6, example: 'segura123' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Cuenta creada',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } } },
                    },
                    400: { description: 'Faltan campos o contraseña muy corta' },
                    409: { description: 'Email ya registrado' },
                },
            },
        },
        '/auth/me': {
            get: {
                tags: ['Autenticación'],
                summary: 'Datos del usuario autenticado',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Datos del usuario',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { user: { $ref: '#/components/schemas/Usuario' } },
                                },
                            },
                        },
                    },
                    401: { description: 'Token ausente o inválido' },
                },
            },
            patch: {
                tags: ['Autenticación'],
                summary: 'Actualizar perfil propio',
                description:
                    'Actualiza nombre, email y/o contraseña. Para cambiar la contraseña se requiere `password_actual` + `password_nuevo`.',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    nombre: { type: 'string' },
                                    email: { type: 'string', format: 'email' },
                                    password_actual: { type: 'string' },
                                    password_nuevo: { type: 'string', minLength: 6 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Perfil actualizado, nuevo token emitido',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } } },
                    },
                    400: { description: 'Datos inválidos o sin cambios' },
                    401: { description: 'Contraseña actual incorrecta' },
                    409: { description: 'Email ya en uso' },
                },
            },
        },

        // ─── CATEGORÍAS ─────────────────────────────────────────────────────
        '/categorias': {
            get: {
                tags: ['Categorías'],
                summary: 'Listar categorías',
                description: 'Devuelve todas las categorías con el contador de productos activos. No requiere autenticación.',
                responses: {
                    200: {
                        description: 'Lista de categorías',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/Categoria' } },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['Categorías'],
                summary: 'Crear categoría',
                security: [{ bearerAuth: [] }],
                description: 'Requiere rol **admin**.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nombre'],
                                properties: {
                                    nombre: { type: 'string', example: 'Herramientas' },
                                    icono: { type: 'string', nullable: true, example: '🔧' },
                                    color: { type: 'string', nullable: true, example: '#f59e0b' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'Categoría creada', content: { 'application/json': { schema: { type: 'object', properties: { id: { type: 'integer' } } } } } },
                    400: { description: 'Nombre obligatorio' },
                    401: { description: 'No autenticado' },
                    403: { description: 'Rol insuficiente' },
                    409: { description: 'Nombre duplicado' },
                },
            },
        },
        '/categorias/{id}': {
            patch: {
                tags: ['Categorías'],
                summary: 'Editar categoría',
                security: [{ bearerAuth: [] }],
                description: 'Actualiza nombre, icono y/o color. Requiere rol **admin**.',
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    nombre: { type: 'string' },
                                    icono: { type: 'string', nullable: true },
                                    color: { type: 'string', nullable: true },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Actualizada' },
                    400: { description: 'Sin cambios o nombre vacío' },
                    404: { description: 'No encontrada' },
                    409: { description: 'Nombre duplicado' },
                },
            },
            delete: {
                tags: ['Categorías'],
                summary: 'Eliminar categoría',
                security: [{ bearerAuth: [] }],
                description:
                    'Elimina la categoría. Si tiene productos asociados devuelve 409 salvo que se pase `?force=true`, que los desasigna. Requiere rol **admin**.',
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
                    { in: 'query', name: 'force', schema: { type: 'boolean' }, description: 'Desasignar productos antes de borrar' },
                ],
                responses: {
                    200: { description: 'Eliminada' },
                    404: { description: 'No encontrada' },
                    409: { description: 'Tiene productos asociados (usa force=true o merge)' },
                },
            },
        },
        '/categorias/{id}/merge': {
            post: {
                tags: ['Categorías'],
                summary: 'Fusionar categoría',
                security: [{ bearerAuth: [] }],
                description: 'Mueve todos los productos de `{id}` a `destino_id` y elimina `{id}`. Requiere rol **admin**.',
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['destino_id'],
                                properties: { destino_id: { type: 'integer', example: 3 } },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Fusión completada', content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' }, productos_movidos: { type: 'integer' } } } } } },
                    400: { description: 'destino_id inválido' },
                    404: { description: 'Categoría origen o destino no existe' },
                },
            },
        },

        // ─── PRODUCTOS ──────────────────────────────────────────────────────
        '/productos': {
            get: {
                tags: ['Productos'],
                summary: 'Listar productos',
                description: 'Lista paginada con filtros opcionales. No requiere autenticación.',
                parameters: [
                    { in: 'query', name: 'search', schema: { type: 'string' }, description: 'Buscar por nombre o SKU' },
                    { in: 'query', name: 'categoria', schema: { type: 'integer' }, description: 'Filtrar por categoria_id' },
                    { in: 'query', name: 'stock_bajo', schema: { type: 'string', enum: ['1'] }, description: 'Solo productos con stock bajo mínimo' },
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 20, maximum: 100 } },
                    { in: 'query', name: 'sort', schema: { type: 'string', enum: ['nombre', 'sku', 'stock', 'precio'] } },
                    { in: 'query', name: 'dir', schema: { type: 'string', enum: ['asc', 'desc'] } },
                ],
                responses: {
                    200: {
                        description: 'Página de productos',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        data: { type: 'array', items: { $ref: '#/components/schemas/Producto' } },
                                        page: { type: 'integer' },
                                        limit: { type: 'integer' },
                                        total: { type: 'integer' },
                                        pages: { type: 'integer' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['Productos'],
                summary: 'Crear producto',
                security: [{ bearerAuth: [] }],
                description: 'Requiere rol **admin** u **operario**.',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductoInput' } } },
                },
                responses: {
                    201: { description: 'Producto creado', content: { 'application/json': { schema: { type: 'object', properties: { id: { type: 'integer' } } } } } },
                    400: { description: 'Validación fallida' },
                    409: { description: 'SKU duplicado' },
                },
            },
        },
        '/productos/sku-sugerido': {
            get: {
                tags: ['Productos'],
                summary: 'SKU sugerido',
                description: 'Devuelve el siguiente SKU disponible en formato `SKU-NNNNN`. Requiere rol **admin** u **operario**.',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'SKU sugerido', content: { 'application/json': { schema: { type: 'object', properties: { sku: { type: 'string', example: 'SKU-00042' } } } } } },
                },
            },
        },
        '/productos/import': {
            post: {
                tags: ['Productos'],
                summary: 'Importación masiva (CSV)',
                security: [{ bearerAuth: [] }],
                description: 'Crea hasta 2000 productos en una sola petición. Requiere rol **admin** u **operario**.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['productos'],
                                properties: {
                                    productos: {
                                        type: 'array',
                                        maxItems: 2000,
                                        items: { $ref: '#/components/schemas/ProductoInput' },
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Resultado de la importación',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        creados: { type: 'integer' },
                                        fallidos: { type: 'integer' },
                                        resultados: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    linea: { type: 'integer' },
                                                    ok: { type: 'boolean' },
                                                    id: { type: 'integer' },
                                                    sku: { type: 'string' },
                                                    error: { type: 'string' },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/productos/{id}': {
            get: {
                tags: ['Productos'],
                summary: 'Obtener producto',
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                responses: {
                    200: { description: 'Producto', content: { 'application/json': { schema: { $ref: '#/components/schemas/Producto' } } } },
                    404: { description: 'No encontrado' },
                },
            },
            put: {
                tags: ['Productos'],
                summary: 'Actualizar producto',
                security: [{ bearerAuth: [] }],
                description: 'Actualización parcial (PATCH semántico). Requiere rol **admin** u **operario**.',
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                requestBody: {
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductoInput' } } },
                },
                responses: {
                    200: { description: 'Actualizado' },
                    400: { description: 'Validación fallida' },
                    404: { description: 'No encontrado' },
                },
            },
            delete: {
                tags: ['Productos'],
                summary: 'Eliminar producto (soft delete)',
                security: [{ bearerAuth: [] }],
                description: 'Marca el producto como inactivo (no borra de BD). Requiere rol **admin**.',
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                responses: {
                    200: { description: 'Desactivado' },
                    404: { description: 'No encontrado' },
                },
            },
        },
        '/productos/{id}/movimientos': {
            get: {
                tags: ['Productos'],
                summary: 'Histórico de movimientos del producto',
                security: [{ bearerAuth: [] }],
                description: 'Requiere rol **admin** u **operario**.',
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 100, maximum: 500 } },
                ],
                responses: {
                    200: {
                        description: 'Movimientos del producto',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        producto: { $ref: '#/components/schemas/Producto' },
                                        movimientos: { type: 'array', items: { $ref: '#/components/schemas/Movimiento' } },
                                        totales: { type: 'object', description: 'Suma de cantidades agrupada por tipo' },
                                    },
                                },
                            },
                        },
                    },
                    404: { description: 'Producto no encontrado' },
                },
            },
        },

        // ─── RESERVAS ───────────────────────────────────────────────────────
        '/reservas': {
            get: {
                tags: ['Reservas'],
                summary: 'Listar reservas',
                security: [{ bearerAuth: [] }],
                description:
                    'Los clientes solo ven sus propias reservas. Admin/operario pueden filtrar por cualquier usuario.',
                parameters: [
                    { in: 'query', name: 'estado', schema: { type: 'string' }, description: 'Uno o varios estados separados por coma' },
                    { in: 'query', name: 'activas', schema: { type: 'string', enum: ['1'] }, description: 'Atajo: pendiente + confirmada' },
                    { in: 'query', name: 'historico', schema: { type: 'string', enum: ['1'] }, description: 'Atajo: entregada + cancelada' },
                    { in: 'query', name: 'usuario_id', schema: { type: 'integer' }, description: 'Filtrar por usuario (solo admin/operario)' },
                    { in: 'query', name: 'q', schema: { type: 'string' }, description: 'Buscar por id (#N), SKU o nombre de producto' },
                    { in: 'query', name: 'desde', schema: { type: 'string', format: 'date' }, description: 'Fecha inicio (YYYY-MM-DD)' },
                    { in: 'query', name: 'hasta', schema: { type: 'string', format: 'date' }, description: 'Fecha fin (YYYY-MM-DD)' },
                ],
                responses: {
                    200: {
                        description: 'Lista de reservas (máx. 500)',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/Reserva' } },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['Reservas'],
                summary: 'Crear reserva',
                security: [{ bearerAuth: [] }],
                description: 'Cualquier usuario autenticado puede crear una reserva.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['producto_id', 'cantidad'],
                                properties: {
                                    producto_id: { type: 'integer', example: 1 },
                                    cantidad: { type: 'integer', minimum: 1, example: 3 },
                                    fecha_recogida: { type: 'string', format: 'date', nullable: true, example: '2026-06-15' },
                                    notas: { type: 'string', nullable: true },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'Reserva creada', content: { 'application/json': { schema: { type: 'object', properties: { id: { type: 'integer' } } } } } },
                    400: { description: 'Datos inválidos' },
                    404: { description: 'Producto no existe o inactivo' },
                    409: { description: 'Stock insuficiente' },
                },
            },
        },
        '/reservas/bulk': {
            post: {
                tags: ['Reservas'],
                summary: 'Acción masiva sobre reservas',
                security: [{ bearerAuth: [] }],
                description:
                    'Aplica `confirmar`, `entregar` o `cancelar` a hasta 100 reservas a la vez. Los clientes solo pueden cancelar.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['ids', 'accion'],
                                properties: {
                                    ids: { type: 'array', items: { type: 'integer' }, maxItems: 100, example: [1, 2, 3] },
                                    accion: { type: 'string', enum: ['confirmar', 'entregar', 'cancelar'] },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Resultados por reserva',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        aplicadas: { type: 'integer' },
                                        fallidas: { type: 'integer' },
                                        resultados: { type: 'array', items: { type: 'object', properties: { id: { type: 'integer' }, ok: { type: 'boolean' }, error: { type: 'string' } } } },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/reservas/{id}': {
            get: {
                tags: ['Reservas'],
                summary: 'Detalle de reserva',
                security: [{ bearerAuth: [] }],
                description: 'Incluye datos de quién confirmó/entregó e incidencias asociadas. Los clientes solo pueden ver sus reservas.',
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                responses: {
                    200: { description: 'Detalle completo de la reserva' },
                    403: { description: 'No autorizado (cliente ajeno)' },
                    404: { description: 'No encontrada' },
                },
            },
            delete: {
                tags: ['Reservas'],
                summary: 'Cancelar reserva',
                security: [{ bearerAuth: [] }],
                description: 'Los clientes solo pueden cancelar sus propias reservas.',
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                responses: {
                    200: { description: 'Cancelada' },
                    400: { description: 'No se puede cancelar (ya cancelada o entregada)' },
                    403: { description: 'No autorizado' },
                    404: { description: 'No encontrada' },
                },
            },
        },
        '/reservas/{id}/estado': {
            patch: {
                tags: ['Reservas'],
                summary: 'Cambiar estado de reserva',
                security: [{ bearerAuth: [] }],
                description:
                    'Gestiona las transiciones de estado. Soporta reactivación de reservas entregadas o canceladas. Requiere rol **admin** u **operario**.',
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['estado'],
                                properties: {
                                    estado: { type: 'string', enum: ['pendiente', 'confirmada', 'entregada', 'cancelada'] },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Estado actualizado' },
                    400: { description: 'Transición no válida' },
                    404: { description: 'No encontrada' },
                },
            },
        },
        '/reservas/{id}/incidencias': {
            post: {
                tags: ['Reservas'],
                summary: 'Registrar incidencia en reserva',
                security: [{ bearerAuth: [] }],
                description: 'Requiere rol **admin** u **operario**.',
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['descripcion'],
                                properties: {
                                    tipo: { type: 'string', enum: ['rotura', 'faltante', 'mal_estado', 'otro'], default: 'otro' },
                                    descripcion: { type: 'string', maxLength: 2000, example: 'Caja dañada en la esquina' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'Incidencia registrada' },
                    400: { description: 'Descripción obligatoria' },
                    404: { description: 'Reserva no encontrada' },
                },
            },
        },

        // ─── ADMIN ──────────────────────────────────────────────────────────
        '/admin/stats': {
            get: {
                tags: ['Admin'],
                summary: 'Estadísticas del dashboard',
                security: [{ bearerAuth: [] }],
                description: 'Requiere rol **admin** u **operario**.',
                responses: {
                    200: {
                        description: 'Estadísticas generales',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        totales: {
                                            type: 'object',
                                            properties: {
                                                productos: { type: 'integer' },
                                                stock_bajo: { type: 'integer' },
                                                usuarios: { type: 'integer' },
                                                pendientes: { type: 'integer' },
                                                confirmadas: { type: 'integer' },
                                                entregadas: { type: 'integer' },
                                                valor_inventario: { type: 'number' },
                                            },
                                        },
                                        porCategoria: { type: 'array', items: { type: 'object' } },
                                        reservasPorDia: { type: 'array', items: { type: 'object' } },
                                        topProductos: { type: 'array', items: { type: 'object' } },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/admin/usuarios': {
            get: {
                tags: ['Admin'],
                summary: 'Listar usuarios',
                security: [{ bearerAuth: [] }],
                description: 'Requiere rol **admin**.',
                responses: {
                    200: {
                        description: 'Lista de usuarios',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer' },
                                            nombre: { type: 'string' },
                                            email: { type: 'string' },
                                            rol: { type: 'string', enum: ['admin', 'operario', 'cliente'] },
                                            activo: { type: 'boolean' },
                                            creado_en: { type: 'string', format: 'date-time' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['Admin'],
                summary: 'Crear usuario',
                security: [{ bearerAuth: [] }],
                description: 'Requiere rol **admin**.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nombre', 'email', 'password'],
                                properties: {
                                    nombre: { type: 'string' },
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string', minLength: 6 },
                                    rol: { type: 'string', enum: ['admin', 'operario', 'cliente'], default: 'cliente' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'Usuario creado' },
                    409: { description: 'Email duplicado' },
                },
            },
        },
        '/admin/usuarios/{id}': {
            put: {
                tags: ['Admin'],
                summary: 'Actualizar usuario',
                security: [{ bearerAuth: [] }],
                description: 'Actualización parcial de nombre, email, rol, activo y/o contraseña. Requiere rol **admin**.',
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    nombre: { type: 'string' },
                                    email: { type: 'string', format: 'email' },
                                    rol: { type: 'string', enum: ['admin', 'operario', 'cliente'] },
                                    activo: { type: 'boolean' },
                                    password: { type: 'string', minLength: 6 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Actualizado' },
                },
            },
        },
        '/admin/movimientos': {
            get: {
                tags: ['Admin'],
                summary: 'Últimos movimientos de stock',
                security: [{ bearerAuth: [] }],
                description: 'Requiere rol **admin** u **operario**.',
                parameters: [
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 50, maximum: 200 } },
                ],
                responses: {
                    200: {
                        description: 'Lista de movimientos',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/Movimiento' } },
                            },
                        },
                    },
                },
            },
        },
        '/admin/export/reservas.csv': {
            get: {
                tags: ['Admin'],
                summary: 'Exportar reservas a CSV',
                security: [{ bearerAuth: [] }],
                description: 'Descarga un archivo CSV con todas las reservas. Requiere rol **admin** u **operario**.',
                responses: {
                    200: {
                        description: 'Archivo CSV',
                        content: { 'text/csv': { schema: { type: 'string', format: 'binary' } } },
                    },
                },
            },
        },
        '/admin/export/inventario.csv': {
            get: {
                tags: ['Admin'],
                summary: 'Exportar inventario a CSV',
                security: [{ bearerAuth: [] }],
                description: 'Descarga el inventario completo. Requiere rol **admin** u **operario**.',
                parameters: [
                    { in: 'query', name: 'search', schema: { type: 'string' } },
                    { in: 'query', name: 'categoria', schema: { type: 'integer' } },
                    { in: 'query', name: 'stock_bajo', schema: { type: 'string', enum: ['1'] } },
                    { in: 'query', name: 'include_inactivos', schema: { type: 'string', enum: ['1'] } },
                ],
                responses: {
                    200: {
                        description: 'Archivo CSV',
                        content: { 'text/csv': { schema: { type: 'string', format: 'binary' } } },
                    },
                },
            },
        },
    },
    tags: [
        { name: 'Sistema', description: 'Estado del servicio' },
        { name: 'Autenticación', description: 'Login, registro y gestión del perfil propio' },
        { name: 'Categorías', description: 'CRUD de categorías de productos' },
        { name: 'Productos', description: 'Gestión de inventario' },
        { name: 'Reservas', description: 'Creación y gestión del ciclo de vida de reservas' },
        { name: 'Admin', description: 'Estadísticas, usuarios y exportaciones (admin/operario)' },
    ],
};

module.exports = swaggerSpec;
