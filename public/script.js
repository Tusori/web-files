async function fetchVideos() {
    try {
        const response = await fetch('/videos');
        const videoFiles = await response.json();
        const gridContainer = document.getElementById('gridContainer');

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
            p.innerText = file.split('.')[0]; //ипользуем имя файла без расширения

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

function editTitle(element) {
    const newTitle = prompt('Enter new title:', element.innerText);
    if (newTitle !== null) {
        element.innerText = newTitle;
        const itemId = element.parentNode.id;
        
        // Обновляем имя файла
        const videoElement = document.getElementById(itemId).querySelector('video');
        const currentSrc = videoElement.src;
        const newSrc = currentSrc.replace(/\/[^/]+$/, `/${newTitle}.mp4`); // Заменяем последний сегмент URL на новое имя
        videoElement.src = newSrc;

        // Сохраняем новый заголовок в localStorage
        localStorage.setItem(`title_${itemId}`, newTitle);
    }
}

//загрузка видео при загрузке страницы
fetchVideos();




function sideMenu(){
    var sideMenu = document.getElementById('sideMenu');
    sideMenu.classList.toggle('expanded');
    
}

function addFileFunction(){
    var inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.style.display = 'none';
    inputFile.multiple = false; 

    document.body.appendChild(inputFile);
    
    inputFile.click();

    inputFile.addEventListener('change', function() {
        var selectedFile = inputFile.files[0];
        if(selectedFile) {
            var filePath = URL.createObjectURL(selectedFile); //сохраняет путь файла

            //создание нового элемента для грид контейнера
            var gridContainer = document.getElementById('gridContainer');
            var newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.textContent = selectedFile.name; //название файла

            gridContainer.appendChild(newItem); //добавление нового элемента в грид

            
        }
        
    });
}

//grid elementu nosaukuma mainisana
document.addEventListener('DOMContentLoaded', (event) => {
    //localStorage
    document.querySelectorAll('.item p').forEach(paragraph => {
        const itemId = paragraph.parentElement.id;
        const savedTitle = localStorage.getItem('title_' + itemId);
        if (savedTitle) {
            paragraph.textContent = savedTitle;
        }
    });
});

// function editTitle(element) {
//     var currentTitle = element.textContent;
//     var input = document.createElement('input');
//     input.type = 'text';
//     input.value = currentTitle;

//     element.replaceWith(input);
//     input.focus();

//     input.addEventListener('blur', function() {
//         saveTitle(element, input);
//     });

//     input.addEventListener('keypress', function(event) {
//         if (event.key === 'Enter') {
//             saveTitle(element, input);
//         }
//     });
// }

// function saveTitle(element, input) {
//     element.textContent = input.value;
//     input.replaceWith(element);

//     var itemId = element.parentElement.id;
//     localStorage.setItem('title_' + itemId, input.value);

//     //обновляем содержимое <p> тега в HTML-документе
//     let paragraph = document.querySelector('#' + itemId + ' p');
//     if (paragraph) {
//         paragraph.textContent = input.value;
//     }
// }

// function openVideo(videoURL){
//     window.open(videoURL, "_blank")
    
// }