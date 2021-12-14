import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/products';
import jwt from 'jsonwebtoken';
import url from 'url';
import dotenv from 'dotenv';

dotenv.config();
const store = new ProductStore();
const index = async (req: Request, res: Response) => {
  const query = url.parse(req.url, true).query;
  const category: string = (query.category as string);
  let products = undefined;
  if(category === "" || category == undefined) {
    products = await store.index();
  } else {
    products = await store.indexByCategory(category);
  }
  res.json(products);
}

const show = async (req: Request, res: Response) => {
  const product = await store.show(req.params.id);
  res.json(product);
}

const create = async (req: Request, res: Response) => {
  const product: Product = {
    name: req.body.name,
    type: req.body.type,
    category: req.body.category,
    weight: req.body.weight,
    price: req.body.price,
    description: req.body.description,
    url: req.body.url
  };

  try {
    // The token is retrieved from the authorizazion header after the Bearer string
    // See https://learning.postman.com/docs/sending-requests/authorization/#bearer-token
    // for an example request using Postman.
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
    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
}

const destroy = async (req: Request, res: Response) => {
  try {
    const authorizationHeader: string = (req.headers.authorization as string);
    let token = "";
    if(authorizationHeader != undefined) {
      token = authorizationHeader.split(' ')[1];
    }
    jwt.verify(token, (process.env.TOKEN_SECRET as string));
  } catch (err) {
    res.status(401);
    res.json('Access denied. Invalid token.');
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

const product_routes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', create);
  app.post('/products/:id', destroy);
}

export default product_routes;
