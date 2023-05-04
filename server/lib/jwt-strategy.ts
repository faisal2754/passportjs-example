import passport from 'passport';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  type StrategyOptions,
} from 'passport-jwt';

import { prisma } from './prisma';

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET as string,
};

type TJwtPayload = {
  userId: string;
  iat: number;
  exp: number;
};

const jwtStrategy = new JwtStrategy(
  opts,
  async (jwtPayload: TJwtPayload, done) => {
    console.log('jwt payload', jwtPayload);
    const employee = await prisma.employee.findFirst({
      where: { id: jwtPayload.userId },
    });

    done(null, {
      firstName: employee?.firstName,
      lastName: employee?.lastName,
      email: employee?.email,
      phone: employee?.phone,
      type: employee?.type,
    });
  }
);

passport.use(jwtStrategy);
