const API_URL = "http://localhost:3000";

// RUTAS ELEMENTOS
const GET_DEMOGRAFIAS = API_URL + "/demografia";
const GET_GENEROS = API_URL + "/genero";
const GET_PEGI = API_URL + "/pegi";

// Funciones para obtener datos de la API
function getGeneros() {
    return fetch(GET_GENEROS)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error al obtener géneros:', error));
}

function getDemografias() {
    return fetch(GET_DEMOGRAFIAS)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error al obtener demografías:', error));
}

function getPegi() {
    return fetch(GET_PEGI)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error al obtener PEGI:', error));
}

// Función para agregar una película (usada en administración)
function agregarPelicula(pelicula) {
    return fetch(API_URL + '/peliculas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pelicula)
    })
    .then(response => response.json())
    .catch(error => console.error('Error al agregar la película:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    const profileRole = localStorage.getItem('profileRole');
    if (profileRole !== 'ADMINISTRADOR') {
        alert('Acceso denegado. Solo los administradores pueden acceder a esta página.');
        window.location.href = 'index.html'; // Redirige si no es admin
    }

    // Llamamos a las funciones para llenar los selects con los datos desde la base de datos
    getGeneros()
        .then(generos => {
            const generoSelect = document.getElementById('genero');
            generos.forEach(genero => {
                const option = document.createElement('option');
                option.value = genero.id_genero;
                option.textContent = genero.nombre_genero;
                generoSelect.appendChild(option);
            });
        });

    getDemografias()
        .then(demografias => {
            const demografiaSelect = document.getElementById('demografia');
            demografias.forEach(demografia => {
                const option = document.createElement('option');
                option.value = demografia.id_demografia;
                option.textContent = demografia.nombre_demografia;
                demografiaSelect.appendChild(option);
            });
        });

    getPegi()
        .then(pegis => {
            const pegiSelect = document.getElementById('pegi');
            pegis.forEach(pegi => {
                const option = document.createElement('option');
                option.value = pegi.id_pegi;
                option.textContent = pegi.edad;
                pegiSelect.appendChild(option);
            });
        });

    // Agregar película
    document.getElementById('form-agregar-pelicula').addEventListener('submit', function(event) {
        event.preventDefault();

        const titulo = document.getElementById('titulo').value;
        const sinopsis = document.getElementById('sinopsis').value || '';  // Campo opcional
        const anio = document.getElementById('anio').value;
        const genero = document.getElementById('genero').value;
        const url_cartel = document.getElementById('url_cartel').value;
        const url_trailer = document.getElementById('url_trailer').value || '';  // Campo opcional
        const url_carrusel = document.getElementById('url_carrusel').value || '';  // Campo opcional
        const demografia = document.getElementById('demografia').value;
        const pegi = document.getElementById('pegi').value;

        const pelicula = {
            titulo,
            sinopsis,
            anio,
            url_cartel,
            url_trailer,
            url_carrusel,
            id_demografia: demografia,
            id_genero: genero,
            id_pegi: pegi
        };

        // Enviar la película al servidor
        agregarPelicula(pelicula)
            .then(data => {
                alert('Película agregada exitosamente');
                window.location.href = 'peliculas.html'; // Redirigir a la página de películas
            })
            .catch(error => {
                console.error('Error al agregar la película:', error);
            });
    });
});
