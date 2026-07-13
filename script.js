// Base de datos simulada de productos
const productosDB = [
    {
        id: 1,
        titulo: "Cacao Nacional Fino de Aroma",
        agricultor: "María Vega",
        cantidad: "500 libras",
        calidad: "Premium",
        precio: 2.50,
        imagen: "https://grandsur.com/wp-content/uploads/2021/02/GrandSur-Our-Products-ASSS.jpg",
        ubicacion: "San Pedro de Shushufindi",
        tipo: "premium",
        fermentado: true,
        organico: false
    },
    {
        id: 2,
        titulo: "Cacao Orgánico Certificado",
        agricultor: "Carmen Yumbo",
        cantidad: "300 libras",
        calidad: "Orgánico",
        precio: 2.80,
        imagen: "https://www.asadorcitywokalfafar.com/wp-content/uploads/2021/04/el-cacao-es-sano-para-la-salud.jpg",
        ubicacion: "Shushufindi Centro",
        tipo: "organico",
        fermentado: true,
        organico: true
    },
    {
        id: 3,
        titulo: "Cacao Fermentado 5 Días",
        agricultor: "Arturo Caiza",
        cantidad: "800 libras",
        calidad: "Fermentado",
        precio: 2.30,
        imagen: "https://www.agricultura.gob.ec/wp-content/uploads/2020/04/Venta-de-cacao-y-caf%C3%A9.png",
        ubicacion: "Asociación San Pedro",
        tipo: "fermentado",
        fermentado: true,
        organico: false
    },
    {
        id: 4,
        titulo: "Cacao Premium Seleccionado",
        agricultor: "José Andi",
        cantidad: "450 libras",
        calidad: "Premium",
        precio: 2.60,
        imagen: "https://grandsur.com/wp-content/uploads/2021/02/GrandSur-Our-Products-ASSS.jpg",
        ubicacion: "Zona Norte Shushufindi",
        tipo: "premium",
        fermentado: true,
        organico: false
    },
    {
        id: 5,
        titulo: "Cacao Tradicional Amazónico",
        agricultor: "Rosa Chimbo",
        cantidad: "600 libras",
        calidad: "Tradicional",
        precio: 2.20,
        imagen: "https://www.asadorcitywokalfafar.com/wp-content/uploads/2021/04/el-cacao-es-sano-para-la-salud.jpg",
        ubicacion: "Comunidad La Unión",
        tipo: "fermentado",
        fermentado: true,
        organico: false
    },
    {
        id: 6,
        titulo: "Cacao Orgánico Premium",
        agricultor: "Luis Tapuy",
        cantidad: "400 libras",
        calidad: "Orgánico Premium",
        precio: 3.00,
        imagen: "https://grandsur.com/wp-content/uploads/2021/02/GrandSur-Our-Products-ASSS.jpg",
        ubicacion: "San Pedro de Shushufindi",
        tipo: "organico",
        fermentado: true,
        organico: true
    }
];

// Cargar productos al inicio
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos('todos');
});

// Función para cargar productos
function cargarProductos(filtro) {
    const grid = document.getElementById('productosGrid');
    grid.innerHTML = '';
    
    let productosFiltrados = productosDB;
    
    if (filtro !== 'todos') {
        productosFiltrados = productosDB.filter(p => p.tipo === filtro);
    }
    
    productosFiltrados.forEach(producto => {
        const card = crearCardProducto(producto);
        grid.innerHTML += card;
    });
}

// Crear tarjeta de producto
function crearCardProducto(producto) {
    let badgeHTML = '';
    if (producto.tipo === 'premium') {
        badgeHTML = '<span class="badge premium">Premium</span>';
    } else if (producto.tipo === 'organico') {
        badgeHTML = '<span class="badge organico">Orgánico</span>';
    } else if (producto.tipo === 'fermentado') {
        badgeHTML = '<span class="badge">Fermentado</span>';
    }
    
    return `
        <div class="producto-card">
            <img src="${producto.imagen}" alt="${producto.titulo}" class="producto-img">
            <div class="producto-info">
                <div class="producto-agricultor">
                    <span>👨‍🌾</span>
                    <span>${producto.agricultor}</span>
                </div>
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-detalles">
                    📍 ${producto.ubicacion}<br>
                    📦 ${producto.cantidad} disponibles
                </p>
                <div class="producto-precio">
                    <span class="precio">$${producto.precio.toFixed(2)}/lb</span>
                    ${badgeHTML}
                </div>
                <button class="btn-primary" style="width: 100%; margin-top: 1rem;" onclick="contactarAgricultor(${producto.id})">
                    Contactar Agricultor
                </button>
            </div>
        </div>
    `;
}

// Filtrar productos
function filtrarCacao(tipo) {
    // Actualizar botones activos
    const botones = document.querySelectorAll('.filtro-btn');
    botones.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Cargar productos filtrados
    cargarProductos(tipo);
}

