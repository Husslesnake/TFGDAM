// Genera docs/defensa-stockly.pptx — 15 slides, estilo sobrio corporativo claro.
// Ejecutar: node scripts/build-defensa-pptx.js
const path = require('path');
const PptxGenJS = require('pptxgenjs');

const OUT = path.join(__dirname, '..', 'docs', 'defensa-stockly.pptx');

// Paleta
const NAVY = '1E2761';
const NAVY_DARK = '141A47';
const OCHRE = 'C68A2E';
const INK = '1F2937';
const MUTED = '6B7280';
const RULE = 'E5E7EB';
const BG = 'FFFFFF';
const PANEL = 'F8FAFC';
const CODE_BG = '0F172A';
const CODE_FG = 'E2E8F0';
const CODE_KW = 'F472B6';
const CODE_STR = 'A7F3D0';

const HEAD = 'Calibri';
const BODY = 'Calibri';
const MONO = 'Consolas';

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5 in
pptx.title = 'Stockly — Defensa TFG DAM';
pptx.author = 'Adrián Bravo Santos · Miguel Ángel Florido';
pptx.company = 'CDM Formación Alcorcón';
pptx.subject = 'Stockly: sistema de gestión de inventario y reservas';

const SW = 13.333;
const SH = 7.5;

// Master para contenido (con cinta superior)
pptx.defineSlideMaster({
    title: 'CONTENT',
    background: { color: BG },
    objects: [
        // Banda superior fina ocre
        { rect: { x: 0, y: 0, w: SW, h: 0.08, fill: { color: OCHRE } } },
        // Pie con marca
        { text: {
            text: 'Stockly · TFG DAM 2025/26 · Adrián Bravo · Miguel Á. Florido',
            options: { x: 0.5, y: SH - 0.4, w: 9, h: 0.3, fontSize: 9, fontFace: BODY, color: MUTED }
        }},
        { text: {
            text: '{slide_num}',
            options: { x: SW - 0.9, y: SH - 0.4, w: 0.5, h: 0.3, fontSize: 9, fontFace: BODY, color: MUTED, align: 'right' }
        }},
    ],
});

// Helpers
function title(slide, text) {
    slide.addText(text, {
        x: 0.5, y: 0.4, w: SW - 1, h: 0.7,
        fontSize: 32, bold: true, fontFace: HEAD, color: NAVY,
    });
    // Pequeño tick ocre a la izquierda del título
    slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.12, w: 0.45, h: 0.07, fill: { color: OCHRE }, line: { color: OCHRE } });
}

function kicker(slide, text) {
    slide.addText(text, {
        x: 0.5, y: 0.18, w: SW - 1, h: 0.25,
        fontSize: 10, bold: true, fontFace: HEAD, color: OCHRE, charSpacing: 4,
    });
}

function bullets(slide, items, opts = {}) {
    const x = opts.x ?? 0.6;
    const y = opts.y ?? 1.5;
    const w = opts.w ?? SW - 1.2;
    const h = opts.h ?? SH - y - 0.6;
    slide.addText(items.map(t => ({ text: t, options: { bullet: { code: '25A0' }, color: INK } })), {
        x, y, w, h, fontSize: opts.fontSize ?? 17, fontFace: BODY, color: INK,
        paraSpaceAfter: 8, valign: 'top',
    });
}

function panel(slide, x, y, w, h, fill = PANEL) {
    slide.addShape(pptx.ShapeType.rect, { x, y, w, h, fill: { color: fill }, line: { color: RULE, width: 1 } });
}

function codeBlock(slide, code, opts = {}) {
    const x = opts.x ?? 0.6;
    const y = opts.y ?? 1.5;
    const w = opts.w ?? SW - 1.2;
    const h = opts.h ?? 4.5;
    slide.addShape(pptx.ShapeType.rect, { x, y, w, h, fill: { color: CODE_BG }, line: { color: CODE_BG } });
    slide.addText(code, {
        x: x + 0.2, y: y + 0.15, w: w - 0.4, h: h - 0.3,
        fontSize: opts.fontSize ?? 13, fontFace: MONO, color: CODE_FG,
        valign: 'top',
    });
}

