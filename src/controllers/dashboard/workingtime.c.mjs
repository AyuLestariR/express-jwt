import { Router } from 'express';
import m$todo from '#module/dashboard/workingtime.m.mjs';
import response from '#helper/response.mjs';
import employeeCookie from '#helper/middleware.mjs';

const WorkingTimeController = Router();

WorkingTimeController.get('/', employeeCookie, async (req, res, next) => {
  const c$list = await m$todo.list({ ...req.query });
  response.send(res, c$list);
});

WorkingTimeController.get('/:id', employeeCookie, async (req, res, next) => {
  const c$detail = await m$todo.detail(req.params);
  response.send(res, c$detail);
});

WorkingTimeController.post('/', employeeCookie, async (req, res, next) => {
  const c$add = await m$todo.add({ ...req.body });
  response.send(res, c$add);
});

WorkingTimeController.put('/:id', employeeCookie, async (req, res, next) => {
  const c$update = await m$todo.update({ ...req.params, ...req.body });
  response.send(res, c$update);
});

WorkingTimeController.delete('/:id', employeeCookie, async (req, res, next) => {
  const c$del = await m$todo.delete({ ...req.params});
  response.send(res, c$del);
});

export { WorkingTimeController };
