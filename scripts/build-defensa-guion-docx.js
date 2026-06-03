// Genera docs/defensa-guion.docx a partir del guion de la defensa.
// Ejecutar: node scripts/build-defensa-guion-docx.js
const fs = require('fs');
const path = require('path');
const {
    Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
    Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
    LevelFormat, PageOrientation, Header, Footer, PageNumber,
} = require('docx');

const OUT = path.join(__dirname, '..', 'docs', 'defensa-guion.docx');

const NAVY = '1E2761';
const OCHRE = 'C68A2E';
const INK = '1F2937';
const MUTED = '6B7280';
const RULE = 'CCCCCC';

const FONT = 'Calibri';

// Helpers
const p = (text, opts = {}) => new Paragraph({
    spacing: { after: opts.after ?? 120, before: opts.before ?? 0, line: 300 },
    alignment: opts.alignment,
    children: [new TextRun({ text, bold: opts.bold, italics: opts.italics, color: opts.color, size: opts.size, font: FONT })],
});

const runs = (parts, opts = {}) => new Paragraph({
    spacing: { after: opts.after ?? 120, line: 300 },
    children: parts.map(r => new TextRun({ ...r, font: FONT })),
});

const h1 = (text) => new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 160 },
    children: [new TextRun({ text, bold: true, color: NAVY, size: 36, font: FONT })],
});

const h2 = (text) => new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, bold: true, color: NAVY, size: 28, font: FONT })],
});

const h3 = (text) => new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true, color: OCHRE, size: 22, font: FONT })],
});

const quote = (text) => new Paragraph({
    spacing: { before: 60, after: 120, line: 280 },
    indent: { left: 360 },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: OCHRE, space: 12 } },
    children: [new TextRun({ text, italics: true, color: MUTED, size: 20, font: FONT })],
});

const hr = () => new Paragraph({
    spacing: { before: 120, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 6 } },
    children: [new TextRun('')],
});

const bullet = (parts) => new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { after: 60, line: 280 },
    children: parts.map(r => new TextRun({ ...r, font: FONT })),
});

const stage = (note) => new Paragraph({
    spacing: { after: 100, line: 280 },
    children: [new TextRun({ text: note, italics: true, color: MUTED, size: 20, font: FONT })],
});

const tag = (label) => new Paragraph({
    spacing: { before: 200, after: 60 },
    children: [
        new TextRun({ text: label, bold: true, color: 'FFFFFF', size: 18, font: FONT, highlight: undefined }),
    ],
    shading: { type: ShadingType.CLEAR, fill: OCHRE, color: 'auto' },
    indent: { left: 0 },
});

// Cabecera de slide
const slideHeader = (numero, titulo, segundos) => [
    new Paragraph({
        spacing: { before: 360, after: 80 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: NAVY, space: 4 } },
        children: [
            new TextRun({ text: `Slide ${numero}  ·  `, bold: true, color: OCHRE, size: 24, font: FONT }),
            new TextRun({ text: titulo, bold: true, color: NAVY, size: 28, font: FONT }),
            new TextRun({ text: `   —   ${segundos}`, color: MUTED, size: 20, font: FONT }),
        ],
    }),
];

// ---- Construcción ----

