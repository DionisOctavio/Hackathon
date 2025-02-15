function moveCarousel(containerId, direction) {
    const container = document.getElementById(containerId);
    const track = container.querySelector('.carousel-track');
    const items = track.querySelectorAll('.peliculas_targeta');

    const itemWidth = items[0].offsetWidth + 20; // Ancho de una tarjeta + margen (20px)
    const carouselWidth = container.offsetWidth; // Ancho visible del carrusel
    const itemsToShow = Math.floor(carouselWidth / itemWidth); // Calcula cuántas tarjetas caben completamente

    let currentIndex = parseInt(track.dataset.index || 0);

    if (direction === 1 && currentIndex < items.length - itemsToShow) {
        currentIndex++;
    } else if (direction === -1 && currentIndex > 0) {
        currentIndex--;
    } else if (direction === 1 && currentIndex >= items.length - itemsToShow) {
        currentIndex = 0; // Reinicia al inicio
    } else if (direction === -1 && currentIndex <= 0) {
        currentIndex = Math.max(0, items.length - itemsToShow); // Ir al final
    }

    track.dataset.index = currentIndex; // Guarda el índice actual
    const offset = -(currentIndex * itemWidth);
    track.style.transform = `translateX(${offset}px)`; // Mueve el carrusel
}
