import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/order';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const store = new OrderStore();

const index = async (_req: Request, res: Response) => {
  const orders = await store.index();
  res.json(orders);
}

const show = async (req: Request, res: Response) => {
  const order = await store.show(req.params.id);
  res.json(order);
}

const create = async (req: Request, res: Response) => {
  const order: Order = {
    status: req.body.status,
    user_id: req.body.user_id
  };

  try {        
    const newOrder = await store.create(order);
    let token = jwt.sign({user: newOrder}, (process.env.TOKEN_SECRET as string));
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json((err as string) + order);
  }
}

const addItem = async (req: Request, res: Response) => {
  const orderId: string = req.params.id;
  const itemId: string = req.body.itemId;
  const quantity: number = req.body.quantity;

  try {
    const addedItem = await store.addItem(quantity, orderId, itemId);
    res.json(addedItem);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
}

const order_routes = (app: express.Application) => {
  app.get('/orders', index);
  app.get('/orders/:id', show);
  app.post('/orders', create);
  app.post('/orders/:id/items', addItem);
}

export default order_routes;
