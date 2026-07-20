/* ============================================================
   CacaoDirecto - Prototipo funcional (HTML/CSS/JS vanilla)
   Persistencia: localStorage. Sin backend, sin librerías.
   ============================================================ */

const LB_POR_TONELADA = 2204.62;

// ---- Datos semilla (estado inicial del demo) ----
const USUARIOS_SEED = [
    { email: 'admin@cacaodirecto.ec',        password: 'admin123',     nombre: 'Administrador',       rol: 'admin' },
    { email: 'maria@cacaodirecto.ec',        password: 'productor123', nombre: 'María Vega',          rol: 'productor' },
    { email: 'chocolatera@cacaodirecto.ec',  password: 'comprador123', nombre: 'Chocolatería Andina', rol: 'comprador' }
];

const CONFIG_SEED = {
    precioRefTon: 5900,        // Tonelada internacional (USD) - jul 2026
    castigoTon: 700,           // Diferencial/castigo a Ecuador (USD/ton)
    precioIntermediario: 1.00, // Lo que paga el intermediario en Shushufindi (USD/lb)
    precioMinimo: 2.00         // Precio mínimo garantizado CacaoDirecto (USD/lb)
};

// Imágenes 100% offline: SVG de una mazorca de cacao generado en código (sin internet).
function svgCacao(c1, c2, accent, label) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260">` +
        `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
        `<stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>` +
        `<rect width="400" height="260" fill="url(#g)"/>` +
        `<g transform="translate(200,118)">` +
        `<ellipse cx="0" cy="0" rx="58" ry="92" fill="${accent}" stroke="#5a3418" stroke-width="4"/>` +
        `<path d="M0,-88 Q-12,0 0,88" stroke="#5a3418" stroke-width="3" fill="none" opacity="0.5"/>` +
        `<path d="M-28,-82 Q-38,0 -26,82" stroke="#5a3418" stroke-width="2" fill="none" opacity="0.35"/>` +
        `<path d="M28,-82 Q38,0 26,82" stroke="#5a3418" stroke-width="2" fill="none" opacity="0.35"/></g>` +
        `<text x="200" y="238" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" ` +
        `font-size="20" font-weight="bold" fill="#ffffff" opacity="0.92">${label}</text></svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

const IMG1 = svgCacao('#6B4423', '#A0724E', '#D4A574', 'Cacao Premium');
const IMG2 = svgCacao('#2E7D32', '#1B5E20', '#D4A574', 'Cacao Orgánico');
const IMG3 = svgCacao('#8A5A2B', '#6B4423', '#C9974F', 'Cacao Fermentado');

const LOTES_SEED = [
    { id: 1, codigo: "CD-SHU-2026-001", titulo: "Cacao Nacional Fino de Aroma", agricultor: "María Vega", ownerEmail: "maria@cacaodirecto.ec", finca: "Finca La Esperanza", ubicacion: "San Pedro de Shushufindi", cantidadLb: 500, tipo: "premium", diasFermentacion: 6, fechaCosecha: "2026-06-15", precio: 2.50, imagen: IMG1, certificaciones: ["Fino de Aroma"], organico: false },
    { id: 2, codigo: "CD-SHU-2026-002", titulo: "Cacao Orgánico Certificado", agricultor: "Carmen Yumbo", ownerEmail: "carmen@cacaodirecto.ec", finca: "Finca El Progreso", ubicacion: "Shushufindi Centro", cantidadLb: 300, tipo: "organico", diasFermentacion: 7, fechaCosecha: "2026-06-20", precio: 2.80, imagen: IMG2, certificaciones: ["Orgánico", "Fino de Aroma"], organico: true },
    { id: 3, codigo: "CD-SHU-2026-003", titulo: "Cacao Fermentado 5 Días", agricultor: "Arturo Caiza", ownerEmail: "arturo@cacaodirecto.ec", finca: "Asociación San Pedro", ubicacion: "Asociación San Pedro", cantidadLb: 800, tipo: "fermentado", diasFermentacion: 5, fechaCosecha: "2026-06-10", precio: 2.30, imagen: IMG3, certificaciones: ["Comercio Justo"], organico: false },
    { id: 4, codigo: "CD-SHU-2026-004", titulo: "Cacao Premium Seleccionado", agricultor: "José Andi", ownerEmail: "jose@cacaodirecto.ec", finca: "Finca Kawsak", ubicacion: "Zona Norte Shushufindi", cantidadLb: 450, tipo: "premium", diasFermentacion: 6, fechaCosecha: "2026-06-18", precio: 2.60, imagen: IMG1, certificaciones: ["Fino de Aroma"], organico: false },
    { id: 5, codigo: "CD-SHU-2026-005", titulo: "Cacao Tradicional Amazónico", agricultor: "Rosa Chimbo", ownerEmail: "rosa@cacaodirecto.ec", finca: "Comunidad La Unión", ubicacion: "Comunidad La Unión", cantidadLb: 600, tipo: "fermentado", diasFermentacion: 4, fechaCosecha: "2026-06-12", precio: 2.20, imagen: IMG2, certificaciones: [], organico: false },
    { id: 6, codigo: "CD-SHU-2026-006", titulo: "Cacao Orgánico Premium", agricultor: "María Vega", ownerEmail: "maria@cacaodirecto.ec", finca: "Finca La Esperanza", ubicacion: "San Pedro de Shushufindi", cantidadLb: 400, tipo: "organico", diasFermentacion: 8, fechaCosecha: "2026-06-25", precio: 3.00, imagen: IMG1, certificaciones: ["Orgánico", "Premium"], organico: true }
];

const PRODUCTORES_ACTIVOS = 1200;

// ---- Helpers de localStorage ----
function getUsuarios() { return JSON.parse(localStorage.getItem('cd_usuarios')) || []; }
function setUsuarios(u) { localStorage.setItem('cd_usuarios', JSON.stringify(u)); }
function getLotes() { return JSON.parse(localStorage.getItem('cd_lotes')) || []; }
function setLotes(l) { localStorage.setItem('cd_lotes', JSON.stringify(l)); }
function getConfig() { return JSON.parse(localStorage.getItem('cd_config')) || { ...CONFIG_SEED }; }
function setConfig(c) { localStorage.setItem('cd_config', JSON.stringify(c)); }
function getSession() { return JSON.parse(localStorage.getItem('cd_session')) || null; }
function setSession(s) { localStorage.setItem('cd_session', JSON.stringify(s)); }
function clearSession() { localStorage.removeItem('cd_session'); }

// Versión de datos: si cambia, se re-siembra automáticamente (p.ej. imágenes nuevas offline)
const DATA_VERSION = '2';

// ---- Inicialización de datos ----
function initData() {
    if (localStorage.getItem('cd_version') !== DATA_VERSION) {
        setUsuarios(USUARIOS_SEED);
        setLotes(LOTES_SEED);
        setConfig({ ...CONFIG_SEED });
        localStorage.setItem('cd_version', DATA_VERSION);
        return;
    }
    if (!localStorage.getItem('cd_usuarios')) setUsuarios(USUARIOS_SEED);
    if (!localStorage.getItem('cd_lotes')) setLotes(LOTES_SEED);
    if (!localStorage.getItem('cd_config')) setConfig({ ...CONFIG_SEED });
}

function reiniciarDemo() {
    if (!confirm('¿Reiniciar todos los datos demo al estado inicial? Se perderán los lotes y usuarios creados durante la sesión.')) return;
    setUsuarios(USUARIOS_SEED);
    setLotes(LOTES_SEED);
    setConfig({ ...CONFIG_SEED });
    clearSession();
    cerrarPanel();
    actualizarNav();
    cargarProductos('todos');
    renderComparador();
    alert('✅ Datos demo reiniciados.');
}

// ---- Cálculo de precios ----
function calcularPrecios(cfg) {
    cfg = cfg || getConfig();
    const internacionalLb = (cfg.precioRefTon - cfg.castigoTon) / LB_POR_TONELADA;
    const sugeridoLb = Math.max(cfg.precioMinimo, internacionalLb);
    return {
        intermediario: cfg.precioIntermediario,
        cacaoDirecto: sugeridoLb,
        internacional: internacionalLb
    };
}

// ============================================================
//  COMPARADOR DE PRECIOS (gráfico de barras CSS puro)
// ============================================================
function renderComparador() {
    const chart = document.getElementById('comparadorChart');
    const resumen = document.getElementById('comparadorResumen');
    if (!chart) return;

    const p = calcularPrecios();
    const barras = [
        { label: 'Intermediario', valor: p.intermediario, clase: 'bar-intermediario', nota: 'Shushufindi' },
        { label: 'CacaoDirecto', valor: p.cacaoDirecto, clase: 'bar-cacao', nota: 'Precio justo' },
        { label: 'Internacional', valor: p.internacional, clase: 'bar-internacional', nota: 'Referencia bolsa' }
    ];
    const maxVal = Math.max(...barras.map(b => b.valor));

    chart.innerHTML = barras.map(b => {
        const altura = Math.max(8, (b.valor / maxVal) * 100);
        return `
            <div class="bar">
                <div class="bar-track">
                    <div class="bar-fill ${b.clase}" style="height:${altura}%;">
                        <span class="bar-valor">$${b.valor.toFixed(2)}</span>
                    </div>
                </div>
                <div class="bar-label">${b.label}<br><small>${b.nota}</small></div>
            </div>`;
    }).join('');

    const mejora = Math.round(((p.cacaoDirecto - p.intermediario) / p.intermediario) * 100);
    resumen.innerHTML = `
        <div class="mejora-badge">+${mejora}%</div>
        <p>Con CacaoDirecto el productor recibe <strong>$${p.cacaoDirecto.toFixed(2)}/lb</strong>
        en vez de <strong>$${p.intermediario.toFixed(2)}/lb</strong> del intermediario.</p>
        <p class="mejora-nota">Referencia internacional: $${p.internacional.toFixed(2)}/lb
        (tonelada $${getConfig().precioRefTon.toLocaleString('es-EC')} − castigo $${getConfig().castigoTon}).</p>`;
}

// ============================================================
//  MARKETPLACE
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initData();
    actualizarNav();
    cargarProductos('todos');
    renderComparador();
});

function cargarProductos(filtro) {
    const grid = document.getElementById('productosGrid');
    if (!grid) return;
    grid.innerHTML = '';

    let lotes = getLotes();
    if (filtro && filtro !== 'todos') {
        lotes = lotes.filter(l => l.tipo === filtro);
    }

    if (lotes.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">No hay lotes en esta categoría.</p>';
        return;
    }
    grid.innerHTML = lotes.map(crearCardProducto).join('');
}

function crearCardProducto(lote) {
    let badgeHTML = '';
    if (lote.tipo === 'premium') badgeHTML = '<span class="badge premium">Premium</span>';
    else if (lote.tipo === 'organico') badgeHTML = '<span class="badge organico">Orgánico</span>';
    else if (lote.tipo === 'fermentado') badgeHTML = '<span class="badge">Fermentado</span>';

    return `
        <div class="producto-card">
            <img src="${lote.imagen}" alt="${lote.titulo}" class="producto-img" onerror="this.style.display='none'">
            <div class="producto-info">
                <div class="producto-agricultor">
                    <span>👨‍🌾</span>
                    <span>${lote.agricultor}</span>
                    <span class="codigo-traza">${lote.codigo}</span>
                </div>
                <h3 class="producto-titulo">${lote.titulo}</h3>
                <p class="producto-detalles">
                    📍 ${lote.ubicacion}<br>
                    📦 ${lote.cantidadLb} libras disponibles
                </p>
                <div class="producto-precio">
                    <span class="precio">$${Number(lote.precio).toFixed(2)}/lb</span>
                    ${badgeHTML}
                </div>
                <button class="btn-secondary" style="width:100%; margin-top:1rem;" onclick="verTrazabilidad(${lote.id})">
                    🔎 Ver Trazabilidad
                </button>
                <button class="btn-primary" style="width:100%; margin-top:0.5rem;" onclick="contactarAgricultor(${lote.id})">
                    Contactar Productor
                </button>
            </div>
        </div>`;
}

function filtrarCacao(tipo) {
    document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
    if (window.event && window.event.target) window.event.target.classList.add('active');
    cargarProductos(tipo);
}

// ============================================================
//  TRAZABILIDAD
// ============================================================
function verTrazabilidad(loteId) {
    const lote = getLotes().find(l => l.id === loteId);
    if (!lote) return;
    const certs = (lote.certificaciones && lote.certificaciones.length)
        ? lote.certificaciones.map(c => `<span class="cert-chip">${c}</span>`).join(' ')
        : '<span class="cert-chip vacio">Sin certificaciones registradas</span>';

    document.getElementById('trazaContenido').innerHTML = `
        <div class="traza-codigo">${lote.codigo}</div>
        <h2>${lote.titulo}</h2>
        <ul class="traza-lista">
            <li><span>👨‍🌾 Productor</span><strong>${lote.agricultor}</strong></li>
            <li><span>🏡 Finca</span><strong>${lote.finca || '—'}</strong></li>
            <li><span>📍 Ubicación</span><strong>${lote.ubicacion}</strong></li>
            <li><span>📅 Fecha de cosecha</span><strong>${lote.fechaCosecha || '—'}</strong></li>
            <li><span>⏳ Días de fermentación</span><strong>${lote.diasFermentacion} días</strong></li>
            <li><span>📦 Cantidad</span><strong>${lote.cantidadLb} libras</strong></li>
            <li><span>💵 Precio</span><strong>$${Number(lote.precio).toFixed(2)}/lb</strong></li>
        </ul>
        <div class="traza-certs"><strong>Certificaciones:</strong><br>${certs}</div>
        <button class="btn-primary" style="width:100%; margin-top:1rem;" onclick="cerrarModal('modalTraza'); contactarAgricultor(${lote.id});">
            Contactar Productor
        </button>`;
    document.getElementById('modalTraza').style.display = 'block';
}

function contactarAgricultor(loteId) {
    const lote = getLotes().find(l => l.id === loteId);
    if (lote) {
        alert(`Contactando a ${lote.agricultor} (${lote.codigo})...\n\n` +
              `"¡Hola! Estoy interesado en tu ${lote.titulo} (${lote.cantidadLb} libras a $${Number(lote.precio).toFixed(2)}/lb). ¿Podemos hablar?"\n\n` +
              `En producción esto abriría WhatsApp con el productor.`);
    }
}

// ============================================================
//  AUTENTICACIÓN Y NAVEGACIÓN
// ============================================================
function mostrarLogin() { document.getElementById('modalLogin').style.display = 'block'; }
function mostrarRegistro() { document.getElementById('modalRegistro').style.display = 'block'; }
function cerrarModal(modalId) { document.getElementById(modalId).style.display = 'none'; }

function rellenarDemo(email, pass) {
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginPassword').value = pass;
}

window.onclick = function(event) {
    document.querySelectorAll('.modal').forEach(modal => {
        if (event.target === modal) modal.style.display = 'none';
    });
};

function iniciarSesion(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pass = document.getElementById('loginPassword').value;
    const user = getUsuarios().find(u => u.email.toLowerCase() === email && u.password === pass);
    if (!user) {
        alert('❌ Correo o contraseña incorrectos.\n\nPrueba con los usuarios demo (botones bajo el formulario).');
        return;
    }
    setSession({ email: user.email, nombre: user.nombre, rol: user.rol });
    cerrarModal('modalLogin');
    document.getElementById('loginPassword').value = '';
    actualizarNav();
    abrirPanel();
}

function registrarse(event) {
    event.preventDefault();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const usuarios = getUsuarios();
    if (usuarios.some(u => u.email.toLowerCase() === email)) {
        alert('Ese correo ya está registrado. Inicia sesión.');
        return;
    }
    const nuevo = {
        email: email,
        password: document.getElementById('regPassword').value,
        nombre: document.getElementById('regNombre').value.trim(),
        rol: document.getElementById('regRol').value
    };
    usuarios.push(nuevo);
    setUsuarios(usuarios);
    setSession({ email: nuevo.email, nombre: nuevo.nombre, rol: nuevo.rol });
    cerrarModal('modalRegistro');
    event.target.reset();
    actualizarNav();
    abrirPanel();
    alert('✅ Cuenta creada. ¡Bienvenido/a a CacaoDirecto!');
}

function cerrarSesion() {
    clearSession();
    cerrarPanel();
    actualizarNav();
}

function actualizarNav() {
    const s = getSession();
    const logueado = !!s;
    document.getElementById('btnLogin').style.display = logueado ? 'none' : '';
    document.getElementById('btnRegistro').style.display = logueado ? 'none' : '';
    document.getElementById('btnPanel').style.display = logueado ? '' : 'none';
    document.getElementById('btnLogout').style.display = logueado ? '' : 'none';
    const badge = document.getElementById('userBadge');
    if (logueado) {
        const iconos = { admin: '👤', productor: '🌱', comprador: '🏭' };
        badge.style.display = '';
        badge.textContent = `${iconos[s.rol] || '👋'} ${s.nombre}`;
    } else {
        badge.style.display = 'none';
    }
}

// ============================================================
//  PANEL / DASHBOARDS POR ROL
// ============================================================
function abrirPanel() {
    const s = getSession();
    if (!s) { mostrarLogin(); return; }
    const titulos = { admin: 'Panel de Administración', productor: 'Panel del Productor', comprador: 'Panel del Comprador' };
    document.getElementById('panelTitulo').textContent = titulos[s.rol] || 'Panel';
    document.getElementById('panelSubtitulo').textContent = `${s.nombre} · ${s.email}`;

    if (s.rol === 'admin') renderAdmin();
    else if (s.rol === 'productor') renderProductor();
    else renderComprador();

    document.getElementById('panel').style.display = 'block';
}
function cerrarPanel() { document.getElementById('panel').style.display = 'none'; }

// ----- ADMIN -----
function renderAdmin() {
    const lotes = getLotes();
    const cfg = getConfig();
    const p = calcularPrecios(cfg);
    const volumenLb = lotes.reduce((a, l) => a + Number(l.cantidadLb), 0);
    const valorTotal = lotes.reduce((a, l) => a + Number(l.cantidadLb) * Number(l.precio), 0);
    const comision = valorTotal * 0.04;

    document.getElementById('panelContent').innerHTML = `
        <div class="metric-grid">
            <div class="metric-card"><div class="metric-num">${PRODUCTORES_ACTIVOS.toLocaleString('es-EC')}</div><div class="metric-lbl">Productores activos</div></div>
            <div class="metric-card"><div class="metric-num">${lotes.length}</div><div class="metric-lbl">Lotes publicados</div></div>
            <div class="metric-card"><div class="metric-num">${volumenLb.toLocaleString('es-EC')} lb</div><div class="metric-lbl">Volumen transado (${(volumenLb/LB_POR_TONELADA).toFixed(1)} ton)</div></div>
            <div class="metric-card destacada"><div class="metric-num">$${comision.toLocaleString('es-EC',{maximumFractionDigits:0})}</div><div class="metric-lbl">Comisión 4% generada</div></div>
        </div>

        <div class="panel-card">
            <h3>Precio de referencia internacional</h3>
            <p class="panel-hint">Cambia estos valores y recalcula: el precio sugerido por libra y el comparador del inicio se actualizan.</p>
            <div class="config-form">
                <label>Tonelada internacional (USD)
                    <input type="number" id="cfgRefTon" value="${cfg.precioRefTon}" min="0" step="50">
                </label>
                <label>Castigo/diferencial a Ecuador (USD/ton)
                    <input type="number" id="cfgCastigo" value="${cfg.castigoTon}" min="0" step="10">
                </label>
                <label>Precio mínimo garantizado (USD/lb)
                    <input type="number" id="cfgMinimo" value="${cfg.precioMinimo}" min="0" step="0.05">
                </label>
                <button class="btn-primary" onclick="guardarConfigAdmin()">Recalcular</button>
            </div>
            <div class="precio-sugerido">
                Precio sugerido por libra:
                <strong id="adminSugerido">$${p.cacaoDirecto.toFixed(2)}/lb</strong>
                <span>(equivalente internacional: $${p.internacional.toFixed(2)}/lb)</span>
            </div>
        </div>

        <div class="panel-card">
            <h3>Todos los lotes</h3>
            ${tablaLotesAdmin(lotes)}
        </div>`;
}

function tablaLotesAdmin(lotes) {
    return `<div class="tabla-wrap"><table class="tabla-lotes">
        <thead><tr><th>Código</th><th>Productor</th><th>Cantidad</th><th>Precio</th><th>Valor lote</th></tr></thead>
        <tbody>${lotes.map(l => `<tr>
            <td>${l.codigo}</td><td>${l.agricultor}</td><td>${l.cantidadLb} lb</td>
            <td>$${Number(l.precio).toFixed(2)}</td>
            <td>$${(l.cantidadLb*l.precio).toLocaleString('es-EC',{maximumFractionDigits:0})}</td>
        </tr>`).join('')}</tbody></table></div>`;
}

function guardarConfigAdmin() {
    const cfg = getConfig();
    cfg.precioRefTon = Number(document.getElementById('cfgRefTon').value) || cfg.precioRefTon;
    cfg.castigoTon = Number(document.getElementById('cfgCastigo').value) || 0;
    cfg.precioMinimo = Number(document.getElementById('cfgMinimo').value) || cfg.precioMinimo;
    setConfig(cfg);
    const p = calcularPrecios(cfg);
    document.getElementById('adminSugerido').textContent = `$${p.cacaoDirecto.toFixed(2)}/lb`;
    renderComparador();
    renderAdmin(); // refresca vista con nuevos valores
    alert(`✅ Precio sugerido recalculado: $${p.cacaoDirecto.toFixed(2)}/lb`);
}

// ----- PRODUCTOR -----
function renderProductor() {
    const s = getSession();
    const misLotes = getLotes().filter(l => l.ownerEmail === s.email);
    const cfg = getConfig();

    const totalLb = misLotes.reduce((a, l) => a + Number(l.cantidadLb), 0);
    const ingresoCacao = misLotes.reduce((a, l) => a + Number(l.cantidadLb) * Number(l.precio), 0);
    const ingresoIntermediario = totalLb * cfg.precioIntermediario;
    const diferencia = ingresoCacao - ingresoIntermediario;

    document.getElementById('panelContent').innerHTML = `
        <button class="btn-primary" onclick="cerrarPanel(); mostrarModalLote();" style="margin-bottom:1.5rem;">➕ Publicar nuevo lote</button>

        <div class="metric-grid">
            <div class="metric-card"><div class="metric-num">${misLotes.length}</div><div class="metric-lbl">Mis lotes</div></div>
            <div class="metric-card"><div class="metric-num">${totalLb.toLocaleString('es-EC')} lb</div><div class="metric-lbl">Volumen publicado</div></div>
            <div class="metric-card destacada"><div class="metric-num">$${ingresoCacao.toLocaleString('es-EC',{maximumFractionDigits:0})}</div><div class="metric-lbl">Ingreso con CacaoDirecto</div></div>
        </div>

        <div class="panel-card comparativa-ingresos">
            <h3>Tus ingresos vs. intermediario</h3>
            <div class="ing-fila"><span>🏭 Con intermediario ($${cfg.precioIntermediario.toFixed(2)}/lb)</span><strong class="ing-malo">$${ingresoIntermediario.toLocaleString('es-EC',{maximumFractionDigits:0})}</strong></div>
            <div class="ing-fila"><span>🌱 Con CacaoDirecto</span><strong class="ing-bueno">$${ingresoCacao.toLocaleString('es-EC',{maximumFractionDigits:0})}</strong></div>
            <div class="ing-fila total"><span>💰 Ganas de más</span><strong class="ing-bueno">+$${diferencia.toLocaleString('es-EC',{maximumFractionDigits:0})}</strong></div>
        </div>

        <div class="panel-card">
            <h3>Mis lotes publicados</h3>
            ${misLotes.length ? tablaLotesAdmin(misLotes) : '<p>Aún no has publicado lotes. Usa el botón de arriba.</p>'}
        </div>`;
}

function mostrarModalLote() {
    if (!getSession()) { mostrarLogin(); return; }
    document.getElementById('modalLote').style.display = 'block';
}

function publicarLote(event) {
    event.preventDefault();
    const s = getSession();
    if (!s) { mostrarLogin(); return; }

    const lotes = getLotes();
    const nextNum = lotes.reduce((max, l) => {
        const n = parseInt((l.codigo || '').split('-').pop(), 10);
        return isNaN(n) ? max : Math.max(max, n);
    }, 0) + 1;
    const codigo = `CD-SHU-2026-${String(nextNum).padStart(3, '0')}`;
    const tipo = document.getElementById('loteTipo').value;
    const cantidad = Number(document.getElementById('loteCantidad').value);
    const precio = Number(document.getElementById('lotePrecio').value);
    const finca = document.getElementById('loteFinca').value.trim() || 'No especificada';

    const nombreCalidad = { premium: 'Premium', organico: 'Orgánico', fermentado: 'Fermentado' }[tipo] || 'Cacao';

    lotes.push({
        id: Date.now(),
        codigo: codigo,
        titulo: `Cacao ${nombreCalidad} de ${s.nombre}`,
        agricultor: s.nombre,
        ownerEmail: s.email,
        finca: finca,
        ubicacion: 'Shushufindi, Sucumbíos',
        cantidadLb: cantidad,
        tipo: tipo,
        diasFermentacion: Number(document.getElementById('loteFermentacion').value),
        fechaCosecha: new Date().toISOString().slice(0, 10),
        precio: precio,
        imagen: IMG1,
        certificaciones: tipo === 'organico' ? ['Orgánico'] : [],
        organico: tipo === 'organico'
    });
    setLotes(lotes);
    cerrarModal('modalLote');
    event.target.reset();
    cargarProductos('todos');
    alert(`✅ Lote publicado con código ${codigo}`);
    abrirPanel();
}

// ----- COMPRADOR -----
function renderComprador() {
    const lotes = getLotes();
    document.getElementById('panelContent').innerHTML = `
        <div class="metric-grid">
            <div class="metric-card"><div class="metric-num">${lotes.length}</div><div class="metric-lbl">Lotes en el marketplace</div></div>
            <div class="metric-card"><div class="metric-num">${lotes.reduce((a,l)=>a+Number(l.cantidadLb),0).toLocaleString('es-EC')} lb</div><div class="metric-lbl">Volumen disponible</div></div>
            <div class="metric-card"><div class="metric-num">${new Set(lotes.map(l=>l.agricultor)).size}</div><div class="metric-lbl">Productores ofertando</div></div>
        </div>
        <div class="panel-card">
            <h3>Marketplace · lotes disponibles</h3>
            <p class="panel-hint">Revisa la trazabilidad de cada lote antes de contactar al productor.</p>
            <div class="comprador-lista">
                ${lotes.map(l => `
                    <div class="comprador-item">
                        <div>
                            <span class="codigo-traza">${l.codigo}</span>
                            <strong>${l.titulo}</strong>
                            <small>${l.agricultor} · ${l.cantidadLb} lb · $${Number(l.precio).toFixed(2)}/lb</small>
                        </div>
                        <div class="comprador-acciones">
                            <button class="btn-secondary" onclick="verTrazabilidad(${l.id})">🔎 Trazabilidad</button>
                            <button class="btn-primary" onclick="contactarAgricultor(${l.id})">Contactar</button>
                        </div>
                    </div>`).join('')}
            </div>
        </div>`;
}

// ============================================================
//  CONTACTO
// ============================================================
function enviarContacto(event) {
    event.preventDefault();
    alert('¡Gracias por contactarnos! Te responderemos pronto.');
    event.target.reset();
}

function scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Smooth scroll para enlaces internos del nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

console.log('CacaoDirecto Platform cargada ✅');
