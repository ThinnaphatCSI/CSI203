const WebSocket = require('ws');

// สร้าง WebSocket Server
const wss = new WebSocket.Server({ port: 8080 }, () => {
    console.log('WebSocket server is running on ws://localhost:8080');
});

// ฟังการเชื่อมต่อจากไคลเอ็นต์
wss.on('connection', (ws) => {
    console.log('A client connected.');

    // รับข้อความจากไคลเอ็นต์
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);

        // ส่งข้อความตอบกลับไปยังไคลเอ็นต์
        ws.send(`Server received: ${message}`);
    });

    // เมื่อไคลเอ็นต์ปิดการเชื่อมต่อ
    ws.on('close', () => {
        console.log('A client disconnected.');
    });
});