// Scroll suave a secciones
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    element.scrollIntoView({ behavior: 'smooth' });
}

// Modales
function mostrarLogin() {
    document.getElementById('modalLogin').style.display = 'block';
}

function mostrarRegistro() {
    document.getElementById('modalRegistro').style.display = 'block';
}

function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Formulario de login
function iniciarSesion(event) {
    event.preventDefault();
    alert('¡Bienvenido a CacaoDirecto! Función de login en desarrollo.');
    cerrarModal('modalLogin');
}

// Formulario de registro
function registrarse(event) {
    event.preventDefault();
    alert('¡Registro exitoso! Te hemos enviado un correo de confirmación.');
    cerrarModal('modalRegistro');
}

// Formulario de contacto
function enviarContacto(event) {
    event.preventDefault();
    alert('¡Gracias por contactarnos! Te responderemos pronto.');
    event.target.reset();
}

// Contactar agricultor
function contactarAgricultor(productoId) {
    const producto = productosDB.find(p => p.id === productoId);
    if (producto) {
        const mensaje = `¡Hola! Estoy interesado en tu ${producto.titulo} (${producto.cantidad}). ¿Podemos hablar sobre los detalles?`;
        alert(`Contactando a ${producto.agricultor}...\n\nMensaje: ${mensaje}\n\n¿Te gustaría abrir WhatsApp para continuar?`);
        // En producción, aquí se abriría WhatsApp o un sistema de mensajería
        // window.open(`https://wa.me/593991234567?text=${encodeURIComponent(mensaje)}`);
    }
}

// Animaciones al hacer scroll
window.addEventListener('scroll', () => {
    const elementos = document.querySelectorAll('.problema-card, .proceso-card, .impacto-card');
    
    elementos.forEach(elemento => {
        const posicion = elemento.getBoundingClientRect().top;
        const pantalla = window.innerHeight;
        
        if (posicion < pantalla - 100) {
            elemento.style.opacity = '1';
            elemento.style.transform = 'translateY(0)';
        }
    });
});

// Inicializar animaciones
document.querySelectorAll('.problema-card, .proceso-card, .impacto-card').forEach(elemento => {
    elemento.style.opacity = '0';
    elemento.style.transform = 'translateY(30px)';
    elemento.style.transition = 'all 0.6s ease';
});

// Estadísticas animadas en hero
function animarEstadisticas() {
    const stats = document.querySelectorAll('.stat-card h3');
    stats.forEach(stat => {
        const valor = stat.textContent;
        if (valor.includes('+')) {
            stat.style.animation = 'pulse 2s infinite';
        }
    });
}

// Agregar animación CSS para pulse
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// Llamar animación de estadísticas
setTimeout(animarEstadisticas, 1000);

// Validación de formularios mejorada
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const inputs = this.querySelectorAll('input[required], select[required], textarea[required]');
        let valido = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                valido = false;
                input.style.borderColor = 'var(--danger-color)';
            } else {
                input.style.borderColor = 'var(--light-gray)';
            }
        });
        
        if (!valido) {
            e.preventDefault();
            alert('Por favor, completa todos los campos requeridos.');
        }
    });
});

// Smooth scroll para todos los enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Función para buscar productos (se puede agregar un input de búsqueda)
function buscarProductos(termino) {
    const resultados = productosDB.filter(producto => 
        producto.titulo.toLowerCase().includes(termino.toLowerCase()) ||
        producto.agricultor.toLowerCase().includes(termino.toLowerCase()) ||
        producto.ubicacion.toLowerCase().includes(termino.toLowerCase())
    );
    
    const grid = document.getElementById('productosGrid');
    grid.innerHTML = '';
    
    if (resultados.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No se encontraron productos.</p>';
    } else {
        resultados.forEach(producto => {
            grid.innerHTML += crearCardProducto(producto);
        });
    }
}

// Datos de impacto actualizados
const datosImpacto = {
    familiasBeneficiadas: 1200,
    aumentoIngresos: 100,
    ahorroAnual: 700
};

// Actualizar estadísticas en tiempo real (simulación)
setInterval(() => {
    // Aquí se podrían actualizar las estadísticas con datos reales de una API
    console.log('Estadísticas actualizadas');
}, 60000); // Cada minuto

// Notificación de nuevos productos
function notificarNuevoProducto(producto) {
    // Crear notificación toast
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: slideIn 0.3s;
    `;
    toast.textContent = `¡Nuevo cacao disponible de ${producto.agricultor}!`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Agregar animación slideIn
const styleSlide = document.createElement('style');
styleSlide.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(styleSlide);

console.log('CacaoDirecto Platform Loaded Successfully! 🍫');
console.log(`Productos disponibles: ${productosDB.length}`);
console.log(`Agricultores registrados: ${datosImpacto.familiasBeneficiadas}`);