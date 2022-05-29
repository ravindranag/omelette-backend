const express = require('express')
const cors = require('cors')
    // const helmet = require('helmet')
const http = require('http')
const { Server } = require('socket.io')


// server
const app = express()
    // console.log(cors)
    // app.use(cors())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
        return res.status(200).json({})
    }
    next()
})

const server = http.createServer(app)

// socket instance
const io = new Server(server)


app.get('/', (req, res) => {
    res.status(200).json({ message: 'OK' })
})

io.on('connection', (socket) => {
    console.log('user connected')

    socket.on('send', (msg) => {
        console.log(msg)
        socket.broadcast.emit('send', msg)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

app.use((error, req, res, next) => {
    const result = {
        message: error.message,
        status: error.status,
        error: error
    }
    res.status(404).json(result)
})

server.listen(8000, () => {
    console.log('listening on port 8000')
})

module.exports = app