import express, { Request, Response } from 'express';
import { DashboardQueries } from '../services/dashboard';

const dashboard_routes = (app: express.Application) => {
  app.get('/dashboard/products-in-orders', productInOrders);
}

const dashboard = new DashboardQueries()

const productInOrders = async (_req: Request, res: Response) => {
  const items = await dashboard.productInOrders();
  res.json(items);
}

export default dashboard_routes;
