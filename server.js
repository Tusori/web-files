const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;
const videoDirectory = path.join(__dirname, 'public', 'savedfiles');

app.use(express.static('public'));
app.use(express.json());

app.get('/videos', (req, res) => {
    fs.readdir(videoDirectory, (err, files) => {
        if (err) {
            res.status(500).send('Unable to scan directory: ' + err);
            return res.status(500).json({ error: 'Unable to scan directory' });
        }
        
        const videoFiles = files.filter(file => file.endsWith('.mp4'));

        console.log(videoFiles); //для проверки

        res.json(videoFiles);
    });
});

//переименование файлов
app.put('/rename/:currentFileName/:newFileName', (req, res) => {
    const currentFileName = req.params.currentFileName;
    const newFileName = req.params.newFileName;
    const currentFilePath = path.join(videoDirectory, currentFileName);
    const newFilePath = path.join(videoDirectory, newFileName);

    fs.rename(currentFilePath, newFilePath, (err) => {
        if (err) {
            console.error('Error renaming file:', err);
            res.status(500).send('Error renaming file');
        } else {
            res.send('File renamed successfully');
        }
    });
});

//добавление новых файлов 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, videoDirectory);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

//путь для загрузки файлов
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    res.json({ success: true, message: 'File uploaded successfully' });
});

//удаления файлов
app.post('/delete', (req, res) => {
    const filesToDelete = req.body.files;
    console.log('Files to delete:', filesToDelete); //логи
    if (!Array.isArray(filesToDelete) || filesToDelete.length === 0) {
        return res.status(400).json({ success: false, message: 'No files specified for deletion' });
    }

    let deletePromises = filesToDelete.map(fileName => {
        const filePath = path.join(videoDirectory, fileName);
        return fs.promises.unlink(filePath);
    });

    Promise.all(deletePromises)
        .then(() => {
            res.json({ success: true, message: 'Files deleted successfully' });
        })
        .catch(err => {
            console.error('Error deleting files:', err);
            res.status(500).json({ success: false, message: 'Error deleting files', error: err });
        });
});

app.listen(PORT, () => {
    console.log('ABOBA, this is Anadeus project, made by Tusori');
    console.log('server is running on http://localhost:'+ PORT);
});