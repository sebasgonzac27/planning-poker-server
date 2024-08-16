import { createServer } from 'http'
import { Server } from 'socket.io'
import app from './app.js'
import socketEvents from './sockets/socketsEvents.js'
import CONFIG from './config.js'

const server = createServer(app)
export const io = new Server(server, {
  cors: {
    origin: CONFIG.clientUrl,
    methods: ['GET', 'POST']
  }
})
const { setupSocket } = socketEvents(io)

const PORT = CONFIG.port

server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
  setupSocket()
})
