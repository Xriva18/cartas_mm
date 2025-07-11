// js/network-bg-f1.js - Fondo con nodos interactivos
let animationFrameId = null;
let isInitialized = false;
let isDragging = false;
let draggedPoint = null;
let mouseX = 0;
let mouseY = 0;
let currentCanvas = null;
let currentPoints = null;

// Funciones de manejo de eventos (scope global)
function getPointAtPosition(x, y, points) {
    const clickRadius = 8; // Radio de detección para clicks
    for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        const dx = p.x - x;
        const dy = p.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= clickRadius) {
            return p;
        }
    }
    return null;
}

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    // Funciona tanto para eventos de mouse como táctiles
    const clientX = evt.clientX || evt.touches?.[0]?.clientX || 0;
    const clientY = evt.clientY || evt.touches?.[0]?.clientY || 0;
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function handleMouseDown(e) {
    if (!currentCanvas || !currentPoints) return;

    const pos = getMousePos(currentCanvas, e);
    const clickedPoint = getPointAtPosition(pos.x, pos.y, currentPoints);

    if (clickedPoint) {
        isDragging = true;
        draggedPoint = clickedPoint;
        draggedPoint.isDragging = true;
        currentCanvas.style.cursor = 'grabbing';
        e.preventDefault();
    }
}

function handleMouseMove(e) {
    if (!currentCanvas || !currentPoints) return;

    const pos = getMousePos(currentCanvas, e);
    mouseX = pos.x;
    mouseY = pos.y;

    if (isDragging && draggedPoint) {
        draggedPoint.x = pos.x;
        draggedPoint.y = pos.y;
        e.preventDefault();
    } else {
        // Cambiar cursor si está sobre un nodo
        const hoveredPoint = getPointAtPosition(pos.x, pos.y, currentPoints);
        currentCanvas.style.cursor = hoveredPoint ? 'grab' : 'default';
    }
}

function handleMouseUp(e) {
    if (isDragging && draggedPoint) {
        isDragging = false;
        draggedPoint.isDragging = false;
        draggedPoint = null;
        if (currentCanvas) {
            currentCanvas.style.cursor = 'default';
        }
        e.preventDefault();
    }
}

// Funciones para dispositivos táctiles
function handleTouchStart(e) {
    if (!currentCanvas || !currentPoints) return;

    e.preventDefault();
    const touch = e.touches[0];
    const pos = getMousePos(currentCanvas, touch);
    const clickedPoint = getPointAtPosition(pos.x, pos.y, currentPoints);

    if (clickedPoint) {
        isDragging = true;
        draggedPoint = clickedPoint;
        draggedPoint.isDragging = true;
    }
}

function handleTouchMove(e) {
    if (!currentCanvas || !currentPoints) return;

    e.preventDefault();
    if (isDragging && draggedPoint && e.touches[0]) {
        const touch = e.touches[0];
        const pos = getMousePos(currentCanvas, touch);
        draggedPoint.x = pos.x;
        draggedPoint.y = pos.y;
    }
}

function handleTouchEnd(e) {
    if (isDragging && draggedPoint) {
        isDragging = false;
        draggedPoint.isDragging = false;
        draggedPoint = null;
        e.preventDefault();
    }
}

function initNetworkF1() {
    // Limpiamos cualquier animación existente antes de inicializar
    cleanupF1();

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

    // Asignar referencias globales
    currentCanvas = canvas;

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
            vy: (Math.random() - 0.5) * 0.5,
            isDragging: false
        }));
        // Asignar referencia a los puntos
        currentPoints = points;
    }

    function updatePoints() {
        for (const p of points) {
            // Solo actualizar posición si no está siendo arrastrado
            if (!p.isDragging) {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                p.x = Math.max(0, Math.min(canvas.width, p.x));
                p.y = Math.max(0, Math.min(canvas.height, p.y));
            }
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
        for (const p of points) {
            if (p.isDragging) {
                // Nodo siendo arrastrado - más grande y brillante
                ctx.globalAlpha = 1.0;
                ctx.fillStyle = hexToRgba(nodeColor, 1.0);
                ctx.beginPath();
                ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
                ctx.fill();

                // Añadir un borde brillante
                ctx.strokeStyle = hexToRgba(nodeColor, 0.8);
                ctx.lineWidth = 2;
                ctx.stroke();
            } else {
                // Nodo normal con opacidad pulsante
                ctx.globalAlpha = pulseOpacity;
                ctx.fillStyle = hexToRgba(nodeColor, pulseOpacity);
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function animate() {
        if (!isInitialized) return;
        draw();
        animationFrameId = requestAnimationFrame(animate);
    }

    // Agregar event listeners para mouse
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    // Agregar event listeners para dispositivos táctiles
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    resize();
    initPoints();
    window.addEventListener('resize', resize);

    isInitialized = true;
    animate();
}

function cleanupF1() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    isInitialized = false;
    isDragging = false;
    draggedPoint = null;

    // Limpiamos el canvas si existe
    const canvas = document.getElementById('networkBg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        // Remover event listeners
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mouseleave', handleMouseUp);
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
    }

    // Limpiar referencias globales
    currentCanvas = null;
    currentPoints = null;
}

// Exportar funciones para uso global
window.initNetworkF1 = initNetworkF1;
window.cleanupF1 = cleanupF1; 