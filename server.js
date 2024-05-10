const express = require('express');
const gemini = require('./gemini');

const app = express();
const port = 3000;

app.use(express.static('public'));

var server = require("http").Server(app);

const io = require("socket.io")(server);

io.on('connection', (socket) => {
    socket.on('chat message', async (msg) => {
        const response = await gemini.invoke(msg.message, msg.imageBase64);

        socket.emit('chat response', response);
    });
});


server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});


