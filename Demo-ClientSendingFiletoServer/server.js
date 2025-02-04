const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8100;

app.use(cors()); // อนุญาตให้ Frontend เรียกใช้งาน
app.use(express.static('uploads')); // ให้เข้าถึงไฟล์ที่อัปโหลด

// ตั้งค่าที่เก็บไฟล์อัปโหลด
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// 📌 อัปโหลดไฟล์จาก Client -> Server
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

// 📌 แสดงรายการไฟล์ที่มีในเซิร์ฟเวอร์
app.get('/files', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) return res.status(500).json({ error: 'Unable to list files' });
        res.json(files);
    });
});

// 📌 ให้ Client ดาวน์โหลดไฟล์จาก Server
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath);
});

// 📌 เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