// ---------- (1) Portada ----------
{
    const s = pptx.addSlide();
    s.background = { color: NAVY_DARK };
    // Acento ocre vertical
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.25, h: SH, fill: { color: OCHRE }, line: { color: OCHRE } });
    s.addText('STOCKLY', {
        x: 0.9, y: 1.6, w: 11, h: 1.3,
        fontSize: 84, bold: true, fontFace: HEAD, color: 'FFFFFF', charSpacing: 6,
    });
    s.addText('Sistema de gestión de inventario y reservas para almacén', {
        x: 0.9, y: 3.0, w: 11, h: 0.6,
        fontSize: 22, fontFace: HEAD, color: 'CADCFC',
    });
    // Línea fina
    s.addShape(pptx.ShapeType.rect, { x: 0.95, y: 3.85, w: 1.2, h: 0.04, fill: { color: OCHRE }, line: { color: OCHRE } });

    s.addText([
        { text: 'Trabajo Fin de Ciclo · Desarrollo de Aplicaciones Multiplataforma (DAM)\n', options: { fontSize: 14, color: 'CADCFC' } },
        { text: 'CDM Formación Alcorcón · Curso 2025 / 2026', options: { fontSize: 14, color: 'CADCFC' } },
    ], { x: 0.95, y: 4.05, w: 11, h: 0.9, fontFace: BODY });

    s.addText([
        { text: 'Adrián Bravo Santos', options: { bold: true, fontSize: 18, color: 'FFFFFF' } },
        { text: '   ·   ', options: { fontSize: 18, color: OCHRE } },
        { text: 'Miguel Ángel Florido', options: { bold: true, fontSize: 18, color: 'FFFFFF' } },
    ], { x: 0.95, y: 5.6, w: 11, h: 0.5, fontFace: BODY });

    s.addText('Tutor: Damián Sualdea Soy', {
        x: 0.95, y: 6.1, w: 11, h: 0.4, fontSize: 13, fontFace: BODY, color: 'CADCFC', italic: true,
    });
}

// ---------- (2) El problema ----------
{
    const s = pptx.addSlide({ masterName: 'CONTENT' });
    kicker(s, 'CONTEXTO');
    title(s, 'El problema en las pymes');

    // 3 tarjetas
    const cards = [
        { t: 'Ventas duplicadas', d: 'Dos personas venden la misma unidad a la vez.' },
        { t: 'Reservas perdidas', d: 'Anotaciones en papel u hojas sin control central.' },
        { t: 'Sin trazabilidad', d: 'Nadie sabe quién movió qué stock, ni cuándo.' },
    ];
    const cw = 3.9, ch = 2.6, gap = 0.3;
    const startX = (SW - (cw * 3 + gap * 2)) / 2;
    cards.forEach((c, i) => {
        const x = startX + i * (cw + gap);
        const y = 1.7;
        panel(s, x, y, cw, ch);
        s.addShape(pptx.ShapeType.rect, { x, y, w: cw, h: 0.12, fill: { color: OCHRE }, line: { color: OCHRE } });
        s.addText(c.t, { x: x + 0.3, y: y + 0.35, w: cw - 0.6, h: 0.6, fontSize: 20, bold: true, fontFace: HEAD, color: NAVY });
        s.addText(c.d, { x: x + 0.3, y: y + 1.05, w: cw - 0.6, h: 1.4, fontSize: 14, fontFace: BODY, color: INK });
    });

    s.addText('Stockly resuelve los tres con un sistema ligero pero serio: control de concurrencia real, auth por roles y auditoría.', {
        x: 0.6, y: 5.0, w: SW - 1.2, h: 1.2,
        fontSize: 18, italic: true, fontFace: BODY, color: NAVY, align: 'center',
    });
}

// ---------- (3) La solución ----------
{
    const s = pptx.addSlide({ masterName: 'CONTENT' });
    kicker(s, 'PROPUESTA');
    title(s, 'Tres piezas, una sola API');

    const items = [
        { n: '01', t: 'Web PWA', d: 'Instalable en escritorio y móvil. JavaScript vanilla + Service Worker. Modo claro / oscuro.' },
        { n: '02', t: 'App Android nativa', d: 'Kotlin + Jetpack Compose. Diseñada para el flujo del operario de almacén.' },
        { n: '03', t: 'Backend + MySQL', d: 'Node.js / Express, JWT, MySQL 8. Stateless. Desplegado en Railway con HTTPS.' },
    ];
    items.forEach((it, i) => {
        const y = 1.6 + i * 1.55;
        panel(s, 0.6, y, SW - 1.2, 1.35);
        s.addShape(pptx.ShapeType.rect, { x: 0.6, y, w: 0.12, h: 1.35, fill: { color: OCHRE }, line: { color: OCHRE } });
        s.addText(it.n, { x: 0.9, y: y + 0.2, w: 1.1, h: 0.95, fontSize: 36, bold: true, fontFace: HEAD, color: OCHRE });
        s.addText(it.t, { x: 2.1, y: y + 0.18, w: 8, h: 0.5, fontSize: 20, bold: true, fontFace: HEAD, color: NAVY });
        s.addText(it.d, { x: 2.1, y: y + 0.7, w: SW - 2.7, h: 0.6, fontSize: 14, fontFace: BODY, color: INK });
    });
}

