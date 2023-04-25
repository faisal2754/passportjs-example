import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import passport from 'passport'
import session from 'express-session'

import { router } from './routes'
import '../lib/jwt-strategy'
import '../lib/local-strategy'

const app = express()

// middleware
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(
  cors({
    credentials: true,
  })
)
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
)
app.use(passport.initialize())

// routes
app.get('/', (req, res) => {
  res.send('Hello World')
})
app.use('/', router)

app.listen(4000, () => {
  console.log('Server is running on port 4000')
})
