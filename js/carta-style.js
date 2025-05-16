document.querySelectorAll('.flip-card').forEach(function (card) {
    function handleTap() {
        const inner = card.querySelector('.flip-card-inner');
        inner.classList.toggle('flipped');
    }

    // Evento para pantallas táctiles
    card.addEventListener('touchstart', function (e) {
        e.preventDefault(); // Elimina el retraso del click en móviles
        handleTap();
    });

    // Evento para desktop
    card.addEventListener('click', handleTap);
}); 