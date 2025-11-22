# 🎵 BinRock Musical - Bingo Musical

Bingo musical interactivo desarrollado con Angular 18 Standalone, Angular Material y Signals.

## 🚀 Deploy a GitHub Pages

### Configuración Automática (URLs limpias)

El proyecto está configurado para funcionar correctamente en GitHub Pages con URLs limpias (sin `#`).

**Paso 1: Build y Deploy**

```bash
npm run deploy
```

Este comando:
1. Compila la aplicación en modo producción
2. Configura el `base-href` correcto para tu repositorio
3. Despliega automáticamente a GitHub Pages

**Paso 2: Configurar GitHub Pages**

1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. Source: Selecciona la rama `gh-pages`
4. Save

¡Listo! Tu app estará disponible en: `https://juanjinario.github.io/binrock/`

---

## 🛠️ Desarrollo Local

```bash
npm install
npm start
```

Abre `http://localhost:4200/`

---

## 📱 Características

- ✅ 100% Angular 18 Standalone (sin NgModules)
- ✅ Signals para gestión de estado reactivo
- ✅ Angular Material components
- ✅ Responsive (optimizado para móviles)
- ✅ 40 canciones de diversos géneros
- ✅ Detección automática de BINGO
- ✅ Compartir partida por link

---

## 🎮 Cómo Jugar

1. **Anfitrión:** Genera una partida desde la página principal
2. **Compartir:** Copia el link y envíalo a los jugadores
3. **Jugadores:** Cada uno recibe un tablero aleatorio con 16 canciones
4. **Jugar:** El anfitrión reproduce canciones, los jugadores marcan
5. **Ganar:** Primero en completar una línea (horizontal, vertical o diagonal) gana

---

## 📦 Estructura del Proyecto

```
src/
├── app/
│   ├── data/
│   │   └── songs.config.ts          # 40 canciones configuradas
│   ├── pages/
│   │   ├── home/                    # Página principal
│   │   └── game-board/              # Tablero del bingo
│   ├── app.component.*              # Componente raíz con toolbar
│   ├── app.config.ts                # Configuración de la app
│   └── app.routes.ts                # Rutas (lazy loading)
├── index.html                       # Template principal con script de SPA
├── 404.html                         # Redirección para GitHub Pages
└── styles.scss                      # Estilos globales + Material theme
```

---

## 🔧 Scripts Disponibles

- `npm start` - Servidor de desarrollo
- `npm run build:prod` - Build de producción
- `npm run deploy` - Build + Deploy a GitHub Pages
- `npm test` - Ejecutar tests

---

## 🌐 Soporte GitHub Pages

El proyecto incluye:
- ✅ `404.html` para manejar rutas de SPA
- ✅ Script de redirección en `index.html`
- ✅ `.nojekyll` para evitar procesamiento Jekyll
- ✅ `base-href` configurado automáticamente

---

## 📄 Licencia

MIT
