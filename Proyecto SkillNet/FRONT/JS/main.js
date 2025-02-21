// Rutas de la API
const API_URL = "http://localhost:3000";

// RUTAS ELEMENTOS
const GET_CURSOS = API_URL + `/cursos`;

document.addEventListener('DOMContentLoaded', () => {
    getCursos(); // Llama a la función para obtener los cursos cuando el DOM esté listo
});

async function getCursos() {
    try {
        const response = await fetch(GET_CURSOS); // Llamada al endpoint
        const data = await response.json();
        console.log(data); // Verifica los datos en la consola
        pintarCursos(data); // Llama a la función para pintar los cursos
    } catch (error) {
        console.error("Error al obtener los cursos:", error);
    }
}

function pintarCursos(cursos) {
    console.log('Cursos a pintar:', cursos);  // Verifica los datos en la consola
    const espacioCursos = document.getElementById("cont-cursos");

    espacioCursos.innerHTML = ""; // Limpiar el contenedor

    // Recorrer todos los cursos y crear un contenedor para cada uno
    cursos.forEach(curso => {
        const cursoDiv = document.createElement('div');
        cursoDiv.classList.add('curso-item');
        cursoDiv.setAttribute("data-id", curso.id_curso);

        // Usar los nuevos datos: empresa, dificultad, genero, titulo, url
        cursoDiv.innerHTML = `
            <div class="curso-targeta">
                <img src="${curso.url}" alt="${curso.titulo}" class="imagen-curso">
                <h3>${curso.titulo}</h3>
                <p><strong>Empresa:</strong> ${curso.empresa}</p>
                <p><strong>Dificultad:</strong> ${curso.dificultad}</p>
                <p><strong>Género:</strong> ${curso.genero}</p>
            </div>
        `;

        // Manejar el clic para redirigir al detalle del curso y guardar los datos en localStorage
        cursoDiv.addEventListener("click", function () {
            const idCurso = this.getAttribute("data-id");

            // Buscar el curso correspondiente en los datos
            const cursoSeleccionado = cursos.find(curso => curso.id_curso === idCurso);
            
            // Guardar el curso seleccionado en localStorage
            localStorage.setItem('cursoSeleccionado', JSON.stringify(cursoSeleccionado));

            // Redirigir a curso.html pasando el id_curso en la URL
            window.location.href = `curso.html?id_curso=${idCurso}`;
        });

        espacioCursos.appendChild(cursoDiv);
    });
}


