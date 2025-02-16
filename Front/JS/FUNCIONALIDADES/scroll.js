// Función para mover el carrusel
function moveCarousel(containerId, direction) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`No se encontró el contenedor con id: ${containerId}`);
        return;  // Salir si no se encuentra el contenedor
    }

    const track = container.querySelector('.carousel-track');
    if (!track) {
        console.error(`No se encontró el track en el contenedor con id: ${containerId}`);
        return;  // Salir si no se encuentra el track
    }

    const items = track.querySelectorAll('.peliculas_targeta');
    if (items.length === 0) {
        console.error(`No se encontraron elementos de película en el contenedor con id: ${containerId}`);
        return;  // Salir si no se encuentran las películas
    }

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

    // Verificar si las flechas deben mostrarse
    checkCarouselArrows(container);
}

// Función para verificar si las flechas deben mostrarse
function checkCarouselArrows(container) {
    const track = container.querySelector('.carousel-track');
    const prevButton = container.querySelector('.carousel-button.prev');
    const nextButton = container.querySelector('.carousel-button.next');
    const items = track.querySelectorAll('.peliculas_targeta');

    if (items.length <= Math.floor(container.offsetWidth / items[0].offsetWidth)) {
        // Si las películas no se desbordan, ocultar ambas flechas
        prevButton.style.display = 'none';
        nextButton.style.display = 'none';
    } else {
        // Si el contenido se desborda, mostrar las flechas
        prevButton.style.display = 'none';  // Inicialmente oculta la flecha izquierda
        nextButton.style.display = 'block'; // Siempre muestra la flecha derecha

        // Mostrar la flecha izquierda si el contenido se ha desplazado
        if (track.dataset.index > 0) {
            prevButton.style.display = 'block';
        }

        // Mostrar la flecha derecha si hay más contenido hacia la derecha
        if (track.dataset.index < items.length - Math.floor(container.offsetWidth / items[0].offsetWidth)) {
            nextButton.style.display = 'block';
        }
    }
}