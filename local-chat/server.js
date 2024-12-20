const express = require('express');
const WebSocket = require('ws');
const http = require('http');

// 创建一个Express应用
const app = express();
const server = http.createServer(app);

// 创建一个WebSocket服务器
const wss = new WebSocket.Server({ server });

// 监听WebSocket连接
wss.on('connection', (ws) => {
    console.log('A new client connected');

    // 接收到消息时
    ws.on('message', (message) => {
        console.log('Received: %s', message);
        // 广播消息给所有连接的客户端
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // 连接关闭时的处理
    ws.on('close', () => {
        console.log('A client disconnected');
    });
});

// 设置静态文件目录（比如聊天前端）
app.use(express.static('public'));

// 启动HTTP服务器
const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
