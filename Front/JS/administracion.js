const API_URL = 'http://localhost:3000';

// RUTAS ELEMENTOS
const GET_DEMOGRAFIAS = API_URL + "/demografia";
const GET_GENEROS = API_URL + "/genero";
const GET_PEGI = API_URL + "/pegi";
const GET_PELICULAS = API_URL + "/peliculas";
const DELETE_PELICULA = API_URL + "/peliculas";

// Funciones para obtener datos de la API
function getGeneros() {
    return fetch(GET_GENEROS)
        .then(response => response.json())
        .catch(error => console.error('Error al obtener géneros:', error));
}

function getDemografias() {
    return fetch(GET_DEMOGRAFIAS)
        .then(response => response.json())
        .catch(error => console.error('Error al obtener demografías:', error));
}

function getPegi() {
    return fetch(GET_PEGI)
        .then(response => response.json())
        .catch(error => console.error('Error al obtener PEGI:', error));
}

// Función para obtener películas
function getPeliculas() {
    return fetch(GET_PELICULAS)
        .then(response => response.json())
        .then(data => {
            console.log('Películas obtenidas:', data);
            return data;
        })
        .catch(error => {
            console.error('Error al obtener películas:', error);
        });
}


// Función para agregar una película
function agregarPelicula() {
    console.log("Ejecutando agregarPelicula...");

    // Obtener los elementos del formulario
    const tituloInput = document.getElementById("titulo");
    const sinopsisInput = document.getElementById("sinopsis");
    const anyoInput = document.getElementById("anio");
    const portadaInput = document.getElementById("url_portada");
    const cartelInput = document.getElementById("url_cartel");
    const trailerInput = document.getElementById("url_trailer");
    const carruselInput = document.getElementById("url_carrusel");
    const demografiaInput = document.getElementById("demografia");
    const generoInput = document.getElementById("genero");
    const pegiInput = document.getElementById("pegi");

    // Validar que todos los elementos del formulario existen
    if (!tituloInput || !sinopsisInput || !anyoInput || !portadaInput || 
        !cartelInput || !trailerInput || !carruselInput || 
        !demografiaInput || !generoInput || !pegiInput) {
        console.error("Error: Algunos elementos del formulario no fueron encontrados.");
        return;
    }

    // Obtener los valores de los campos del formulario
    const titulo = tituloInput.value.trim();
    const sinopsis = sinopsisInput.value.trim();
    const anyo = anyoInput.value.trim() ? parseInt(anyoInput.value.trim(), 10) : null;
    const url_portada = portadaInput.value.trim() || null;
    const url_cartel = cartelInput.value.trim() || null;
    const url_trailer = trailerInput.value.trim() || null;
    const url_carrusel = carruselInput.value.trim() || null;
    const genero = parseInt(generoInput.value, 10);
    const demografia = parseInt(demografiaInput.value, 10);
    const pegi = parseInt(pegiInput.value, 10);

    // Validar que los campos obligatorios estén completos
    if (!titulo || !sinopsis || isNaN(anyo) || !demografia || !genero || isNaN(pegi)) {
        console.log("Validación fallida: Algunos campos están vacíos o incorrectos.");
        return;
    }

    // Validación del campo 'anyo' para asegurarse que es un año válido
    if (anyo < 1900 || anyo > new Date().getFullYear()) {
        console.log("Validación fallida: El año ingresado no es válido.");
        return;
    }

    if (!anyo) {
        console.log("Validación fallida: El año no puede estar vacío.");
        return;
    }    

    // Crear objeto de película con los valores obtenidos
    const nuevaPelicula = {
        titulo,
        sinopsis,
        anyo: anyo,
        genero,
        url_portada,
        url_cartel,
        url_trailer,
        url_carrusel,
        demografia,
        pegi
    };

    // Verificar los datos antes de enviarlos
    console.log("Objeto nuevaPelicula listo para enviar:", nuevaPelicula);

    // Enviar la película a la API
    fetch(API_URL + "/peliculas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevaPelicula) // Convertir el objeto a formato JSON
    })
    .then(response => {
        if (!response.ok) {
            // Si la respuesta del servidor no es exitosa, lanzar error con mensaje
            return response.text().then(errorMessage => {
                throw new Error(`Error del servidor: ${errorMessage}`);
            });
        }
        return response.json(); // Convertir la respuesta a JSON
    })
    .then(data => {
        console.log("Película agregada con éxito:", data);
        cargarPeliculas(); // Recargar la lista de películas

        // Limpiar los campos del formulario después de agregar exitosamente
        tituloInput.value = "";
        sinopsisInput.value = "";
        anyoInput.value = "";
        portadaInput.value = "";
        cartelInput.value = "";
        trailerInput.value = "";
        carruselInput.value = "";
        demografiaInput.value = "";
        generoInput.value = "";
        pegiInput.value = "";
    })
    .catch(error => {
        console.error("Error al agregar la película:", error);
    });
}





