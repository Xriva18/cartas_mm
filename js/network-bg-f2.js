// js/network-bg-f2.js - Fondo limpio sin nodos
let animationFrameId = null;
let isInitialized = false;
let currentCanvas = null;

function initNetworkF2() {
    // Limpiamos cualquier animación existente antes de inicializar
    cleanupF2();

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

    // Asignar referencia global
    currentCanvas = canvas;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function draw() {
        if (!ctx || !canvas) return;

        // Limpiar el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // El fondo F2 es completamente limpio, solo el gradiente del CSS se muestra
        // No dibujamos nada en el canvas
    }

    function animate() {
        if (!isInitialized) return;
        draw();
        animationFrameId = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);

    isInitialized = true;
    animate();
}

function cleanupF2() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    isInitialized = false;

    // Limpiamos el canvas si existe
    const canvas = document.getElementById('networkBg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    // Limpiar referencia global
    currentCanvas = null;
}

// Exportar funciones para uso global
window.initNetworkF2 = initNetworkF2;
window.cleanupF2 = cleanupF2; 