// ---------- (4) Objetivos ----------
{
    const s = pptx.addSlide({ masterName: 'CONTENT' });
    kicker(s, 'OBJETIVOS');
    title(s, '¿Qué nos propusimos?');

    // General
    panel(s, 0.6, 1.6, SW - 1.2, 1.3);
    s.addText('GENERAL', { x: 0.8, y: 1.7, w: 2, h: 0.3, fontSize: 10, bold: true, color: OCHRE, charSpacing: 4 });
    s.addText('Aplicación web con extensión móvil para gestionar inventario y reservas, con auth por roles, control de concurrencia y trazabilidad, desplegada en cloud y accesible públicamente.', {
        x: 0.8, y: 2.0, w: SW - 1.6, h: 0.85, fontSize: 15, fontFace: BODY, color: INK,
    });

    // Específicos en grid 2x2
    const specs = [
        '(a) Esquema relacional normalizado.',
        '(b) API REST con JWT y control de acceso por rol.',
        '(c) Reservas concurrentes consistentes: dos paralelas nunca superan el stock.',
        '(d) Frontend SPA instalable como PWA, con modo oscuro.',
        '(e) App Android nativa en Kotlin para el operario.',
        '(f) Despliegue cloud con HTTPS y dominio público.',
    ];
    s.addText('ESPECÍFICOS', { x: 0.6, y: 3.15, w: 4, h: 0.3, fontSize: 10, bold: true, color: OCHRE, charSpacing: 4 });
    const cw = 6.1, ch = 1.15, gap = 0.2;
    specs.forEach((t, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 0.6 + col * (cw + gap);
        const y = 3.5 + row * (ch + gap);
        panel(s, x, y, cw, ch);
        s.addShape(pptx.ShapeType.rect, { x, y, w: 0.08, h: ch, fill: { color: NAVY }, line: { color: NAVY } });
        s.addText(t, { x: x + 0.25, y: y + 0.15, w: cw - 0.4, h: ch - 0.3, fontSize: 13, fontFace: BODY, color: INK, valign: 'middle' });
    });
}

// ---------- (5) Stack ----------
{
    const s = pptx.addSlide({ masterName: 'CONTENT' });
    kicker(s, 'TECNOLOGÍAS');
    title(s, 'Stack del proyecto');

    const cols = [
        { t: 'Backend', items: ['Node.js 24 · Express 4', 'MySQL 8 · mysql2', 'JWT HS256 · bcrypt', 'helmet · cors · rate-limit', 'Vitest + Supertest'] },
        { t: 'Frontend', items: ['JavaScript ES2020 vanilla', 'CSS3 con design tokens', 'Service Worker', 'Web App Manifest', 'Modo claro / oscuro'] },
        { t: 'Android', items: ['Kotlin · Jetpack Compose', 'Retrofit + OkHttp', 'Navigation Compose', 'Encrypted SharedPrefs', 'Android Keystore'] },
        { t: 'Cloud / DevOps', items: ['Railway PaaS', 'Nixpacks', 'MySQL gestionado', 'HTTPS automático', 'Deploy continuo (push → deploy)'] },
    ];
    const cw = 2.95, gap = 0.25;
    const startX = (SW - (cw * 4 + gap * 3)) / 2;
    cols.forEach((c, i) => {
        const x = startX + i * (cw + gap);
        const y = 1.7;
        const h = 5.0;
        panel(s, x, y, cw, h);
        s.addShape(pptx.ShapeType.rect, { x, y, w: cw, h: 0.5, fill: { color: NAVY }, line: { color: NAVY } });
        s.addText(c.t, { x: x + 0.2, y: y + 0.05, w: cw - 0.4, h: 0.4, fontSize: 15, bold: true, fontFace: HEAD, color: 'FFFFFF' });
        s.addText(c.items.map(t => ({ text: t, options: { bullet: { code: '25A0' }, color: INK } })), {
            x: x + 0.25, y: y + 0.7, w: cw - 0.5, h: h - 0.85,
            fontSize: 13, fontFace: BODY, color: INK, paraSpaceAfter: 6, valign: 'top',
        });
    });
}

