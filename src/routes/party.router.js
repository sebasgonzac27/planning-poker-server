import { Router } from 'express'
import gameService from '../services/gameService.js'
import { io } from '../server.js'

const router = Router()

router.post('/', (req, res) => {
  const { name } = req.body
  const newRoom = gameService.createRoom(name)
  res.status(201).json(newRoom)
})

router.get('/', (req, res) => {
  const rooms = gameService.getRooms()
  res.json(rooms)
})

router.post('/vote', (req, res) => {
  const { roomId, userId, vote } = req.body
  gameService.vote(roomId, userId, vote)
  const room = gameService.getRoom(roomId)
  const players = room.players
  io.to(roomId).emit('update-players', { players })
  res.status(200).json('Voto registrado')
})

router.get('/average/:roomId', (req, res) => {
  const { roomId } = req.params
  const result = gameService.revealCards(roomId)
  io.to(roomId).emit('reveal-cards', result)
  res.status(200).json('Cartas reveladas')
})

router.get('/reset/:roomId', (req, res) => {
  const { roomId } = req.params
  gameService.newVotation(roomId)
  const room = gameService.getRoom(roomId)
  const players = room.players
  io.to(roomId).emit('reset-party', { players })
  res.status(200).json('Votación reiniciada')
})

router.put('/toggle-role', (req, res) => {
  const { roomId, userId, role } = req.body
  gameService.toggleRole(roomId, userId, role)
  const room = gameService.getRoom(roomId)
  const players = room.players
  io.to(roomId).emit('update-players', { players })
  res.status(200).json('Rol cambiado')
})

router.put('/toggle-distribution', (req, res) => {
  const { roomId, distribution } = req.body
  const room = gameService.getRoom(roomId)
  if (room.players.some(player => player.vote !== null)) {
    gameService.newVotation(roomId)
    io.to(roomId).emit('update-players', { players: room.players })
  }
  gameService.toggleDistribution(roomId, distribution)
  io.to(roomId).emit('update-distribution', { distribution: room.distribution })
  res.status(200).json('Distribución cambiada')
})

router.get('/roles', (req, res) => {
  const roles = gameService.getRoles()
  res.json(roles)
})

router.get('/distributions', (req, res) => {
  const distributions = gameService.getDistributions()
  res.json(distributions)
})

router.put('/toggle-admin', (req, res) => {
  const { roomId, userId } = req.body
  gameService.toggleAdmin(roomId, userId)
  const room = gameService.getRoom(roomId)
  const players = room.players
  io.to(roomId).emit('update-players', { players })
  res.status(200).json('Administrador cambiado')
})

export default router
