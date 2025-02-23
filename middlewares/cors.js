import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:5173',
  'https://victoriaseguros.com',
  'http://victoriaseguros.com',
  '*'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    console.log("Origen", origin)

   

    if (acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }
    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
})