// ---------- (6) Arquitectura ----------
{
    const s = pptx.addSlide({ masterName: 'CONTENT' });
    kicker(s, 'ARQUITECTURA');
    title(s, 'Una API, dos clientes, un origen de verdad');

    // Cajas clientes
    const cy = 1.7;
    const cliW = 2.6, cliH = 1.2;
    const cli1X = 2.4, cli2X = SW - 2.4 - cliW;
    panel(s, cli1X, cy, cliW, cliH);
    s.addText('Navegador (PWA)', { x: cli1X, y: cy + 0.15, w: cliW, h: 0.4, fontSize: 16, bold: true, color: NAVY, align: 'center', fontFace: HEAD });
    s.addText('JS vanilla · Service Worker', { x: cli1X, y: cy + 0.6, w: cliW, h: 0.4, fontSize: 12, color: MUTED, align: 'center' });

    panel(s, cli2X, cy, cliW, cliH);
    s.addText('Android nativo', { x: cli2X, y: cy + 0.15, w: cliW, h: 0.4, fontSize: 16, bold: true, color: NAVY, align: 'center', fontFace: HEAD });
    s.addText('Kotlin · Jetpack Compose', { x: cli2X, y: cy + 0.6, w: cliW, h: 0.4, fontSize: 12, color: MUTED, align: 'center' });

    // Etiqueta HTTPS+JWT
    s.addText('HTTPS  ·  Authorization: Bearer <JWT>', {
        x: 2, y: 3.15, w: SW - 4, h: 0.4,
        fontSize: 12, bold: true, color: OCHRE, align: 'center', fontFace: MONO,
    });

    // Backend
    const bx = 2.4, by = 3.7, bw = SW - 4.8, bh = 1.3;
    panel(s, bx, by, bw, bh);
    s.addShape(pptx.ShapeType.rect, { x: bx, y: by, w: bw, h: 0.12, fill: { color: OCHRE }, line: { color: OCHRE } });
    s.addText('Backend Node.js + Express (stateless)', { x: bx, y: by + 0.2, w: bw, h: 0.5, fontSize: 18, bold: true, color: NAVY, align: 'center', fontFace: HEAD });
    s.addText('helmet · cors · rate-limit · JWT · requireRole   |   /api/auth · /api/productos · /api/categorias · /api/reservas · /api/admin', {
        x: bx + 0.2, y: by + 0.75, w: bw - 0.4, h: 0.5, fontSize: 11, color: INK, align: 'center', fontFace: BODY,
    });

    // BD
    const dx = (SW - 4) / 2, dy = 5.4, dw = 4, dh = 1.0;
    panel(s, dx, dy, dw, dh);
    s.addText('MySQL 8', { x: dx, y: dy + 0.15, w: dw, h: 0.4, fontSize: 17, bold: true, color: NAVY, align: 'center', fontFace: HEAD });
    s.addText('5 tablas · FK con ON DELETE · índices · ENUM', { x: dx, y: dy + 0.55, w: dw, h: 0.35, fontSize: 11, color: MUTED, align: 'center' });

    // Flechas (líneas finas)
    s.addShape(pptx.ShapeType.line, { x: cli1X + cliW / 2, y: cy + cliH, w: 0, h: 0.45, line: { color: MUTED, width: 1 } });
    s.addShape(pptx.ShapeType.line, { x: cli2X + cliW / 2, y: cy + cliH, w: 0, h: 0.45, line: { color: MUTED, width: 1 } });
    s.addShape(pptx.ShapeType.line, { x: SW / 2, y: by + bh, w: 0, h: 0.4, line: { color: MUTED, width: 1 } });
}

// ---------- (7) Modelo de datos ----------
{
    const s = pptx.addSlide({ masterName: 'CONTENT' });
    kicker(s, 'BASE DE DATOS');
    title(s, 'Modelo relacional · 5 tablas');

    const tables = [
        { t: 'usuarios', f: ['id PK', 'email UNIQUE', 'password_hash', 'rol ENUM', 'created_at'] },
        { t: 'categorias', f: ['id PK', 'nombre', 'slug'] },
        { t: 'productos', f: ['id PK', 'sku UNIQUE', 'nombre · precio', 'stock · stock_min', 'categoria_id FK'] },
        { t: 'reservas', f: ['id PK', 'usuario_id FK', 'producto_id FK', 'cantidad', 'estado ENUM'] },
        { t: 'movimientos', f: ['id PK', 'producto_id FK', 'tipo (entrada/salida)', 'cantidad · ts', 'usuario_id FK'] },
    ];
    const cw = 2.4, ch = 3.0, gap = 0.2;
    const startX = (SW - (cw * 5 + gap * 4)) / 2;
    tables.forEach((t, i) => {
        const x = startX + i * (cw + gap);
        const y = 1.7;
        panel(s, x, y, cw, ch);
        s.addShape(pptx.ShapeType.rect, { x, y, w: cw, h: 0.45, fill: { color: NAVY }, line: { color: NAVY } });
        s.addText(t.t, { x, y: y + 0.05, w: cw, h: 0.35, fontSize: 14, bold: true, color: 'FFFFFF', align: 'center', fontFace: MONO });
        s.addText(t.f.map(x => ({ text: x, options: { bullet: false, color: INK } })), {
            x: x + 0.2, y: y + 0.6, w: cw - 0.4, h: ch - 0.75,
            fontSize: 11, fontFace: MONO, color: INK, paraSpaceAfter: 4, valign: 'top',
        });
    });

    s.addText('Integridad en el motor: ENUM para estados · FK con ON DELETE explícito · índices secundarios sobre SKU, email y estado.', {
        x: 0.6, y: 5.3, w: SW - 1.2, h: 0.6,
        fontSize: 14, italic: true, color: NAVY, align: 'center', fontFace: BODY,
    });
}

// ---------- (8) Auth por roles ----------
{
    const s = pptx.addSlide({ masterName: 'CONTENT' });
    kicker(s, 'DECISIÓN CLAVE · 1 / 2');
    title(s, 'Autorización por roles en dos capas');

    // Izquierda: explicación
    bullets(s, [
        'Tres roles: cliente · operario · admin.',
        'Frontend oculta acciones por rol (UX).',
        'Backend aplica la barrera real con requireRole().',
        'El rol viaja firmado en el JWT: el cliente no puede modificarlo.',
        'Añadir una ruta protegida es UNA línea.',
    ], { x: 0.6, y: 1.6, w: 5.6, h: 4.5, fontSize: 16 });

    // Derecha: snippet
    const code =
`// backend/src/middleware/auth.js
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ error: 'No autenticado' });
        if (!roles.includes(req.user.rol))
            return res.status(403).json({ error: 'Permisos insuficientes' });
        next();
    };
}

// uso en una ruta:
router.delete('/:id',
    authRequired,
    requireRole('admin'),
    handler);`;
    codeBlock(s, code, { x: 6.5, y: 1.6, w: SW - 7.1, h: 5.2, fontSize: 13 });
}

