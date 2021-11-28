import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const store = new UserStore();

const index = async (req: Request, res: Response) => {
  //console.log("[users] - index called");
  try {
    const authorizationHeader: string = (req.headers.authorization as string);
    let token = "";
    if(authorizationHeader != undefined) {
      token = authorizationHeader.split(' ')[1];
    }
    jwt.verify(token, (process.env.TOKEN_SECRET as string));
  } catch (err) {
    res.status(401); // unauthorized
    res.json(`Invalid token ${err}`);
    return;
  }
  const users = await store.index();
  res.json(users);
}

const show = async (req: Request, res: Response) => {
  //console.log("[users] - show called");
  try {
    const authorizationHeader: string = (req.headers.authorization as string);
    let token = "";
    if(authorizationHeader != undefined) {
      token = authorizationHeader.split(' ')[1];
    }
    jwt.verify(token, (process.env.TOKEN_SECRET as string));
  } catch (err) {
    res.status(401); // unauthorized
    res.json(`Invalid token ${err}`);
    return;
  }
  const user = await store.show(req.params.id);
  res.json(user);
}

const create = async (req: Request, res: Response) => {
  //console.log("[users] - create called");
  const user: User = {
    username: req.body.username,
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

const destroy = async (req: Request, res: Response) => {
  //console.log("[users] - destroy called");
  try {
    const authorizationHeader: string = (req.headers.authorization as string);
    let token = "";
    if(authorizationHeader != undefined) {
      token = authorizationHeader.split(' ')[1];
    }
    jwt.verify(token, (process.env.TOKEN_SECRET as string));
  } catch (err) {
    res.status(401); // unauthorized
    res.json(`Invalid token ${err}`);
    return;
  }

  try {
    const deleted = await store.delete(req.params.id);
    res.json(deleted);
  } catch (err) {
    res.status(400);
    res.json({err});
  }
}

const authenticate = async (req: Request, res: Response) => {
  //console.log("[users] - authenticate called");
  const user: User = {
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password
  };

  try {        
    const authenticatedUser = await store.authenticate(user.username, user.password);
    if(authenticatedUser === null) {
      res.status(401);
      res.json(`Username not found or wrong password for ${user.username}`);
      return;
    }
    let token = jwt.sign({user: authenticatedUser}, (process.env.TOKEN_SECRET as string));
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json((err as string) + user);
  }
}

const users_routes = (app: express.Application) => {
  app.get('/users', index);
  app.get('/users/:id', show);
  app.post('/users', create);
  app.post('/users/authenticate', authenticate);
  app.post('/users/:id', destroy);
}

export default users_routes;
