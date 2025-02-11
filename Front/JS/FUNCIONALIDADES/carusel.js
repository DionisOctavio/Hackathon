const track = document.querySelector('.carousel-track');
const items = document.querySelectorAll('.carousel-item');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const indicatorsContainer = document.querySelector('.carousel-indicators');

let index = 0;

// Crear indicadores dinámicamente
items.forEach((_, i) => {
    const indicator = document.createElement('span');
    indicator.classList.add('indicator');
    if (i === 0) indicator.classList.add('active');
    indicatorsContainer.appendChild(indicator);
});

const indicators = document.querySelectorAll('.indicator');

function updateCarousel() {
    const carouselWidth = document.querySelector('.carousel').offsetWidth; // Ancho dinámico
    track.style.transform = `translateX(${-index * carouselWidth}px)`;
    
    indicators.forEach(dot => dot.classList.remove('active'));
    indicators[index].classList.add('active');
}

prevButton.addEventListener('click', () => {
    index = (index > 0) ? index - 1 : items.length - 1;
    updateCarousel();
});

nextButton.addEventListener('click', () => {
    index = (index < items.length - 1) ? index + 1 : 0;
    updateCarousel();
});

// Ajustar el carrusel cuando la ventana cambie de tamaño
window.addEventListener('resize', updateCarousel);

// Desplazar el carrusel automáticamente cada 10 segundos
setInterval(() => {
    index = (index < items.length - 1) ? index + 1 : 0;
    updateCarousel();
}, 10000); // 10000 ms = 10 segundos