// Función para eliminar una película
function eliminarPelicula(id) {
    return fetch(DELETE_PELICULA + '/' + id, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        alert(`Película eliminada: ${data.titulo}`);
        cargarPeliculas(); // Recargar la lista de películas después de eliminar
    })
    .catch(error => console.error('Error al eliminar la película:', error));
}

// Cargar las opciones del select al cargar la página
function cargarSelects() {
    getGeneros().then(generos => {
        const generoSelect = document.getElementById('genero');
        generos.forEach(genero => {
            const option = document.createElement('option');
            option.value = genero.id_genero;
            option.textContent = genero.nombre_genero;
            generoSelect.appendChild(option);
        });
        console.log('Géneros cargados:', generos);
    });

    getDemografias().then(demografias => {
        console.log('Respuesta de API para demografías:', demografias); // Verifica la estructura de los datos
        const demografiaSelect = document.getElementById('demografia');
        demografias.forEach(demografia => {
            const option = document.createElement('option');
            option.value = demografia.id_demografia;
            option.textContent = demografia.nombre_demografia;
            demografiaSelect.appendChild(option);
        });
        console.log('Demografías cargadas:', demografias);
    }).catch(error => {
        console.error('Error al cargar las demografías:', error); // Asegúrate de capturar errores
    });
    

    getPegi().then(pegis => {
        const pegiSelect = document.getElementById('pegi');
        pegis.forEach(pegi => {
            const option = document.createElement('option');
            option.value = pegi.id_pegi;
            option.textContent = pegi.edad;
            pegiSelect.appendChild(option);
        });
        console.log('PEGI cargado:', pegis);
    });
}

// Función para cargar las películas en el select de eliminación
function cargarSelectEliminarPeliculas() {
    getPeliculas().then(peliculas => {
        const selectEliminar = document.getElementById('peliculas-eliminar-select'); // Asegúrate de que este sea el id correcto
        selectEliminar.innerHTML = ''; // Limpiar el select antes de llenarlo
        
        // Crear una opción predeterminada
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecciona una película para eliminar';
        selectEliminar.appendChild(defaultOption);

        if (peliculas.length === 0) {
            console.log('No hay películas para eliminar');
            return;
        }

        // Recorrer el array de películas y agregar cada una como opción
        peliculas.forEach(pelicula => {
            const option = document.createElement('option');
            option.value = pelicula.id_pelicula;
            option.textContent = pelicula.titulo;
            selectEliminar.appendChild(option);
        });
    }).catch(error => {
        console.error('Error al cargar las películas:', error);
    });
}


// Cargar las películas disponibles en el select de actualización
function cargarPeliculas() {
    getPeliculas().then(peliculas => {
        console.log('Películas obtenidas:', peliculas); // Verifica que este array tenga elementos
    
        // Obtener el primer select (para eliminar películas)
        const selectEliminar = document.getElementById('peliculas-eliminar-select');
        selectEliminar.innerHTML = ''; // Limpiar el select antes de llenarlo
    
        const defaultOptionEliminar = document.createElement('option');
        defaultOptionEliminar.value = '';
        defaultOptionEliminar.textContent = 'Selecciona una película para eliminar';
        selectEliminar.appendChild(defaultOptionEliminar);
    
        // Si no hay películas, salimos de la función
        if (peliculas.length === 0) {
            console.log('No hay películas para eliminar');
        } else {
            // Llenar el select de eliminar con las películas disponibles
            peliculas.forEach(pelicula => {
                const option = document.createElement('option');
                option.value = pelicula.id_pelicula;
                option.textContent = pelicula.titulo;
                selectEliminar.appendChild(option);
            });
        }
    
        // Obtener el segundo select (para mostrar las películas disponibles)
        const selectMostrar = document.getElementById('peliculas-select');
        selectMostrar.innerHTML = ''; // Limpiar el select antes de llenarlo
    
        const defaultOptionMostrar = document.createElement('option');
        defaultOptionMostrar.value = '';
        defaultOptionMostrar.textContent = 'Selecciona una película';
        selectMostrar.appendChild(defaultOptionMostrar);
    
        // Si no hay películas, salimos de la función
        if (peliculas.length === 0) {
            console.log('No hay películas para mostrar');
        } else {
            // Llenar el select de mostrar con las películas disponibles
            peliculas.forEach(pelicula => {
                const option = document.createElement('option');
                option.value = pelicula.id_pelicula;
                option.textContent = pelicula.titulo;
                selectMostrar.appendChild(option);
            });
        }
    })
    .catch(error => {
        console.error('Error al cargar las películas:', error);
    });
    
}

