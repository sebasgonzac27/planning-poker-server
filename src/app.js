import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import partyRouter from './routes/party.router.js'
import CONFIG from './config.js'

const app = express()

app.use(cors({
  origin: CONFIG.clientUrl,
  credentials: true
}))
app.use(express.json())
app.use(logger('dev'))
app.use('/party', partyRouter)

export default app
