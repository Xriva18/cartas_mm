// js/background-switcher.js - Controlador del switch F1/F2
let currentMode = 'F1'; // Modo por defecto

function switchBackground(mode) {
    // Limpiar cualquier fondo activo
    if (window.cleanupF1) {
        window.cleanupF1();
    }
    if (window.cleanupF2) {
        window.cleanupF2();
    }

    // Inicializar el fondo correspondiente
    if (mode === 'F1') {
        if (window.initNetworkF1) {
            window.initNetworkF1();
        }
    } else if (mode === 'F2') {
        if (window.initNetworkF2) {
            window.initNetworkF2();
        }
    }

    currentMode = mode;
}

function handleSwitchChange() {
    const switchInput = document.getElementById('modeSwitch');
    if (switchInput) {
        const mode = switchInput.checked ? 'F2' : 'F1';
        switchBackground(mode);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    // Agregar event listener al switch
    const switchInput = document.getElementById('modeSwitch');
    if (switchInput) {
        switchInput.addEventListener('change', handleSwitchChange);
    }

    // Inicializar con F1 por defecto
    switchBackground('F1');
});

// Exportar funciones para uso global
window.switchBackground = switchBackground;
window.handleSwitchChange = handleSwitchChange; 