import { config } from 'dotenv'
config()
const CONFIG = {
  port: process.env.PORT || 3000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000'
}

export default CONFIG
