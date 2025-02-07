document.addEventListener('DOMContentLoaded', function() {
    // Obtener el userId desde localStorage
    const userId = localStorage.getItem('userId');
    console.log('User ID from localStorage:', userId); // Verifica si el userId se recupera correctamente

    if (!userId) {
        console.error('User ID not found in localStorage');
        return;
    }

    // Hacer la solicitud fetch para obtener los perfiles
    fetch(`http://localhost:3000/perfiles/${userId}`)
        .then(response => {
            console.log('Response status:', response.status);  // Verifica el estado de la respuesta
            return response.json();
        })
        .then(data => {
            console.log('Data from server:', data); // Verifica los datos que recibes del servidor

            // Verificar si la respuesta es un array válido
            if (!Array.isArray(data)) {
                console.error('Invalid data format:', data);
                return;
            }

            // Obtener el contenedor de perfiles
            const profilesContainer = document.getElementById('profiles');
            if (!profilesContainer) {
                console.error('Profiles container not found');
                return;
            }

            // Limpiar cualquier contenido previo en el contenedor
            profilesContainer.innerHTML = '';

            // Iterar sobre los perfiles y mostrarlos en consola y página
            data.forEach(profile => {
                // Log para cada perfil
                console.log('Profile from server:', profile); // Esto imprimirá cada perfil individualmente

                const profileDiv = document.createElement('div');
                profileDiv.classList.add('profile');
                profileDiv.innerHTML = `
                    <img src="${profile.url_fotoperfil}" alt="${profile.nombre_perfil}">
                    <p>${profile.nombre_perfil}</p>
                `;

                // Agregar un event listener al hacer clic en un perfil
                profileDiv.addEventListener('click', function() {
                    console.log('Saving profileId:', profile.id_perfil); // Verifica que se guarda correctamente

                    // Guardar los datos en localStorage
                    localStorage.setItem('profileId', profile.id_perfil);
                    localStorage.setItem('profileImg', profile.url_fotoperfil);
                    localStorage.setItem('profileName', profile.nombre_perfil);

                    // Redirigir a la página 'index.html'
                    window.location.href = 'index.html';
                });

                // Agregar el perfil al contenedor
                profilesContainer.appendChild(profileDiv);
            });
        })
        .catch(error => console.error('Error:', error));
});

// Cuando se carga la página 'index.html' o la página de destino
window.onload = function() {
    // Verificar si los valores están en localStorage
    const profileId = localStorage.getItem('profileId');
    console.log("User ID from localStorage:", localStorage.getItem('userId'));
    console.log("Profile ID from localStorage:", profileId); // Verifica que se haya guardado correctamente
    console.log("Profile Role from localStorage:", localStorage.getItem('profileRole'));
    console.log("Profile Name from localStorage:", localStorage.getItem('profileName'));
    console.log("Profile Image from localStorage:", localStorage.getItem('profileImg'));

    // Verifica si profileId existe y muestra un mensaje en caso contrario
    if (!profileId) {
        console.error('No Profile ID found in localStorage');
    }
};
