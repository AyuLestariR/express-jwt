import { Router } from 'express';
import m$auth from '#module/auth.m.mjs';
import response from '#helper/response.mjs';
import employeeCookie from '#helper/middleware.mjs';

const AuthController = Router();

AuthController.post('/login', async (req, res, next) => {
  const c$login = await m$auth.login(req.body);
  response.send(res, c$login);
});

AuthController.get('/logout', employeeCookie, async (req, res, next) => {
  const c$logout = await m$auth.logout(req.member.session);
  res.clearCookie('sessionId');
  response.send(res, c$logout);
});

AuthController.post('/register', async (req, res, next) => {
  const c$register = await m$auth.register(req.body);
  response.send(res, c$register);
});

AuthController.get('/session', employeeCookie, async (req, res, next) => {
  const c$session = await m$auth.session(req.member);
  response.send(res, c$session);
});

export { AuthController };
