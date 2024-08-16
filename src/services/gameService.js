import { randomId } from '../utils/index.js'

class GameService {
  constructor () {
    this.rooms = []
    this.roles = [
      {
        value: 'player',
        label: 'Jugador'
      },
      {
        value: 'viewer',
        label: 'Espectador'
      }
    ]
    this.distributions = [{
      id: 'fibonacci',
      name: 'Fibonacci',
      values: [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?', '☕']
    },
    {
      id: 'lineal',
      name: 'Lineal',
      values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '?', '☕']
    },
    {
      id: 'power-of-two',
      name: 'Potencias de 2',
      values: [0, 1, 2, 4, 8, 16, 32, 64, 128, '?', '☕']
    }
    ]
  }

  getRooms () {
    return this.rooms
  }

  getRoom (roomId) {
    return this.rooms.find(room => room.id === roomId)
  }

  createRoom (roomName) {
    const roomId = randomId()
    if (this.rooms.find(room => room.id === roomId)) {
      throw new Error('La sala ya existe')
    }
    const newRoom = {
      id: roomId,
      name: roomName,
      players: [],
      average: 0,
      distribution: this.distributions[0]
    }

    this.rooms.push(newRoom)
    return newRoom
  }

  joinRoom (roomId, username, socketId, role) {
    const room = this.rooms.find(room => room.id === roomId)
    if (!room) {
      throw new Error('La sala no existe')
    }
    const isOwner = room.players.length === 0
    room.players.push({
      username,
      socketId,
      role,
      isOwner,
      vote: null
    })
  }

  leaveRoom (roomId, socketId) {
    const room = this.rooms.find(room => room.id === roomId)
    if (!room) {
      throw new Error('La sala no existe')
    }
    const playerIndex = room.players.findIndex(player => player.socketId === socketId)
    if (playerIndex === -1) {
      throw new Error('El jugador no está en la sala')
    }
    room.players.splice(playerIndex, 1)
  }

  getPlayers (roomId) {
    const room = this.rooms.find(room => room.id === roomId)
    if (!room) {
      throw new Error('La sala no existe')
    }
    return room.players
  }

  vote (roomId, userId, vote) {
    const room = this.rooms.find(room => room.id === roomId)
    if (!room) {
      throw new Error('La sala no existe')
    }
    const player = room.players.find(player => player.socketId === userId)
    if (!player) {
      throw new Error('El jugador no está en la sala')
    }
    player.vote = vote
  }

  toggleRole (roomId, userId, role) {
    const room = this.rooms.find(room => room.id === roomId)
    if (!room) {
      throw new Error('La sala no existe')
    }
    const player = room.players.find(player => player.socketId === userId)
    if (!player) {
      throw new Error('El jugador no está en la sala')
    }
    player.role = role
  }

  revealCards (roomId) {
    const room = this.rooms.find(room => room.id === roomId)
    if (!room) {
      throw new Error('La sala no existe')
    }

    const playerVotes = room.players
      .filter(player => player.role === 'player' && player.vote !== null)
      .map(player => player.vote)

    const numericVotes = playerVotes.filter(vote => !isNaN(parseInt(vote)))
    const totalVotes = numericVotes.reduce((acc, vote) => acc + parseInt(vote), 0)
    const average = totalVotes / numericVotes.length
    const votesCount = playerVotes.reduce((acc, vote) => {
      acc[vote] = acc[vote] ? acc[vote] + 1 : 1
      return acc
    }, {})
    return { average, votesCount }
  }

  newVotation (roomId) {
    const room = this.rooms.find(room => room.id === roomId)
    if (!room) {
      throw new Error('La sala no existe')
    }
    room.average = 0
    room.players.forEach(player => {
      player.vote = null
    })
  }

  getRoles () {
    return this.roles
  }

  getDistributions () {
    return this.distributions.map(distribution => ({ name: distribution.name, id: distribution.id }))
  }

  toggleDistribution (roomId, distributionId) {
    const room = this.rooms.find(room => room.id === roomId)
    if (!room) {
      throw new Error('La sala no existe')
    }
    const distribution = this.distributions.find(distribution => distribution.id === distributionId)
    if (!distribution) {
      throw new Error('La distribución no existe')
    }
    room.distribution = distribution
  }

  toggleAdmin (roomId, userId) {
    const room = this.rooms.find(room => room.id === roomId)
    if (!room) {
      throw new Error('La sala no existe')
    }
    const currentAdmin = room.players.find(player => player.isOwner)
    if (currentAdmin) {
      currentAdmin.isOwner = false
    }
    const newAdmin = room.players.find(player => player.socketId === userId)
    if (!newAdmin) {
      throw new Error('El jugador no está en la sala')
    }
    newAdmin.isOwner = true
  }
  // TODO: Agregar más métodos como vote, revealCards, etc.
}

export default new GameService()
