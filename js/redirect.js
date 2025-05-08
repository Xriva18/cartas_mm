// js/redirect.js

// Asegurarnos de que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('redirForm');
    const input = document.getElementById('searchInput');

    if (!form || !input) {
        console.error('❌ No encontré #redirForm o #searchInput en el DOM');
        return;
    }

    // Lista de códigos válidos
    const validCodes = [
        's18', 's17', 's16', 's15', 's14', 's13', 's12', 's11', 's10', 's9', 's8', 's7', 's6', 's5', 's4', 's3', 's2',
        '210325', 'agos1', '140225', '030225', 'WHTRXNF', '230125', 'S925', 'XBB-7255'
    ];

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const codigo = input.value.trim();

        if (codigo) {
            // Verificar si el código existe antes de redirigir
            if (validCodes.includes(codigo)) {
                window.location.href = `html/${codigo}.html`;
            } else {
                //alert('El código ingresado no existe. Por favor, verifique el código.');
            }
        }
    });
});

