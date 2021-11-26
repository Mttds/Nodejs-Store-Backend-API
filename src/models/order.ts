import dbclient from '../database/database';
import dotenv from 'dotenv';

dotenv.config();

export type Order = {
  //id: Number; // autogenerated by postgres
  status: string;
  user_id: number;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await dbclient.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release;
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get orders ${err}`);
    }
  }

  async show(id: string): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await dbclient.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }

  async create(b: Order): Promise<Order> {
    try {
      if (b.status !== "active" && b.status !== "completed") {
        throw new Error(`An order status must be either active or completed`);
      }
      const sql = 'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
      const sql2 = "SELECT id FROM orders WHERE user_id = $1 and status = 'active'";
      const conn = await dbclient.connect();
      let result = await conn.query(sql2, [b.user_id]);
      if(result.rows[0] != undefined) {
        throw new Error(`User ${b.user_id} has already an active order in the Database.`);
      }

      result = await conn.query(sql, [b.status, b.user_id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not create order ${b}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Order> {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1)';
      const conn = await dbclient.connect();
      const result = await conn.query(sql, [id])
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
    }
  }

  async addItem(quantity: number, orderId: string, itemId: string): Promise<Order> {
    try {
      let sql = "SELECT status FROM orders WHERE id = $1";
      let conn = await dbclient.connect();
      let result = await conn.query(sql, [orderId]);
      const status = result.rows[0]['status'];
      conn.release();

      if (status !== "active") {
        throw new Error(`Could not add product ${itemId} to order ${orderId} because order status is ${status}`);
      }

      sql = "SELECT id FROM order_items WHERE order_id = $1 and item_id = $2";
      conn = await dbclient.connect();
      result = await conn.query(sql, [orderId, itemId]);
      let productAlreadyInCart = "";
      if (result.rows[0] != undefined && 'id' in result.rows[0]) {
        productAlreadyInCart = result.rows[0]['id'];
      }
      conn.release();

      if (productAlreadyInCart !== "") {
        sql = "UPDATE order_items SET quantity = quantity + $1 WHERE id = $2";
      } else {
        sql = "INSERT INTO order_items (quantity, order_id, item_id) values ($1, $2, $3)";
      }
      
      conn = await dbclient.connect();
      if (productAlreadyInCart !== "") {
        result = await conn.query(sql, [quantity, productAlreadyInCart]);
      } else {
        result = await conn.query(sql, [quantity, orderId, itemId]);
      }
      const order = result.rows[0];
      
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not add item ${itemId} to order ${orderId}: ${err}`);
    }
  }

  async submit(orderId: string): Promise<Order> {
    try {
      const sql = "UPDATE orders SET status = 'completed' WHERE id = $1";
      const conn = await dbclient.connect();
      const result = await conn.query(sql, [orderId]);
      const submittedOrder = result.rows[0];
      conn.release();
      return submittedOrder;
    } catch (err) {
      throw new Error(`Could not submit order ${orderId}: ${err}`);
    }
  }

  async currentOrder(username: string): Promise<Order> {
    try {
      const sql = "SELECT o.* FROM orders o JOIN users u ON o.user_id = u.id WHERE u.username = ($1) and o.status = 'active'";
      const conn = await dbclient.connect();
      const result = await conn.query(sql, [username]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot get active order for user ${username}. Error: ${err}`);
    }
  }

  async completedOrders(username: string): Promise<Order[]> {
    try {
      const conn = await dbclient.connect();
      const sql = "SELECT o.* FROM orders o JOIN users u ON o.user_id = u.id WHERE u.username = ($1) and o.status = 'completed'";
      const result = await conn.query(sql, [username]);
      
      conn.release;
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get completed orders for user ${username}. Error: ${err}`);
    }
  }
}
