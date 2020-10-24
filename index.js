const express = require('express');
const path = require('path')
const http = require('http');
const socketio = require('socket.io');
const { Socket } = require('dgram');
const app = express();
const { reusableFxn, reusableLocationFxn } = require('./src/config/util/messages');
const server = http.createServer(app);
const { addUser, removeUser, getUser, getUserWithInRoom } = require('./src/config/util/users')
const io = socketio(server)
const publicDirectoryPath = path.join(__dirname, '/public')
app.use(express.static(publicDirectoryPath))
port = process.env.PORT;
let count = 0;
const Filter = require('bad-words')
io.on('connection', (socket) => {
    socket.on('join', ({ userName, room }, callback) => {
        const { user, error } = addUser({ id: socket.id, userName, room })
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', reusableFxn('Admin', 'Welcome'))
        socket.broadcast.to(user.room).emit('message', reusableFxn(`${user.userName} has joined`));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserWithInRoom(user.room)
        })
        callback()
    })
    socket.on('gettingMsg', (msg, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter();
        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed');
        }
        io.to(user.room).emit('message', reusableFxn(user.userName, msg))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', reusableFxn('Admin', `${user.userName} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUserWithInRoom(user.room)
            })
        }

    })
    socket.on('sendLocation', (data, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('senLoc', reusableLocationFxn(user.userName, `https://www.google.com/maps?q=${data.latitude},${data.longitude}`))
        callback()
    })
})
server.listen(port, () => {
    console.log('server starting on ' + port);
})