// ---------- (9) Concurrencia ----------
{
    const s = pptx.addSlide({ masterName: 'CONTENT' });
    kicker(s, 'DECISIÓN CLAVE · 2 / 2');
    title(s, 'Concurrencia: dos reservas, una unidad');

    bullets(s, [
        'Escenario: dos clientes piden la última unidad a la vez.',
        'Solución: BLOQUEO PESIMISTA a nivel de fila en BD.',
        'Transacción → SELECT … FOR UPDATE sobre el producto.',
        'El segundo cliente espera; si el stock cae a 0, recibe HTTP 409.',
        'Cubierto por test automatizado de concurrencia simulada.',
    ], { x: 0.6, y: 1.6, w: 5.6, h: 4.5, fontSize: 16 });

    const code =
`// pseudo-flujo en POST /api/reservas
await conn.beginTransaction();
const [[p]] = await conn.execute(
    'SELECT stock FROM productos WHERE id = ? FOR UPDATE',
    [productoId]
);
if (p.stock < cantidad) {
    await conn.rollback();
    return res.status(409).json({
        error: 'Stock insuficiente'
    });
}
await conn.execute(
    'INSERT INTO reservas (...) VALUES (...)',
    [...]
);
await conn.commit();`;
    codeBlock(s, code, { x: 6.5, y: 1.6, w: SW - 7.1, h: 5.2, fontSize: 13 });
}

// ---------- (10) Frontend PWA ----------
{
    const s = pptx.addSlide({ masterName: 'CONTENT' });
    kicker(s, 'APLICACIÓN WEB');
    title(s, 'Frontend SPA · instalable como PWA');

    bullets(s, [
        'Un solo index.html, vistas que se intercambian con CSS.',
        'JavaScript ES2020 vanilla, sin framework. Bundle bajo control.',
        'Service Worker → arranque < 1 s en segundo acceso.',
        'Web App Manifest → instalable en escritorio y móvil.',
        'Modo claro / oscuro con design tokens en CSS.',
        'Wrapper api() centraliza JWT, errores y logout en 401.',
    ], { x: 0.6, y: 1.55, w: 6.5, h: 4.8, fontSize: 16 });

    // Lateral: pantallas
    const px = 7.4, py = 1.55, pw = 5.3, ph = 4.8;
    panel(s, px, py, pw, ph);
    s.addShape(pptx.ShapeType.rect, { x: px, y: py, w: pw, h: 0.45, fill: { color: NAVY }, line: { color: NAVY } });
    s.addText('Pantallas principales', { x: px + 0.2, y: py + 0.05, w: pw - 0.4, h: 0.35, fontSize: 14, bold: true, color: 'FFFFFF' });
    const scs = [
        ['Login', 'Todos'],
        ['Catálogo · filtros + búsqueda', 'Cliente / Operario'],
        ['Detalle producto + modal reserva', 'Cliente'],
        ['Mis reservas', 'Cliente'],
        ['Cola de reservas', 'Operario'],
        ['Dashboard KPIs · inventario · usuarios · CSV', 'Admin'],
    ];
    scs.forEach((row, i) => {
        const y = py + 0.6 + i * 0.66;
        s.addText(row[0], { x: px + 0.25, y, w: pw - 1.4, h: 0.35, fontSize: 13, bold: true, color: INK, fontFace: BODY });
        s.addText(row[1], { x: px + 0.25, y: y + 0.3, w: pw - 1.4, h: 0.3, fontSize: 11, color: MUTED, fontFace: BODY });
    });
}

// ---------- (11) App Android ----------
{
    const s = pptx.addSlide({ masterName: 'CONTENT' });
    kicker(s, 'APLICACIÓN MÓVIL');
    title(s, 'App Android nativa para el operario');

    // 4 pantallas
    const screens = [
        { t: 'Login', d: 'Email + contraseña → JWT. Sesión persistente.' },
        { t: 'Lista reservas', d: 'Activas por defecto. Cliente, producto, fecha, estado.' },
        { t: 'Detalle', d: 'Historial · botones Confirmar / Entregar contextuales.' },
        { t: 'Incidencia', d: 'Tipo (rotura / faltante / mal estado / otro) + texto.' },
    ];
    const cw = 2.95, ch = 2.2, gap = 0.25;
    const startX = (SW - (cw * 4 + gap * 3)) / 2;
    screens.forEach((sc, i) => {
        const x = startX + i * (cw + gap);
        const y = 1.6;
        panel(s, x, y, cw, ch);
        s.addText(String(i + 1).padStart(2, '0'), { x: x + 0.2, y: y + 0.15, w: 1, h: 0.5, fontSize: 22, bold: true, color: OCHRE, fontFace: HEAD });
        s.addText(sc.t, { x: x + 0.2, y: y + 0.7, w: cw - 0.4, h: 0.5, fontSize: 16, bold: true, color: NAVY, fontFace: HEAD });
        s.addText(sc.d, { x: x + 0.2, y: y + 1.15, w: cw - 0.4, h: ch - 1.3, fontSize: 12, color: INK, fontFace: BODY });
    });

    // Caja inferior técnica
    const by = 4.2, bh = 2.4;
    panel(s, 0.6, by, SW - 1.2, bh);
    s.addShape(pptx.ShapeType.rect, { x: 0.6, y: by, w: SW - 1.2, h: 0.45, fill: { color: NAVY }, line: { color: NAVY } });
    s.addText('Detalles técnicos', { x: 0.8, y: by + 0.05, w: 6, h: 0.35, fontSize: 14, bold: true, color: 'FFFFFF' });
    s.addText([
        { text: '• Kotlin + Jetpack Compose · Navigation Compose · single-activity.\n', options: {} },
        { text: '• Retrofit + OkHttp + AuthInterceptor (inyecta JWT en cada petición).\n', options: {} },
        { text: '• JWT cifrado con EncryptedSharedPreferences + Android Keystore.\n', options: {} },
        { text: '• BASE_URL por build variant: 10.0.2.2 (debug) / Railway (release).', options: {} },
    ], { x: 0.8, y: by + 0.6, w: SW - 1.6, h: bh - 0.75, fontSize: 13, color: INK, fontFace: BODY, paraSpaceAfter: 2 });
}