const portada = [
    new Paragraph({
        spacing: { before: 600, after: 80 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'GUION DE DEFENSA', bold: true, color: OCHRE, size: 20, font: FONT, characterSpacing: 100 })],
    }),
    new Paragraph({
        spacing: { after: 120 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'STOCKLY', bold: true, color: NAVY, size: 88, font: FONT })],
    }),
    new Paragraph({
        spacing: { after: 200 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Sistema de gestión de inventario y reservas para almacén', color: INK, size: 26, font: FONT })],
    }),
    new Paragraph({
        spacing: { before: 200, after: 80 },
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: OCHRE, space: 8 }, bottom: { style: BorderStyle.SINGLE, size: 6, color: OCHRE, space: 8 } },
        children: [new TextRun({ text: 'Trabajo Fin de Ciclo  ·  Desarrollo de Aplicaciones Multiplataforma (DAM)', color: INK, size: 22, font: FONT })],
    }),
    new Paragraph({
        spacing: { after: 80 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'CDM Formación Alcorcón  ·  Curso 2025 / 2026', color: MUTED, size: 20, font: FONT })],
    }),
    new Paragraph({
        spacing: { before: 600, after: 80 },
        alignment: AlignmentType.CENTER,
        children: [
            new TextRun({ text: 'Adrián Bravo Santos', bold: true, color: NAVY, size: 24, font: FONT }),
            new TextRun({ text: '   ·   ', color: OCHRE, size: 24, font: FONT }),
            new TextRun({ text: 'Miguel Ángel Florido', bold: true, color: NAVY, size: 24, font: FONT }),
        ],
    }),
    new Paragraph({
        spacing: { after: 80 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Tutor: Damián Sualdea Soy', italics: true, color: MUTED, size: 20, font: FONT })],
    }),
    new Paragraph({
        spacing: { before: 800, after: 60 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Duración objetivo · 10 minutos (≈ 1.300 palabras) + 2-3 min de demo en vivo', color: INK, size: 18, font: FONT })],
    }),
    new Paragraph({
        spacing: { after: 60 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Slides asociadas: defensa-stockly.pptx (17 diapositivas + cierre)', color: MUTED, size: 18, font: FONT })],
    }),
    new Paragraph({ children: [], pageBreakBefore: true }),
];

const convenciones = [
    h1('Convenciones del guion'),
    bullet([{ text: '(N) ', bold: true }, { text: 'marca el cambio de diapositiva.' }]),
    bullet([{ text: 'Texto en cursiva ', italics: true }, { text: '= nota escénica (qué mostrar, dónde apuntar).' }]),
    bullet([{ text: 'Ritmo: ~140 palabras/min. No leer literal: usar como guion de seguridad.' }]),
    hr(),
];

const slide1 = [
    ...slideHeader(1, 'Portada', '20 s'),
    p('Buenos días. Somos Adrián Bravo y Miguel Ángel Florido, y venimos a defender nuestro Trabajo Fin de Ciclo: Stockly, un sistema de gestión de inventario y reservas para almacén. El proyecto se ha desarrollado durante el curso 2025/2026 bajo la tutoría de Damián Sualdea.'),
];

const slide2 = [
    ...slideHeader(2, 'El problema', '50 s'),
    p('En muchas pymes —tiendas pequeñas, talleres, almacenes de distribución— el inventario sigue gestionándose con hojas de cálculo compartidas o anotaciones en papel. Esto crea tres problemas reales: ventas duplicadas cuando dos empleados venden lo mismo a la vez, reservas que se pierden porque no hay un control centralizado, y movimientos de stock sin trazabilidad, es decir, nadie sabe quién tocó qué ni cuándo.'),
    p('Queríamos resolver estos tres problemas con un sistema ligero pero serio: que no exija infraestructura compleja, pero que sí ofrezca control de concurrencia real, autenticación por roles y auditoría.'),
];

const slide3 = [
    ...slideHeader(3, 'La solución', '40 s'),
    p('Stockly se compone de tres piezas que comparten una misma API REST:'),
    bullet([{ text: 'Una aplicación web instalable como PWA, ', bold: true }, { text: 'para clientes y administradores.' }]),
    bullet([{ text: 'Una app Android nativa ', bold: true }, { text: 'en Kotlin, pensada específicamente para el operario de almacén.' }]),
    bullet([{ text: 'Un backend Node.js + Express ', bold: true }, { text: 'con base de datos MySQL, que es el cerebro del sistema.' }]),
    p('Todo está desplegado en producción y accesible públicamente en Railway, con HTTPS automático.'),
];

const slide4 = [
    ...slideHeader(4, 'Objetivos', '40 s'),
    p('El objetivo general era construir una aplicación web —con extensión móvil— para gestionar inventario y reservas con autenticación por roles, control de concurrencia y trazabilidad, desplegada en cloud.'),
    p('De los objetivos específicos destacamos cuatro: modelar un esquema relacional normalizado, garantizar que dos reservas paralelas nunca puedan superar el stock disponible, implementar un frontend instalable como PWA, y desarrollar una app Android nativa para el operario.'),
    p('Todos se han cumplido y los iremos viendo en las próximas diapositivas.'),
];

const slide5 = [
    ...slideHeader(5, 'Stack tecnológico', '35 s'),
    p('En el backend, Node.js 24 con Express, MySQL 8, JWT con bcrypt para la autenticación y Vitest para los tests. En el frontend, JavaScript vanilla —sin framework— con Service Worker para el modo PWA. Para la app móvil, Kotlin con Jetpack Compose, Retrofit para la red y EncryptedSharedPreferences para guardar el token de forma segura. Y en infraestructura, Railway como plataforma cloud, con deploy continuo desde GitHub.'),
    runs([
        { text: 'La decisión de ' },
        { text: 'no usar framework en el frontend ', bold: true },
        { text: 'fue deliberada: el dominio es pequeño y queríamos mantener el control total del bundle.' },
    ]),
];

const slide6 = [
    ...slideHeader(6, 'Arquitectura', '50 s'),
    stage('Apuntar al diagrama.'),
    runs([
        { text: 'La PWA y la app Android consumen exactamente la ' },
        { text: 'misma API REST sobre HTTPS, ', bold: true },
        { text: 'autenticándose con un JWT en la cabecera Authorization. El backend Express es ' },
        { text: 'stateless ', bold: true },
        { text: '—la sesión vive en el JWT, no en memoria— lo que significa que cualquier instancia puede atender cualquier petición. El estado real vive en MySQL.' },
    ]),
    runs([
        { text: 'Esto nos da dos ventajas: ' },
        { text: 'escalabilidad horizontal ', bold: true },
        { text: 'si algún día hiciera falta, y un ' },
        { text: 'único punto de verdad ', bold: true },
        { text: 'para las reglas de negocio: si un cliente intenta saltarse la validación desde el navegador, el backend la aplica igual.' },
    ]),
];

const slide7 = [
    ...slideHeader(7, 'Modelo de datos', '35 s'),
    runs([
        { text: 'Cinco tablas: ' },
        { text: 'usuarios, categorías, productos, reservas y movimientos. ', bold: true },
        { text: 'Las claves foráneas tienen política ON DELETE explícita; los estados de reserva son ENUM para forzar integridad a nivel de motor, no a nivel de aplicación. Y los campos críticos están indexados: SKU de producto, email de usuario, estado de reserva. Cualquier modificación de stock genera automáticamente un registro en la tabla movimientos — esa es la base de la trazabilidad.' },
    ]),
];

const slide8 = [
    ...slideHeader(8, 'Decisión clave 1 — Autorización por roles', '45 s'),
    runs([
        { text: 'Manejamos tres roles: ' },
        { text: 'cliente, operario y administrador. ', bold: true },
        { text: 'La autorización vive en ' },
        { text: 'dos capas: ', bold: true },
        { text: 'el frontend oculta los botones que el usuario no debería ver, pero la barrera real está en el backend. Cada ruta declara explícitamente qué rol necesita mediante un middleware requireRole.' },
    ]),
    stage('Apuntar al snippet.'),
    runs([
        { text: 'Este patrón nos permite que ' },
        { text: 'añadir una ruta protegida sea una línea: ', bold: true },
        { text: 'declaras qué rol la puede usar y ya está. Y como el rol viaja firmado dentro del JWT, el cliente no puede modificarlo sin invalidar la firma.' },
    ]),
];

const slide9 = [
    ...slideHeader(9, 'Decisión clave 2 — Concurrencia', '55 s'),
    runs([
        { text: 'Este fue probablemente el problema técnico más interesante. Si dos clientes intentan reservar ' },
        { text: 'la última unidad ', bold: true },
        { text: 'al mismo tiempo, ¿qué pasa?' },
    ]),
    runs([
        { text: 'La solución está en la base de datos. Cuando se crea una reserva, abrimos una transacción y hacemos SELECT … FOR UPDATE sobre la fila del producto. Eso ' },
        { text: 'bloquea la fila ', bold: true },
        { text: 'durante la transacción: el segundo cliente espera, ve que el stock ya no está disponible, y recibe un ' },
        { text: 'HTTP 409 Conflict ', bold: true },
        { text: 'con un mensaje claro.' },
    ]),
    p('Esto está cubierto por un test automatizado que lanza dos reservas en paralelo sobre el mismo producto y verifica que solo una tiene éxito. Es la diferencia entre "parece que funciona" y "está demostrado que funciona".'),
];

const slide10 = [
    ...slideHeader(10, 'Frontend PWA', '35 s'),
    stage('Anticipar que las capturas reales vienen en las dos diapositivas siguientes.'),
    runs([
        { text: 'El frontend es una ' },
        { text: 'SPA en JavaScript vanilla ', bold: true },
        { text: 'con un único index.html y vistas que se intercambian con CSS. Tiene modo claro y modo oscuro, es ' },
        { text: 'instalable como PWA ', bold: true },
        { text: '—tanto en escritorio como en móvil— y el Service Worker cachea el shell de la aplicación para que el segundo arranque sea inmediato. Las pantallas principales son catálogo, mis reservas, cola del operario, dashboard de KPIs e inventario para el administrador.' },
    ]),
];

const slide10b = [
    ...slideHeader(11, 'Capturas web — cliente y catálogo', '25 s'),
    stage('Recorrer las seis capturas de un vistazo.'),
    runs([
        { text: 'Aquí se ve la aplicación real en uso. De izquierda a derecha: el ' },
        { text: 'login con JWT, ', bold: true },
        { text: 'el ' },
        { text: 'catálogo con búsqueda y filtros, ', bold: true },
        { text: 'el detalle de un producto con su modal de reserva, la vista de ' },
        { text: '"mis reservas" ', bold: true },
        { text: 'del cliente, la ' },
        { text: 'cola de reservas ', bold: true },
        { text: 'que ve el operario, y el ' },
        { text: 'dashboard de KPIs ', bold: true },
        { text: 'del administrador.' },
    ]),
];

const slide10c = [
    ...slideHeader(12, 'Capturas web — administración y PWA', '20 s'),
    stage('Cuatro capturas: gestión y experiencia.'),
    runs([
        { text: 'Y estas cuatro cierran la parte web: el ' },
        { text: 'inventario ', bold: true },
        { text: 'con la alerta de stock bajo resaltada, la ' },
        { text: 'gestión de usuarios ', bold: true },
        { text: 'del administrador, el ' },
        { text: 'modo oscuro, ', bold: true },
        { text: 'y la pantalla de ' },
        { text: 'descarga del APK Android ', bold: true },
        { text: 'directamente desde la web. Todo esto está accesible en producción ahora mismo.' },
    ]),
];

const slide11 = [
    ...slideHeader(13, 'App Android nativa', '40 s'),
    runs([
        { text: 'La app Android está pensada ' },
        { text: 'específicamente para el operario de almacén. ', bold: true },
        { text: 'Está construida con Jetpack Compose y consume la misma API que la web. Tiene cuatro pantallas: login, lista de reservas activas, detalle de la reserva con botones para confirmar y entregar, y un formulario de incidencias para reportar roturas, faltantes o pedidos en mal estado.' },
    ]),
    runs([
        { text: 'El JWT se guarda con EncryptedSharedPreferences cifrado contra el Android Keystore — ' },
        { text: 'nunca se escribe en texto plano. ', bold: true },
        { text: 'La sesión se mantiene entre arranques.' },
    ]),
];

const slide12 = [
    ...slideHeader(14, 'Despliegue', '30 s'),
    runs([
        { text: 'El sistema está en producción en ' },
        { text: 'Railway: ', bold: true },
        { text: 'backend Node.js y MySQL gestionado, con HTTPS automático y deploy continuo desde GitHub. Cada push a main dispara un redespliegue. El esquema de base de datos se aplica solo la primera vez —si las tablas están vacías— para que los redespliegues no pisen datos reales.' },
    ]),
    p('La URL pública está en la última diapositiva y al final de la demo.'),
];

const slide13 = [
    ...slideHeader(15, 'Pruebas y resultados', '40 s'),
    runs([
        { text: 'Tests automatizados con ' },
        { text: 'Vitest + Supertest ', bold: true },
        { text: 'sobre los flujos críticos: autenticación, CRUD de productos con autorización por rol, y el caso de ' },
        { text: 'concurrencia simulada ', bold: true },
        { text: 'que mencionábamos antes.' },
    ]),
    runs([
        { text: 'Resultado funcional: un catálogo con ' },
        { text: '500 productos ', bold: true },
        { text: 'generados, dashboard con KPIs agregados, exportación CSV de reservas, importación CSV en lote con validación fila a fila, albarán A4 imprimible al entregar, y modo oscuro. El backend responde el listado de catálogo en ' },
        { text: 'menos de 200 milisegundos ', bold: true },
        { text: 'con esos 500 productos.' },
    ]),
];

const slide14 = [
    ...slideHeader(16, 'Demo en vivo', '2 — 3 min'),
    stage('Demo guiada, en este orden:'),
    new Paragraph({
        numbering: { reference: 'numbers', level: 0 }, spacing: { after: 80, line: 280 },
        children: [
            new TextRun({ text: 'Abrir la URL pública en el navegador. ', italics: true, font: FONT }),
            new TextRun({ text: 'Login como cliente, navegación por el catálogo, ', font: FONT }),
            new TextRun({ text: 'reservar una unidad.', bold: true, font: FONT }),
        ],
    }),
    new Paragraph({
        numbering: { reference: 'numbers', level: 0 }, spacing: { after: 80, line: 280 },
        children: [
            new TextRun({ text: 'Cambiar a operario. ', italics: true, font: FONT }),
            new TextRun({ text: 'Mostrar la cola, ', font: FONT }),
            new TextRun({ text: 'confirmar y entregar ', bold: true, font: FONT }),
            new TextRun({ text: 'la reserva creada.', font: FONT }),
        ],
    }),
    new Paragraph({
        numbering: { reference: 'numbers', level: 0 }, spacing: { after: 80, line: 280 },
        children: [
            new TextRun({ text: 'Cambiar a administrador. ', italics: true, font: FONT }),
            new TextRun({ text: 'Abrir el dashboard, comentar los KPIs.', font: FONT }),
        ],
    }),
    new Paragraph({
        numbering: { reference: 'numbers', level: 0 }, spacing: { after: 120, line: 280 },
        children: [
            new TextRun({ text: 'Abrir la app Android ', italics: true, font: FONT }),
            new TextRun({ text: '(emulador o dispositivo). Login del operario, lista de reservas, confirmar una incidencia.', font: FONT }),
        ],
    }),
    quote('Plan B si falla la red: vídeo pregrabado / capturas en las propias slides.'),
];

const slide15 = [
    ...slideHeader(17, 'Conclusiones', '40 s'),
    p('Stockly cumple los objetivos planteados: API REST con JWT y control por roles, reservas concurrentes consistentes, PWA instalable, app Android nativa funcional, y despliegue cloud público. El proyecto integra prácticamente todos los contenidos del ciclo: modelado de datos, API REST, autenticación, frontend, control de concurrencia, PWA, despliegue, pruebas y Android nativo.'),
    p('Como mejoras futuras planteamos: documentación OpenAPI/Swagger, validación centralizada con Zod, escáner de código de barras en la app Android, cola offline con Room, y biometría antes de exponer la sesión.'),
    p('Muchas gracias por su atención. Quedamos a disposición para las preguntas que quieran plantearnos.'),
];

// Tabla anexo Q&A
function qaTable() {
    const filas = [
        ['¿Por qué JavaScript vanilla y no React/Vue?', 'Dominio pequeño, control del bundle, evita acoplarnos a versiones de framework.'],
        ['¿Qué pasa si Railway cae?', 'El backend es stateless: redespliegue en otro proveedor con MYSQL_URL y JWT_SECRET y vuelve.'],
        ['¿Por qué FOR UPDATE y no OPTIMISTIC LOCK?', 'Alta contención sobre fila única (la última unidad); el pesimista es más simple y predecible.'],
        ['¿Por qué JWT y no sesiones server-side?', 'Backend stateless → escalabilidad horizontal sin sticky sessions.'],
        ['¿Cómo se evita XSS?', 'textContent en lugar de innerHTML; helmet añade cabeceras X-Content-Type-Options.'],
        ['¿Y SQL injection?', 'Todas las consultas son prepared statements con mysql2; no se concatenan strings.'],
        ['¿Por qué Kotlin nativo y no React Native / Flutter?', 'Aprovecha capacidades nativas (Keystore, CameraX) y es la pila estándar del ciclo.'],
        ['¿Tests E2E?', 'No implementados; pendientes. Sí tests de integración con BD real en Vitest.'],
        ['¿Por qué no hay Swagger?', 'Decisión consciente: API pequeña, descrita en la memoria; pendiente como mejora futura.'],
    ];

    const border = { style: BorderStyle.SINGLE, size: 4, color: RULE };
    const borders = { top: border, bottom: border, left: border, right: border };

    const tw = 9360; // 6.5"
    const c1 = 4000, c2 = 5360;

    const headerRow = new TableRow({
        tableHeader: true,
        children: [
            new TableCell({
                width: { size: c1, type: WidthType.DXA }, borders,
                shading: { type: ShadingType.CLEAR, fill: NAVY, color: 'auto' },
                margins: { top: 100, bottom: 100, left: 140, right: 140 },
                children: [new Paragraph({ children: [new TextRun({ text: 'Pregunta probable', bold: true, color: 'FFFFFF', font: FONT, size: 20 })] })],
            }),
            new TableCell({
                width: { size: c2, type: WidthType.DXA }, borders,
                shading: { type: ShadingType.CLEAR, fill: NAVY, color: 'auto' },
                margins: { top: 100, bottom: 100, left: 140, right: 140 },
                children: [new Paragraph({ children: [new TextRun({ text: 'Respuesta corta', bold: true, color: 'FFFFFF', font: FONT, size: 20 })] })],
            }),
        ],
    });

    const dataRows = filas.map((row, i) => new TableRow({
        children: [
            new TableCell({
                width: { size: c1, type: WidthType.DXA }, borders,
                shading: i % 2 === 0 ? undefined : { type: ShadingType.CLEAR, fill: 'F8FAFC', color: 'auto' },
                margins: { top: 100, bottom: 100, left: 140, right: 140 },
                children: [new Paragraph({ children: [new TextRun({ text: row[0], bold: true, color: INK, font: FONT, size: 18 })] })],
            }),
            new TableCell({
                width: { size: c2, type: WidthType.DXA }, borders,
                shading: i % 2 === 0 ? undefined : { type: ShadingType.CLEAR, fill: 'F8FAFC', color: 'auto' },
                margins: { top: 100, bottom: 100, left: 140, right: 140 },
                children: [new Paragraph({ children: [new TextRun({ text: row[1], color: INK, font: FONT, size: 18 })] })],
            }),
        ],
    }));

    return new Table({
        width: { size: tw, type: WidthType.DXA },
        columnWidths: [c1, c2],
        rows: [headerRow, ...dataRows],
    });
}

const anexo = [
    new Paragraph({ children: [], pageBreakBefore: true }),
    h1('Anexo — posibles preguntas del tribunal'),
    p('Respuestas cortas para tener preparadas durante el turno de preguntas. No reproducir literal: usar como guion mental.', { italics: true, color: MUTED, size: 20 }),
    qaTable(),
];

const children = [
    ...portada,
    ...convenciones,
    ...slide1, ...slide2, ...slide3, ...slide4, ...slide5,
    ...slide6, ...slide7, ...slide8, ...slide9, ...slide10,
    ...slide10b, ...slide10c,
    ...slide11, ...slide12, ...slide13, ...slide14, ...slide15,
    ...anexo,
];

const doc = new Document({
    creator: 'Adrián Bravo Santos · Miguel Ángel Florido',
    title: 'Guion de defensa — Stockly',
    description: 'Guion de la defensa del TFG DAM Stockly (10 min + demo).',
    styles: {
        default: { document: { run: { font: FONT, size: 22 } } },
        paragraphStyles: [
            { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
              run: { size: 36, bold: true, font: FONT, color: NAVY },
              paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 0 } },
            { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
              run: { size: 28, bold: true, font: FONT, color: NAVY },
              paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 1 } },
            { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
              run: { size: 22, bold: true, font: FONT, color: OCHRE },
              paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 } },
        ],
    },
    numbering: {
        config: [
            { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
            { reference: 'numbers', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
        ],
    },
    sections: [{
        properties: {
            page: {
                size: { width: 11906, height: 16838 }, // A4
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
            },
        },
        headers: {
            default: new Header({ children: [new Paragraph({
                alignment: AlignmentType.RIGHT,
                border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: OCHRE, space: 4 } },
                children: [new TextRun({ text: 'Stockly · Guion de defensa · TFG DAM 2025/26', color: MUTED, size: 18, font: FONT, italics: true })],
            })] }),
        },
        footers: {
            default: new Footer({ children: [new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({ text: 'Página ', color: MUTED, size: 18, font: FONT }),
                    new TextRun({ children: [PageNumber.CURRENT], color: MUTED, size: 18, font: FONT }),
                    new TextRun({ text: ' de ', color: MUTED, size: 18, font: FONT }),
                    new TextRun({ children: [PageNumber.TOTAL_PAGES], color: MUTED, size: 18, font: FONT }),
                ],
            })] }),
        },
        children,
    }],
});

Packer.toBuffer(doc).then(buf => {
    fs.writeFileSync(OUT, buf);
    console.log('OK ->', OUT);
}).catch(err => { console.error('ERROR', err); process.exit(1); });
