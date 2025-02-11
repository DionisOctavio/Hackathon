document.addEventListener('DOMContentLoaded', function() {
    // Obtener el userId desde localStorage
    const userId = localStorage.getItem('userId');
    console.log('User ID from localStorage:', userId); 
    if (!userId) {
        console.error('User ID not found in localStorage');
        return;
    }

    // LE PEDIMOS A LA API LOS PERFILES
    fetch(`http://localhost:3000/perfiles/${userId}`)
        .then(response => {
            console.log('Response status:', response.status);  
            return response.json();
        })
        .then(data => {
            console.log('Data from server:', data); 
            if (!Array.isArray(data)) {
                console.error('Invalid data format:', data);
                return;
            }
            const profilesContainer = document.getElementById('profiles');
            if (!profilesContainer) {
                console.error('Profiles container not found');
                return;
            }
            profilesContainer.innerHTML = '';
            data.forEach(profile => {
                console.log('Profile from server:', profile); 

                const profileDiv = document.createElement('div');
                profileDiv.classList.add('profile');
                profileDiv.innerHTML = `
                    <img src="${profile.url_fotoperfil}" alt="${profile.nombre_perfil}">
                    <p>${profile.nombre_perfil}</p>
                `;

                profileDiv.addEventListener('click', function() {
                    console.log('Saving profileId:', profile.id_perfil); 

                    localStorage.setItem('profileId', profile.id_perfil);
                    localStorage.setItem('profileImg', profile.url_fotoperfil);
                    localStorage.setItem('profileName', profile.nombre_perfil);

                    window.location.href = 'index.html';
                });
                profilesContainer.appendChild(profileDiv);
            });
        })
        .catch(error => console.error('Error:', error));
});

// CONSOLE LOGS
window.onload = function() {
    const profileId = localStorage.getItem('profileId');
    console.log("User ID from localStorage:", localStorage.getItem('userId'));
    console.log("Profile ID from localStorage:", profileId); 
    console.log("Profile Role from localStorage:", localStorage.getItem('profileRole'));
    console.log("Profile Name from localStorage:", localStorage.getItem('profileName'));
    console.log("Profile Image from localStorage:", localStorage.getItem('profileImg'));
    if (!profileId) {
        console.error('No Profile ID found in localStorage');
    }
};


// LOADER 

document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById("loading-screen");
    window.addEventListener("load", () => {
        loadingScreen.style.opacity = "0";
        setTimeout(() => {
            loadingScreen.style.display = "none";
        }, 500);
    });
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const href = this.href;
            loadingScreen.style.display = "flex";
            loadingScreen.style.opacity = "1";
            window.location.href = href;
        });
    });
});