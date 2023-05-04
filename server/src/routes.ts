import { Router } from 'express';
import passport from 'passport';
import { EmployeeType } from '@prisma/client';

import { prisma } from '../lib/prisma';
import {
  COOKIE_OPTIONS,
  getAccessToken,
  getRefreshToken,
  verifyUser,
} from '../lib/auth';

const router = Router();

router.post('/signup', async (req, res) => {
  const { firstName, lastName, phone, email, password } = req.body;

  const employee = await prisma.employee.create({
    data: {
      firstName,
      lastName,
      phone,
      email,
      password,
      type: EmployeeType.WS_MANAGER,
    },
  });

  const accessToken = getAccessToken({ userId: employee.id });
  const refreshToken = getRefreshToken({ userId: employee.id });

  // update tokens
  await prisma.employee.update({
    where: { id: employee.id },
    data: {
      accessToken,
      refreshToken,
    },
  });

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
  res.json({ accessToken });
});

router.post('/login', passport.authenticate('local'), async (req, res) => {
  console.log('test login route');
  console.log(req.user);
  const accessToken = getAccessToken({ userId: req.user!.id }); // user type incorrect
  const refreshToken = getRefreshToken({ userId: req.user!.id });

  // update tokens
  await prisma.employee.update({
    where: { id: req.user!.id },
    data: {
      accessToken,
      refreshToken,
    },
  });

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
  res.json({ accessToken });
});

router.post('/refresh', async (req, res) => {
  const { refreshToken: refreshTokenCookie } = req.signedCookies;

  console.log(refreshTokenCookie);

  const employee = await prisma.employee.findFirst({
    where: { refreshToken: refreshTokenCookie },
  });

  if (!refreshTokenCookie || !employee) {
    return res.status(401).json({ msg: 'Unauthorized' }); // can be whatever
  }

  const accessToken = getAccessToken({ userId: employee.id });
  const refreshToken = getRefreshToken({ userId: employee.id });

  // update tokens
  await prisma.employee.update({
    where: { id: employee.id },
    data: {
      accessToken,
      refreshToken,
    },
  });

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
  res.send({ ok: true, accessToken });
});

router.post('/logout', verifyUser, async (req, res) => {
  console.log(req.user);

  const employee = await prisma.employee.findFirst({
    where: { id: req.user!.userId },
  });

  if (!employee) {
    return res.status(401).json({ msg: 'Unauthorized' }); // can be whatever
  }

  // update tokens
  await prisma.employee.update({
    where: { id: employee.id },
    data: {
      accessToken: null,
      refreshToken: null,
    },
  });

  res.clearCookie('refreshToken', COOKIE_OPTIONS);
  res.send({ ok: true });
});

router.get('/me', verifyUser, (req, res) => {
  console.log('in me route');
  console.log(req.user);

  res.json({ user: req.user });
});

export { router };
