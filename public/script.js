async function fetchVideos() {
    try {
        const response = await fetch('/videos');
        const videoFiles = await response.json();
        const gridContainer = document.getElementById('gridContainer');

        gridContainer.innerHTML = ''; //очиста грид контейнера

        videoFiles.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'item';
            item.id = index + 1;

            const video = document.createElement('video');
            video.src = `savedfiles/${file}`;
            video.setAttribute('onclick', `openVideo('${video.src}')`);
            //video.controls = true;

            const p = document.createElement('p');
            p.setAttribute('ondblclick', 'editTitle(this)');
            const storedTitle = localStorage.getItem(`title_${item.id}`);
            p.innerText = storedTitle ? storedTitle : file.split('.')[0]; //ипользуем имя файла без расширения

            item.appendChild(video);
            item.appendChild(p);
            gridContainer.appendChild(item);
        });
    } catch (error) {
        console.error('Error fetching video files:', error);
    }
}

function openVideo(videoUrl) {
    window.open(videoUrl, '_blank');
}

async function editTitle(element) {
    const newTitle = prompt('Enter new title:', element.innerText);
    if (newTitle !== null) {
        const itemId = element.parentNode.id;
        
        //получаем элемент <video> и его текущий src
        const videoElement = document.getElementById(itemId).querySelector('video');
        const currentSrc = videoElement.src;
        const currentFileName = currentSrc.split('/').pop();
        const newFileName = `${newTitle}.mp4`;
        
        try {
            //отправляем запрос на сервер для переименования файла
            const renameResponse = await fetch(`/rename/${currentFileName}/${newFileName}`, {
                method: 'PUT'
            });

            if (!renameResponse.ok) {
                throw new Error('Failed to rename file');
            }

            //обновляем DOM
            element.innerText = newTitle;
            const newSrc = currentSrc.replace(/\/[^/]+$/, `/${newFileName}`); //заменяем последний сегмент url на новое имя
            videoElement.src = newSrc;

            //сохраняем новый заголовок в localstorage
            localStorage.setItem(`title_${itemId}`, newTitle);
        } 
        catch (error) {
            console.error('Error renaming file:', error);
            alert('Failed to rename file');
        }
    }
}

// function editTitle(element) {
//     const newTitle = prompt('Enter new title:', element.innerText);
//     if (newTitle !== null) {
//         element.innerText = newTitle;
//         const itemId = element.parentNode.id;
        
//         //обновляем имя файла
//         const videoElement = document.getElementById(itemId).querySelector('video');
//         const currentSrc = videoElement.src;
//         const newSrc = currentSrc.replace(/\/[^/]+$/, `/${newTitle}.mp4`); // Заменяем последний сегмент URL на новое имя
//         videoElement.src = newSrc;
//         localStorage.setItem(`title_${itemId}`, newTitle);
//     }
// }

//загрузка видео при загрузке страницы
fetchVideos();




function sideMenu(){
    var sideMenu = document.getElementById('sideMenu');
    sideMenu.classList.toggle('expanded');
    
}

function addFileFunction(){
    document.getElementById('fileInput').click();
}

function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('File uploaded successfully');
                fetchVideos(); //заполняем старницу по новой видосами
            } else {
                alert('Failed to upload file');
            }
        })
        .catch(error => {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        });
    }
}

//grid elementu nosaukuma mainisana
document.addEventListener('DOMContentLoaded', (event) => {
    //local storage
    document.querySelectorAll('.item p').forEach(paragraph => {
        const itemId = paragraph.parentElement.id;
        const savedTitle = localStorage.getItem('title_' + itemId);
        if (savedTitle) {
            paragraph.textContent = savedTitle;
        }
    });
});

//delete
function deleteFileFunction() {
    const gridContainer = document.getElementById('gridContainer');
    const items = gridContainer.querySelectorAll('.item');

    items.forEach(item => {
        //удаляем существующий оверлей, если он есть
        const existingOverlay = item.querySelector('.overlay');
        if (existingOverlay) {
            item.removeChild(existingOverlay);
        }

        //создаем новый оверлей
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        item.appendChild(overlay);

        //кликаем для выделения элемента
        overlay.addEventListener('click', function handleOverlayClick(e) {
            e.stopPropagation();
            item.classList.toggle('selected');
        }, { once: true });
    });

    //показываем кнопки ок и cancel
    const deleteButtonContainer = document.getElementById('deleteButtons');
    deleteButtonContainer.classList.add('true');
}

function cancelDelete() {
    const gridContainer = document.getElementById('gridContainer');
    const items = gridContainer.querySelectorAll('.item');

    items.forEach(item => {
        //убираем выделение с элемента
        item.classList.remove('selected');
        //кдаляем оверлей
        const overlay = item.querySelector('.overlay');
        if (overlay) {
            item.removeChild(overlay);
        }
    });

    //прячем кнопки ок и cancel
    const deleteButtonContainer = document.getElementById('deleteButtons');
    deleteButtonContainer.classList.remove('true');
}
