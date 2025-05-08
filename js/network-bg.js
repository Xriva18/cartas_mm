// js/network-bg.js
let animationFrameId = null;
let isInitialized = false;

function initNetwork() {
    // Si ya está inicializado, no hacer nada
    if (isInitialized) return;

    const canvas = document.getElementById('networkBg');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get canvas context');
        return;
    }

    // Variables para puntos y threshold
    let POINTS = 80; // valor inicial, se recalcula en resize
    let threshold = 150; // valor inicial, se recalcula en resize
    let points = [];

    // Ajusta el tamaño y recalcula puntos y threshold
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Responsivo: ajusta cantidad de puntos y threshold
        POINTS = Math.floor((canvas.width * canvas.height) / 8000);
        POINTS = Math.max(20, Math.min(POINTS, 150)); // límites razonables
        threshold = Math.max(canvas.width, canvas.height) / 10;
        // Regenera los puntos cuando se redimensiona
        initPoints();
    }

    // Lee colores desde tus variables CSS
    const style = getComputedStyle(document.documentElement);
    const lineColor = style.getPropertyValue('--color5').trim() || '#ffffff';
    const alphaLine = 0.4;
    const nodeColor = style.getPropertyValue('--color5').trim() || '#ffffff';

    // Convierte hex a rgba
    function hexToRgba(hex, a) {
        const c = hex.replace('#', '');
        const num = parseInt(c, 16);
        const r = num >> 16;
        const g = (num >> 8) & 0xff;
        const b = num & 0xff;
        return `rgba(${r},${g},${b},${a})`;
    }

    function initPoints() {
        points = Array.from({ length: POINTS }).map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        }));
    }

    function updatePoints() {
        for (const p of points) {
            // Actualiza posición
            p.x += p.vx;
            p.y += p.vy;

            // Rebota en los bordes
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            // Mantiene los puntos dentro del canvas
            p.x = Math.max(0, Math.min(canvas.width, p.x));
            p.y = Math.max(0, Math.min(canvas.height, p.y));
        }
    }

    function draw() {
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Actualiza posiciones
        updatePoints();

        // dibuja líneas entre puntos cercanos
        ctx.strokeStyle = hexToRgba(lineColor, alphaLine);
        ctx.lineWidth = 2;
        for (let i = 0; i < POINTS; i++) {
            for (let j = i + 1; j < POINTS; j++) {
                const p = points[i];
                const q = points[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.hypot(dx, dy);
                if (dist < threshold) {
                    ctx.globalAlpha = 1 - dist / threshold;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                }
            }
        }

        // dibuja nodos
        ctx.fillStyle = hexToRgba(nodeColor, 0.8);
        for (const p of points) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function animate() {
        if (!isInitialized) return;
        draw();
        animationFrameId = requestAnimationFrame(animate);
    }

    // Inicializa todo
    resize();
    initPoints();
    window.addEventListener('resize', resize);

    // Marca como inicializado y comienza la animación
    isInitialized = true;
    animate();
}

// Función para limpiar la animación
function cleanup() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    isInitialized = false;
}

// Intenta inicializar cuando el DOM esté listo
function tryInit() {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initNetwork();
    }
}

// Agregar múltiples listeners para asegurar la inicialización
document.addEventListener('DOMContentLoaded', tryInit);
window.addEventListener('load', tryInit);

// Intentar inicializar inmediatamente si el DOM ya está listo
tryInit();

// Limpiar cuando se desmonte la página
window.addEventListener('beforeunload', cleanup);

