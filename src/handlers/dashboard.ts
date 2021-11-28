import express, { Request, Response } from 'express';
import { DashboardQueries } from '../services/dashboard';
import jwt from 'jsonwebtoken';

const dashboard_routes = (app: express.Application) => {
  app.get('/dashboard/products-in-orders', productInOrders);
}

const dashboard = new DashboardQueries()

const productInOrders = async (req: Request, res: Response) => {
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
  const items = await dashboard.productInOrders();
  res.json(items);
}

export default dashboard_routes;
