// js/network-bg.js
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('networkBg');
    const ctx = canvas.getContext('2d');

    // Ajusta el tamaño
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Lee colores desde tus variables CSS
    const style = getComputedStyle(document.documentElement);
    const lineColor = style.getPropertyValue('--color5').trim() || '#ffffff';
    const alphaLine = 0.2;
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

    // Genera un conjunto fijo de puntos
    const POINTS = 120;
    const threshold = 120;
    const points = Array.from({ length: POINTS }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height
    }));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // dibuja líneas entre puntos cercanos
        ctx.strokeStyle = hexToRgba(lineColor, alphaLine);
        ctx.lineWidth = 1;
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
        ctx.fillStyle = hexToRgba(nodeColor, 0.4);
        for (const p of points) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // animación continua suavizada
    (function loop() {
        draw();
        requestAnimationFrame(loop);
    })();
});
