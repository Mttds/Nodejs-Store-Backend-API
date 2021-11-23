import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
}

const show = async (req: Request, res: Response) => {
  const user = await store.show(req.body.id);
  res.json(user);
}

const create = async (req: Request, res: Response) => {
  const user: User = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password
  };

  try {        
    const newUser = await store.create(user);
    let token = jwt.sign({user: newUser}, (process.env.TOKEN_SECRET as string));
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json((err as string) + user);
  }
}

const users_routes = (app: express.Application) => {
  app.get('/users', index)
  app.get('/users/:id', show)
  app.post('/users', create);
}

export default users_routes;