// Función para cargar los detalles de una película seleccionada
function cargarDetallesPelicula() {
    const select = document.getElementById('peliculas-select');
    const idPeliculaSeleccionada = select.value;

    if (!idPeliculaSeleccionada) {
        console.log('No se ha seleccionado una película.');
        return;
    }

    getPeliculas()
        .then(peliculas => {
            const pelicula = peliculas.find(p => p.id_pelicula == idPeliculaSeleccionada);
            if (pelicula) {
                // Mostrar detalles de la película en el formulario
                document.getElementById('titulo').value = pelicula.titulo;
                document.getElementById('sinopsis').value = pelicula.sinopsis;
                document.getElementById('anio').value = pelicula.anyo;
                document.getElementById('genero').value = pelicula.genero;
                document.getElementById('url_cartel').value = pelicula.url_portada;
                document.getElementById('url_trailer').value = pelicula.url_trailer || '';
                document.getElementById('url_carrusel').value = pelicula.url_carrusel || '';
                document.getElementById('demografia').value = pelicula.demografia;
                document.getElementById('pegi').value = pelicula.pegi;

                // Mostrar el formulario de detalles de la película
                document.getElementById('detalles-pelicula').style.display = 'block';
            } else {
                console.log('Película no encontrada');
            }
        })
        .catch(error => {
            console.error('Error al cargar detalles de la película:', error);
        });
}

// Llamar a esta función para cargar las películas cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    cargarPeliculas(); // Cargar las películas en el select
});

// Mostrar el formulario de actualización por defecto al cargar
function showForm(formType) {
    // Ocultar todos los formularios
    document.querySelectorAll('.form-section').forEach(form => form.style.display = "none");

    // Mostrar el formulario seleccionado
    document.getElementById('form-' + formType + '-pelicula').style.display = "block";

    // Cambiar el color del botón activo
    document.querySelectorAll('.action-btn').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById('btn-' + formType).classList.add('active');

    if (formType === 'actualizar') {
        cargarPeliculas(); // Cargar las películas para el select de actualización
    }
}

// Evento DOMContentLoaded para iniciar las funciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const profileRole = localStorage.getItem('profileRole');
    if (profileRole !== 'ADMINISTRADOR') {
        alert('Acceso denegado. Solo los administradores pueden acceder a esta página.');
        window.location.href = 'index.html'; // Redirige si no es admin
    }

    // Cargar los selects con las opciones necesarias (géneros, demografías, PEGI)
    cargarSelects();

    // Mostrar el formulario de actualización de películas por defecto
    showForm('agregar');

    // Agregar película
    document.getElementById('form-agregar-pelicula').addEventListener('submit', function(event) {
        event.preventDefault();

        const titulo = document.getElementById('titulo').value;
        const sinopsis = document.getElementById('sinopsis').value;
        const anio = document.getElementById('anio').value;
        const genero = document.getElementById('genero').value;
        const urlCartel = document.getElementById('url_cartel').value;
        const urlTrailer = document.getElementById('url_trailer').value;
        const urlCarrusel = document.getElementById('url_carrusel').value;
        const demografia = document.getElementById('demografia').value;
        const pegi = document.getElementById('pegi').value;

        const nuevaPelicula = {
            titulo,
            sinopsis,
            anio,
            genero,
            url_cartel: urlCartel,
            url_trailer: urlTrailer,
            url_carrusel: urlCarrusel,
            demografia,
            pegi
        };

        cargarSelectEliminarPeliculas();

        agregarPelicula(nuevaPelicula).then(() => {
            cargarPeliculas(); // Recargar películas después de agregar
        });
    });
});
