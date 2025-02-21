let videoCount = 1;

        function addVideoInput() {
            videoCount++;
            const videoInputsContainer = document.querySelector('.video-inputs');
            const newVideoInput = document.createElement('div');
            newVideoInput.classList.add('video-input');
            newVideoInput.innerHTML = `
                <label for="video-url-${videoCount}">URL del Video</label>
                <input type="url" id="video-url-${videoCount}" name="video-url-${videoCount}" placeholder="URL del video">
            `;
            videoInputsContainer.insertBefore(newVideoInput, document.querySelector('.add-video-btn'));
        }

        document.querySelector('.add-course-btn').addEventListener('click', () => {
            const empresa = document.getElementById('empresa').value;
            const dificultad = document.getElementById('dificultad').value;
            const genero = document.getElementById('genero').value;
            const titulo = document.getElementById('titulo').value;
            const url = document.getElementById('url').value;

            let videos = [];
            for (let i = 1; i <= videoCount; i++) {
                const videoUrl = document.getElementById(`video-url-${i}`).value;
                if (videoUrl) {
                    videos.push(videoUrl);
                }
            }

            // Mostrar los videos añadidos
            const videoList = document.getElementById('video-list');
            videoList.innerHTML = '';
            videos.forEach((video, index) => {
                const videoItem = document.createElement('div');
                videoItem.textContent = `Video ${index + 1}: ${video}`;
                videoList.appendChild(videoItem);
            });

            // Aquí puedes agregar el código para almacenar los datos en la base de datos

            alert('Curso añadido con éxito!');
        });