// ---------- (12) Despliegue ----------
{
    const s = pptx.addSlide({ masterName: 'CONTENT' });
    kicker(s, 'INFRAESTRUCTURA');
    title(s, 'Despliegue en Railway · deploy continuo');

    // Pipeline horizontal
    const steps = [
        { t: 'git push', s: 'main' },
        { t: 'Webhook', s: 'GitHub → Railway' },
        { t: 'Nixpacks', s: 'npm ci --omit=dev' },
        { t: 'Run', s: 'node server.js' },
        { t: 'HTTPS', s: 'subdominio público' },
    ];
    const sw = 2.2, sh2 = 1.1, gap = 0.25;
    const startX = (SW - (sw * 5 + gap * 4)) / 2;
    steps.forEach((st, i) => {
        const x = startX + i * (sw + gap);
        const y = 1.8;
        panel(s, x, y, sw, sh2);
        s.addText(st.t, { x, y: y + 0.1, w: sw, h: 0.4, fontSize: 16, bold: true, color: NAVY, align: 'center', fontFace: HEAD });
        s.addText(st.s, { x, y: y + 0.55, w: sw, h: 0.4, fontSize: 11, color: MUTED, align: 'center', fontFace: MONO });
        if (i < steps.length - 1) {
            s.addText('▶', { x: x + sw, y: y + 0.25, w: gap, h: 0.5, fontSize: 14, color: OCHRE, align: 'center' });
        }
    });

    // Variables de entorno + URLs
    panel(s, 0.6, 3.4, 6.0, 3.3);
    s.addShape(pptx.ShapeType.rect, { x: 0.6, y: 3.4, w: 6.0, h: 0.45, fill: { color: NAVY }, line: { color: NAVY } });
    s.addText('Variables de entorno', { x: 0.8, y: 3.45, w: 5, h: 0.35, fontSize: 13, bold: true, color: 'FFFFFF' });
    const envs = [
        ['MYSQL_URL', 'plugin MySQL de Railway'],
        ['JWT_SECRET', '≥ 256 bits (crypto.randomBytes)'],
        ['JWT_EXPIRES_IN', '8h'],
        ['CORS_ORIGIN', 'mismo origen'],
        ['NODE_ENV', 'production'],
    ];
    envs.forEach((e, i) => {
        const y = 4.0 + i * 0.5;
        s.addText(e[0], { x: 0.8, y, w: 2.3, h: 0.4, fontSize: 12, bold: true, fontFace: MONO, color: OCHRE });
        s.addText(e[1], { x: 3.1, y, w: 3.4, h: 0.4, fontSize: 12, color: INK, fontFace: BODY });
    });

    panel(s, 6.9, 3.4, SW - 7.5, 3.3);
    s.addShape(pptx.ShapeType.rect, { x: 6.9, y: 3.4, w: SW - 7.5, h: 0.45, fill: { color: NAVY }, line: { color: NAVY } });
    s.addText('Acceso público', { x: 7.1, y: 3.45, w: 5, h: 0.35, fontSize: 13, bold: true, color: 'FFFFFF' });
    const urls = [
        ['Web (PWA)', 'tfgdam-production.up.railway.app/'],
        ['API REST', 'tfgdam-production.up.railway.app/api/'],
        ['Health', 'tfgdam-production.up.railway.app/api/health'],
    ];
    urls.forEach((u, i) => {
        const y = 4.0 + i * 0.85;
        s.addText(u[0], { x: 7.1, y, w: 2.3, h: 0.35, fontSize: 12, bold: true, color: NAVY });
        s.addText(u[1], { x: 7.1, y: y + 0.32, w: SW - 7.7, h: 0.45, fontSize: 12, fontFace: MONO, color: OCHRE });
    });
}

