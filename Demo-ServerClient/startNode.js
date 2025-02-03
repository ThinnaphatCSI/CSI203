
const os = require('os');
const host = os.hostname();
const http = require('http');
const hostname = '127.0.0.1';
const port = 8000;

const server = http.createServer((req, res) => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`CSI203: DIGITAL ARCHITECTURE AND OPERATING SYSTEM\n
This is a sample learning tool for the CSI 203 course.\n\n
\tWorkshop #3: startNode.js`);
});

server.listen(port, hostname, () => {
    console.log(`Hostname: ${host}`);
    console.log(`Server running at http://${hostname}:${port}/`);
});