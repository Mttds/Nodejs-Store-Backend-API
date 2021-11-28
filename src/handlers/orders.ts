import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/order';
import url from 'url';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const store = new OrderStore();

const index = async (req: Request, res: Response) => {
  //console.log('[orders] - index');
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
  const orders = await store.index();
  res.json(orders);
}

const show = async (req: Request, res: Response) => {
  //console.log('[orders] - show');
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
  const order = await store.show(req.params.id);
  res.json(order);
}

const create = async (req: Request, res: Response) => {
  //console.log('[orders] - create');
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

  const order: Order = {
    status: req.body.status,
    user_id: req.body.user_id
  };

  try {
    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (err) {
    res.status(400);
    res.json((err as string) + order);
  }
}

const destroy = async (req: Request, res: Response) => {
  //console.log('[orders] - destroy');
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

const addItem = async (req: Request, res: Response) => {
  //console.log('[orders] - addItem');
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

  const orderId: string = req.params.id;
  const itemId: string = req.body.item_id;
  const quantity: number = req.body.quantity;

  try {
    const addedItem = await store.addItem(quantity, orderId, itemId);
    res.json(addedItem);
  } catch (err) {
    res.json(err)
    res.status(400);
  }
}

const submit = async (req: Request, res: Response) => {
  //console.log('[orders] - submit');
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

  const orderId: string = req.params.id;

  try {
    const submittedOrder = await store.submit(orderId);
    res.json(submittedOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
}

const currentOrder = async (req: Request, res: Response) => {
  //console.log('[orders] - currentOrder');
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

  const query = url.parse(req.url, true).query;
  const username: string = (query.username as string);
  if(username === "" || username == undefined) {
    res.status(204); // No orders found
  }

  try {
    const order = await store.currentOrder(username);
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
}

const completedOrders = async (req: Request, res: Response) => {
  //console.log('[orders] - completedOrders');
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

  const query = url.parse(req.url, true).query;
  const username: string = (query.username as string);
  if(username === "" || username == undefined) {
    res.status(204); // No orders found
  }

  try {
    const orders = await store.completedOrders(username);
    res.json(orders);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
}

const order_routes = (app: express.Application) => {
  app.get('/orders/current', currentOrder);
  app.get('/orders/completed', completedOrders);
  app.get('/orders', index);
  app.get('/orders/:id', show);
  app.post('/orders/:id/items', addItem);
  app.post('/orders/:id/submit', submit);
  app.post('/orders/:id', destroy);
  app.post('/orders', create);
}

export default order_routes;
