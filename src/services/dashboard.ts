import dbclient from '../database/database';

export class DashboardQueries {
  // Get all items that have been included in orders
  // The return type from this typescript method it's not a type we created in any the models. 
  // It is returning a hybrid of two models
  async productInOrders(): Promise<{name: string, quantity: number, order_id: string}[]> {
    try {
      const conn = await dbclient.connect();
      const sql = 'SELECT name, quantity, order_id FROM products a INNER JOIN order_items b ON a.id = b.id';
      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get items and orders: ${err}`);
    } 
  }
}
