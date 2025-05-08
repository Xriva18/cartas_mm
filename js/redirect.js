// js/redirect.js

// Asegurarnos de que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('redirForm');
    const input = document.getElementById('searchInput');

    if (!form || !input) {
        console.error('❌ No encontré #redirForm o #searchInput en el DOM');
        return;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const codigo = input.value.trim();

        if (codigo) {
            window.location.href = `html/${codigo}.html`;
        } else {
            alert('Por favor, ingrese un código.');
        }
    });
});
