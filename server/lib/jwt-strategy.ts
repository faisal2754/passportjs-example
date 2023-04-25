import passport from 'passport'
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  type StrategyOptions,
} from 'passport-jwt'

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET as string,
}

const jwtStrategy = new JwtStrategy(opts, (jwtPayload, done) => {
  done(null, jwtPayload)
})

passport.use(jwtStrategy)
