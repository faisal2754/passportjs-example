import { Strategy as LocalStrategy } from 'passport-local'
import passport from 'passport'

import { prisma } from './prisma'

const localStrategy = new LocalStrategy(async (username, password, done) => {
  const user = await prisma.employee.findFirst({
    where: {
      email: username,
      password: password,
    },
  })

  if (!user) {
    return done(null, false, { message: 'Incorrect username or password' })
  } else {
    return done(null, user)
  }
})

passport.use(localStrategy)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, 'test user')
})
