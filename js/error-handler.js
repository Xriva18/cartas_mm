document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('searchInput');
    const form = document.getElementById('redirForm');

    if (!form || !input) {
        console.error('❌ No encontré #redirForm o #searchInput en el DOM');
        return;
    }

    // Función para mostrar mensaje de error
    function showError(message) {
        // Remover mensaje de error existente si hay uno
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Crear elemento para el mensaje de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.fontWeight = 'bold';
        errorDiv.style.marginTop = '5px';
        errorDiv.style.fontSize = '14px';
        errorDiv.textContent = message;

        // Insertar el mensaje después del input
        const inputGroup = input.parentElement;
        inputGroup.parentElement.insertBefore(errorDiv, inputGroup.nextSibling);

        // Agregar evento click al input para remover el mensaje
        input.addEventListener('click', function removeError() {
            errorDiv.remove();
            input.removeEventListener('click', removeError);
        }, { once: true });
    }

    // Interceptar el envío del formulario
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const codigo = input.value.trim();

        if (!codigo) {
            showError('Por favor, ingrese un código.');
            return;
        }

        try {
            const response = await fetch(`html/${codigo}.html`);
            if (!response.ok) {
                showError('Código no encontrado');
                return;
            }
            // Si el archivo existe, permitir que redirect.js maneje la redirección
            window.location.href = `html/${codigo}.html`;
        } catch (error) {
            showError('Código no encontrado.');
        }
    });
}); 