// ---------- (13) Pruebas y resultados ----------
{
    const s = pptx.addSlide({ masterName: 'CONTENT' });
    kicker(s, 'CALIDAD & RESULTADOS');
    title(s, 'Pruebas, métricas y entregables');

    // 4 stats grandes
    const stats = [
        { n: '500', l: 'productos · catálogo seed' },
        { n: '< 200 ms', l: 'listado catálogo' },
        { n: '3', l: 'roles · auth por capas' },
        { n: '3', l: 'suites Vitest sobre flujos críticos' },
    ];
    const cw = 2.95, ch = 1.7, gap = 0.25;
    const startX = (SW - (cw * 4 + gap * 3)) / 2;
    stats.forEach((st, i) => {
        const x = startX + i * (cw + gap);
        const y = 1.6;
        panel(s, x, y, cw, ch);
        s.addShape(pptx.ShapeType.rect, { x, y: y + ch - 0.08, w: cw, h: 0.08, fill: { color: OCHRE }, line: { color: OCHRE } });
        s.addText(st.n, { x, y: y + 0.15, w: cw, h: 0.95, fontSize: 44, bold: true, color: NAVY, align: 'center', fontFace: HEAD });
        s.addText(st.l, { x: x + 0.15, y: y + 1.1, w: cw - 0.3, h: 0.5, fontSize: 12, color: MUTED, align: 'center', fontFace: BODY });
    });

    // Dos columnas: Tests / Funcional
    panel(s, 0.6, 3.6, 6.1, 3.1);
    s.addShape(pptx.ShapeType.rect, { x: 0.6, y: 3.6, w: 6.1, h: 0.45, fill: { color: NAVY }, line: { color: NAVY } });
    s.addText('Tests automatizados', { x: 0.8, y: 3.65, w: 5, h: 0.35, fontSize: 14, bold: true, color: 'FFFFFF' });
    s.addText([
        { text: 'auth.test.js — registro, login, JWT, rate limit.', options: { bullet: { code: '25A0' }, color: INK } },
        { text: 'productos.test.js — CRUD, filtros, paginación, roles.', options: { bullet: { code: '25A0' }, color: INK } },
        { text: 'reservas.test.js — stock + CONCURRENCIA SIMULADA.', options: { bullet: { code: '25A0' }, color: INK } },
        { text: 'Stack: Vitest + Supertest contra BD real.', options: { bullet: { code: '25A0' }, color: INK } },
    ], { x: 0.8, y: 4.15, w: 5.7, h: 2.4, fontSize: 13, color: INK, paraSpaceAfter: 6 });

    panel(s, 6.85, 3.6, SW - 7.45, 3.1);
    s.addShape(pptx.ShapeType.rect, { x: 6.85, y: 3.6, w: SW - 7.45, h: 0.45, fill: { color: NAVY }, line: { color: NAVY } });
    s.addText('Funcionalidades entregadas', { x: 7.05, y: 3.65, w: 5, h: 0.35, fontSize: 14, bold: true, color: 'FFFFFF' });
    s.addText([
        { text: 'Dashboard de KPIs agregados.', options: { bullet: { code: '25A0' }, color: INK } },
        { text: 'Importación y exportación CSV.', options: { bullet: { code: '25A0' }, color: INK } },
        { text: 'Albarán A4 imprimible al entregar.', options: { bullet: { code: '25A0' }, color: INK } },
        { text: 'Modo oscuro · instalador Windows · APK Android.', options: { bullet: { code: '25A0' }, color: INK } },
    ], { x: 7.05, y: 4.15, w: SW - 7.85, h: 2.4, fontSize: 13, color: INK, paraSpaceAfter: 6 });
}

// ---------- (14) Demo ----------
{
    const s = pptx.addSlide({ masterName: 'CONTENT' });
    s.background = { color: NAVY_DARK };
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: SW, h: 0.08, fill: { color: OCHRE }, line: { color: OCHRE } });
    s.addText('DEMO EN VIVO', {
        x: 0.5, y: 2.0, w: SW - 1, h: 0.5,
        fontSize: 14, bold: true, color: OCHRE, charSpacing: 6, align: 'center', fontFace: HEAD,
    });
    s.addText('2 — 3 minutos', {
        x: 0.5, y: 2.6, w: SW - 1, h: 1.2,
        fontSize: 64, bold: true, color: 'FFFFFF', align: 'center', fontFace: HEAD,
    });
    s.addText([
        { text: '①  ', options: { color: OCHRE, bold: true } },
        { text: 'Cliente  ', options: { color: 'FFFFFF', bold: true } },
        { text: '— login, catálogo, reservar.                ', options: { color: 'CADCFC' } },
        { text: '②  ', options: { color: OCHRE, bold: true } },
        { text: 'Operario  ', options: { color: 'FFFFFF', bold: true } },
        { text: '— cola, confirmar, entregar.\n', options: { color: 'CADCFC' } },
        { text: '③  ', options: { color: OCHRE, bold: true } },
        { text: 'Admin  ', options: { color: 'FFFFFF', bold: true } },
        { text: '— dashboard KPIs.                ', options: { color: 'CADCFC' } },
        { text: '④  ', options: { color: OCHRE, bold: true } },
        { text: 'Android  ', options: { color: 'FFFFFF', bold: true } },
        { text: '— lista, detalle, incidencia.', options: { color: 'CADCFC' } },
    ], { x: 1.2, y: 4.3, w: SW - 2.4, h: 1.6, fontSize: 16, fontFace: BODY, align: 'center', paraSpaceAfter: 8 });
    s.addText('Plan B: capturas en las slides anteriores.', {
        x: 0.5, y: 6.4, w: SW - 1, h: 0.4, fontSize: 12, italic: true, color: 'CADCFC', align: 'center', fontFace: BODY,
    });
}

