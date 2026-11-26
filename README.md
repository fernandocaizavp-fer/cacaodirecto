# CacaoDirecto — Comercio justo de cacao

Prototipo web de un marketplace que conecta **pequeños productores de cacao** con **compradores**, para que el agricultor venda a un precio justo sin depender de intermediarios.

Funciona 100 % en el navegador: no necesita servidor ni base de datos, así que basta con abrir `index.html`.

## ✨ Funcionalidades

- **Comparador de precios:** calcula el precio por libra a partir del precio internacional de referencia y lo compara con lo que paga el intermediario (gráfico de barras hecho solo con CSS).
- **Marketplace de lotes:** catálogo de lotes de cacao con filtro por tipo y opción de contactar al productor.
- **Trazabilidad:** cada lote muestra su origen, datos del productor y certificaciones.
- **Cuentas con 3 roles**, cada uno con su propio panel:
  - **Productor:** publica sus lotes de cacao.
  - **Comprador:** revisa los lotes disponibles y contacta a los productores.
  - **Administrador:** ve todos los lotes y configura los parámetros de precio.
- **Persistencia local:** usuarios, sesión y lotes se guardan en `localStorage`, con datos de ejemplo y un botón para reiniciar la demo.
- **Imágenes generadas en código (SVG)**, para que todo funcione sin internet.

## 🛠️ Tecnologías

HTML5 · CSS3 · JavaScript (sin frameworks ni librerías)

## 🚀 Cómo probarlo

1. Clona o descarga el repositorio.
2. Abre `index.html` en el navegador.
3. Inicia sesión con una de las cuentas de demostración que aparecen en la ventana de inicio de sesión, o crea una cuenta nueva.

## 📁 Estructura

```
index.html        Página principal, ventanas de login/registro y paneles
styles.css        Estilos y diseño responsive
script.js         Lógica: datos, precios, marketplace, roles y paneles
Screenshot_96.png Logo
```

## 👤 Autor

**Fernando Caiza** — Estudiante de Ingeniería en Software, ESPOCH
GitHub: [@fernandocaizavp-fer](https://github.com/fernandocaizavp-fer)
