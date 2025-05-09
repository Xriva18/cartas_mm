// js/network-bg.js
let animationFrameId = null;
let isInitialized = false;

function initNetwork() {
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

    let POINTS = 80;
    let threshold = 150;
    let points = [];
    let pulseTime = 0;  // Añadimos variable para controlar el pulso

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        POINTS = Math.floor((canvas.width * canvas.height) / 8000);
        POINTS = Math.max(20, Math.min(POINTS, 150));
        threshold = Math.max(canvas.width, canvas.height) / 10;
        initPoints();
    }

    const style = getComputedStyle(document.documentElement);
    const lineColor = style.getPropertyValue('--color5').trim() || '#ffffff';
    const nodeColor = style.getPropertyValue('--color5').trim() || '#ffffff';
    const alphaLine = 0.7;

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
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            p.x = Math.max(0, Math.min(canvas.width, p.x));
            p.y = Math.max(0, Math.min(canvas.height, p.y));
        }
    }

    function draw() {
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updatePoints();

        // Actualizamos el tiempo del pulso
        pulseTime += 0.001;

        // Función personalizada para el pulso con tiempos específicos
        const normalizedTime = (Math.sin(pulseTime) + 1) / 2; // Normaliza a 0-1
        let pulseOpacity;

        if (normalizedTime < 0.2) {
            // Estado 1: Opacidad 0.5 por 1 segundo
            pulseOpacity = 0.5;
        } else if (normalizedTime < 0.25) {
            // Estado 2: Transición rápida a 0.2 (0.5 segundos)
            const t = (normalizedTime - 0.2) * 20; // Normaliza a 0-1
            pulseOpacity = 0.5 - (0.3 * t); // Transición lineal de 0.5 a 0.2
        } else if (normalizedTime < 0.3) {
            // Estado 3: Opacidad 0.2 por 0.5 segundos
            pulseOpacity = 0.2;
        } else if (normalizedTime < 0.35) {
            // Estado 4: Transición suave a 0.5 (0.5 segundos)
            const t = (normalizedTime - 0.3) * 20; // Normaliza a 0-1
            pulseOpacity = 0.2 + (0.3 * (1 - Math.cos(t * Math.PI)) / 2); // Curva suave de 0.2 a 0.5
        } else {
            // Estado 5: Opacidad 0.5 por 1 segundo
            pulseOpacity = 0.5;
        }

        // Dibuja las conexiones primero
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
                    const opacity = Math.pow(1 - dist / threshold, 1.5);
                    ctx.globalAlpha = opacity * alphaLine;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                }
            }
        }

        // Dibuja los nodos con opacidad pulsante
        ctx.globalAlpha = pulseOpacity;
        ctx.fillStyle = hexToRgba(nodeColor, pulseOpacity);
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

    resize();
    initPoints();
    window.addEventListener('resize', resize);

    isInitialized = true;
    animate();
}

function cleanup() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    isInitialized = false;
}

// Inicialización simplificada
document.addEventListener('DOMContentLoaded', initNetwork);
window.addEventListener('beforeunload', cleanup);

