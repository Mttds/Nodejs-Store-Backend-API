import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Product, ProductStore } from './models/products';
import product_routes from './handlers/products';
import users_routes from './handlers/users';
import order_routes from './handlers/orders';
import dashboard_routes from './handlers/dashboard';

const app: express.Application = express();
const address: string = "127.0.0.1:3000";

app.use(bodyParser.json());

app.get('/', async (req: Request, res: Response) => {
  const store = new ProductStore();
  const products: Product[] = await store.index();
  res.send(`Our Products: ${products}`);
})

// pass the instance of the express app created in this index.ts and which starts up the server
// this includes inside this file the routes defined in the handlers.
product_routes(app); // /products routes
users_routes(app); // /users route
order_routes(app); // /orders routes
dashboard_routes(app); // /dashboard routes

app.listen(3000, (): void => {
  console.log(`starting app on: ${address}`);
})

export default app;
