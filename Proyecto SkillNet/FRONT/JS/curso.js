const API_URL = "http://localhost:3000";

document.addEventListener('DOMContentLoaded', async () => {
    const contenedorCurso = document.getElementById("contenedor-curso");
    const contenedorVideos = document.getElementById("contenedor-videos");
    const cursoId = new URLSearchParams(window.location.search).get('id_curso');  // Obtener el id_curso de la URL
    
    console.log("ID del curso recibido:", cursoId);  // Mostrar el ID del curso en la consola

    try {
        // Obtener los datos del curso
        const responseCurso = await fetch(`${API_URL}/cursos/${cursoId}`);
        
        // Verificar si la respuesta es exitosa
        if (!responseCurso.ok) {
            throw new Error("Error al cargar los datos del curso");
        }

        const cursoData = await responseCurso.json();
        console.log("Datos del curso:", cursoData);

        // Mostrar los datos del curso
        if (cursoData) {
            contenedorCurso.innerHTML = `
                <h2>${cursoData.titulo}</h2>
                <p><strong>Empresa:</strong> ${cursoData.empresa}</p>
                <p><strong>Dificultad:</strong> ${cursoData.dificultad}</p>
                <p><strong>Género:</strong> ${cursoData.genero}</p>
                <p><strong>Descripción:</strong> ${cursoData.descripcion}</p>
                <p><strong>URL:</strong> <a href="${cursoData.url}" target="_blank">Acceder al curso</a></p>
            `;

            // Mostrar las películas recomendadas, si existen
            if (cursoData.peliculas && cursoData.peliculas.length > 0) {
                const peliculasHTML = cursoData.peliculas.map(pelicula => `
                    <div>
                        <img src="${pelicula.imagen}" alt="${pelicula.titulo}" width="150" height="200">
                        <p>${pelicula.titulo}</p>
                    </div>
                `).join('');
                contenedorCurso.innerHTML += `<h3>Películas recomendadas:</h3>${peliculasHTML}`;
                console.log("Películas recomendadas:", cursoData.peliculas);
            }

            // Obtener los videos del curso
            const responseVideos = await fetch(`${API_URL}/curso/video/${cursoId}`);

            // Verificar si la respuesta es exitosa
            if (!responseVideos.ok) {
                throw new Error("Error al cargar los videos del curso");
            }

            const videosData = await responseVideos.json();
            console.log("Datos de los videos:", videosData);

            // Mostrar los videos con iframe
            if (videosData.length > 0) {
                const videosHTML = videosData.map(video => `
                    <div>
                        <iframe width="560" height="315" src="${video.id_video}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        <p>${video.titulo}</p>
                    </div>
                `).join('');
                contenedorVideos.innerHTML = `<h3>Videos del curso:</h3>${videosHTML}`;
            } else {
                contenedorVideos.innerHTML = '<p>No hay videos disponibles para este curso.</p>';
            }
        } else {
            contenedorCurso.innerHTML = '<p>Curso no encontrado.</p>';
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        contenedorCurso.innerHTML = '<p>Error al cargar los datos del curso.</p>';
    }
});
