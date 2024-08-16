import gameService from '../services/gameService.js'

export default (io) => {
  const setupSocket = () => {
    io.on('connection', (socket) => {
      console.log('Nuevo usuario conectado')

      socket.on('join-party', (userData) => {
        const { name, role, partyId } = userData
        socket.join(partyId)
        const room = gameService.getRoom(partyId)
        gameService.joinRoom(partyId, name, socket.id, role)
        io.to(partyId).emit('join-party', {
          party: {
            name: room.name,
            id: room.id,
            distribution: room.distribution
          },
          players: gameService.getPlayers(partyId)
        })
        socket.on('disconnect', () => {
          gameService.leaveRoom(partyId, socket.id)
          io.to(partyId).emit('join-party', {
            party: {
              name: room.name,
              id: room.id
            },
            players: gameService.getPlayers(partyId)
          })
        })
      })
    })
  }

  return { setupSocket }
}