// ---------- (15) Conclusiones ----------
{
    const s = pptx.addSlide({ masterName: 'CONTENT' });
    kicker(s, 'CIERRE');
    title(s, 'Conclusiones y mejoras futuras');

    panel(s, 0.6, 1.55, 6.1, 5.15);
    s.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.55, w: 6.1, h: 0.45, fill: { color: NAVY }, line: { color: NAVY } });
    s.addText('Objetivos cumplidos', { x: 0.8, y: 1.6, w: 5, h: 0.35, fontSize: 14, bold: true, color: 'FFFFFF' });
    s.addText([
        { text: 'API REST con JWT y control por roles.', options: { bullet: { code: '2713' }, color: INK } },
        { text: 'Reservas concurrentes consistentes (FOR UPDATE).', options: { bullet: { code: '2713' }, color: INK } },
        { text: 'Frontend SPA instalable como PWA, modo oscuro.', options: { bullet: { code: '2713' }, color: INK } },
        { text: 'App Android nativa funcional para el operario.', options: { bullet: { code: '2713' }, color: INK } },
        { text: 'Despliegue cloud público con HTTPS.', options: { bullet: { code: '2713' }, color: INK } },
        { text: 'Tests automatizados sobre flujos críticos.', options: { bullet: { code: '2713' }, color: INK } },
    ], { x: 0.85, y: 2.15, w: 5.65, h: 4.4, fontSize: 14, color: INK, paraSpaceAfter: 8 });

    panel(s, 6.85, 1.55, SW - 7.45, 5.15);
    s.addShape(pptx.ShapeType.rect, { x: 6.85, y: 1.55, w: SW - 7.45, h: 0.45, fill: { color: OCHRE }, line: { color: OCHRE } });
    s.addText('Mejoras futuras', { x: 7.05, y: 1.6, w: 5, h: 0.35, fontSize: 14, bold: true, color: 'FFFFFF' });
    s.addText([
        { text: 'Documentación OpenAPI / Swagger.', options: { bullet: { code: '25B8' }, color: INK } },
        { text: 'Validación centralizada con Zod.', options: { bullet: { code: '25B8' }, color: INK } },
        { text: 'Workflow formal en GitHub Actions.', options: { bullet: { code: '25B8' }, color: INK } },
        { text: 'Escáner de código de barras (CameraX + ML Kit).', options: { bullet: { code: '25B8' }, color: INK } },
        { text: 'Cola offline con Room en la app Android.', options: { bullet: { code: '25B8' }, color: INK } },
        { text: 'BiometricPrompt antes de exponer la sesión.', options: { bullet: { code: '25B8' }, color: INK } },
        { text: 'Accesibilidad WCAG AA completa.', options: { bullet: { code: '25B8' }, color: INK } },
    ], { x: 7.1, y: 2.15, w: SW - 7.7, h: 4.4, fontSize: 14, color: INK, paraSpaceAfter: 8 });
}

// ---------- (Cierre/Gracias) — opcional, lo dejamos como 16 ----------
{
    const s = pptx.addSlide();
    s.background = { color: NAVY_DARK };
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.25, h: SH, fill: { color: OCHRE }, line: { color: OCHRE } });
    s.addText('Gracias.', {
        x: 0.9, y: 2.4, w: 11, h: 1.4, fontSize: 96, bold: true, color: 'FFFFFF', fontFace: HEAD,
    });
    s.addText('¿Preguntas?', {
        x: 0.9, y: 3.9, w: 11, h: 0.7, fontSize: 28, color: 'CADCFC', fontFace: HEAD,
    });
    s.addShape(pptx.ShapeType.rect, { x: 0.95, y: 4.75, w: 1.2, h: 0.04, fill: { color: OCHRE }, line: { color: OCHRE } });
    s.addText([
        { text: 'Web · ', options: { color: 'CADCFC' } },
        { text: 'https://tfgdam-production.up.railway.app/', options: { color: 'FFFFFF', bold: true, fontFace: MONO } },
    ], { x: 0.95, y: 4.9, w: 11, h: 0.5, fontSize: 16, fontFace: BODY });
    s.addText('Adrián Bravo Santos  ·  Miguel Ángel Florido  ·  Tutor: Damián Sualdea Soy', {
        x: 0.95, y: 6.5, w: 11, h: 0.4, fontSize: 12, italic: true, color: 'CADCFC', fontFace: BODY,
    });
}

pptx.writeFile({ fileName: OUT }).then(p => {
    console.log('OK ->', p);
}).catch(err => {
    console.error('ERROR', err);
    process.exit(1);
});
