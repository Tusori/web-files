const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const videoDirectory = path.join(__dirname, 'public', 'savedfiles');

app.use(express.static('public'));

app.get('/videos', (req, res) => {
    fs.readdir(videoDirectory, (err, files) => {
        if (err) {
            res.status(500).send('Unable to scan directory: ' + err);
            return res.status(500).json({ error: 'Unable to scan directory' });
        }
        
        const videoFiles = files.filter(file => file.endsWith('.mp4'));

        console.log(videoFiles); // Добавьте эту строку для проверки

        res.json(videoFiles);
    });
});

app.listen(PORT, () => {
    console.log('server is running on http://localhost:'+ PORT);
});