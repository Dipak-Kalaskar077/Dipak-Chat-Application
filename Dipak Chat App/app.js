const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Corrected console.log statement
const server = app.listen(PORT, () => console.log(`Server on port ${PORT}`));

const io = require('socket.io')(server);

let socketConnected = new Set();

io.on('connection', onConnected);

function onConnected(socket) {
    console.log(socket.id);
    socketConnected.add(socket.id);

    io.emit('clients-total', socketConnected.size);

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
        socketConnected.delete(socket.id);
        io.emit('clients-total', socketConnected.size);
    });

    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit('chat-message', data);
    });
}
