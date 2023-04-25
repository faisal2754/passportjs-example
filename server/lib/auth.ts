import passport from 'passport'
import jwt from 'jsonwebtoken'
import { CookieOptions } from 'express'

export const getAccessToken = (userId: any) => {
  return jwt.sign(userId, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: 15 * 60,
  })
}

export const getRefreshToken = (userId: any) => {
  return jwt.sign(userId, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: 15 * 60 * 2,
  })
}

export const verifyUser = passport.authenticate('jwt', { session: false })

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: false,
  signed: true,
  maxAge: 60 * 60 * 24 * 30 * 1000,
  sameSite: 'none',
}
