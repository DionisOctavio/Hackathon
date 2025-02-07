// Función para mover el carrusel a la siguiente posición
function moveCarousel(containerId, direction) {
    const track = document.querySelector(`#${containerId} .carousel-track`);
    const items = track.querySelectorAll('.peliculas_targeta');
    const itemsToShow = 5;  // Número de tarjetas visibles
    let currentIndex = parseInt(track.dataset.index || 0);

    if (direction === 1 && currentIndex < items.length - itemsToShow) {
        currentIndex++;
    } else if (direction === -1 && currentIndex > 0) {
        currentIndex--;
    } else if (direction === 1 && currentIndex >= items.length - itemsToShow) {
        currentIndex = 0;  // Si está al final, volver al principio
    } else if (direction === -1 && currentIndex <= 0) {
        currentIndex = items.length - itemsToShow;  // Si está al principio, ir al final
    }

    track.dataset.index = currentIndex;  // Guardamos el índice actual
    const offset = -(currentIndex * (200 + 20));  // 200px es el ancho de cada tarjeta, 20px el margen
    track.style.transform = `translateX(${offset}px)`;  // Actualiza la posición
}
