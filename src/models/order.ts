import dbclient from '../database/database';
import dotenv from 'dotenv';

dotenv.config();

export type Order = {
  id? : number; // autogenerated by postgres, defined as optional
  status: string;
  user_id: number;
};

export type OrderItem = {
  id? : number; // autogenerated by postgres, defined as optional
  quantity: number;
  order_id: number;
  item_id: number;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await dbclient.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release();
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

  /*async updateItem(quantity: number, orderId: string, itemId: string) {
    try {
      let conn = await dbclient.connect();
      console.log(`Product not present in order_items. Will insert new quantity ${quantity} for product id ${itemId} and order id ${orderId}.`);
      const sqlinsert = "INSERT INTO order_items (quantity, order_id, item_id) values ($1, $2, $3) RETURNING *";
      const result = await conn.query(sqlinsert, [quantity, orderId, itemId]);
      conn.release();
      return result;
    } catch (err) {
      throw new Error(`Could not insert new order item with quantity ${quantity}, order id ${orderId}, and item id ${itemId}: ${err}`);
    }
  }

  async insertItem(quantity: number, orderItemId: string) {
    try {
      let conn = await dbclient.connect();
      console.log(`Product already present in order_items with id ${orderItemId}. Will increase its quantity by ${quantity}.`);
      const sqlupdate = "UPDATE order_items SET quantity = quantity + $1 WHERE id = $2 RETURNING *";
      const result = await conn.query(sqlupdate, [quantity, orderItemId]);
      conn.release();
      return result;
    } catch (err) {
      throw new Error(`Could not update quantity ${quantity} for order item ${orderItemId}: ${err}`);
    }
  }

  async checkItemInOrder(orderId: string, itemId: string): Promise<OrderItem> {
    try {
      let conn = await dbclient.connect();
      console.log(`Checking if there is an existing record for order id ${orderId} and item id ${itemId} in order items.`);
      const sql = "SELECT id, quantity, order_id, item_id FROM order_items WHERE order_id = $1 and item_id = $2";
      const result = await conn.query(sql, [orderId, itemId]);
      conn.release();
      console.log(result.rows[0]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error during query execution: ${err}`);
    }
  }*/

  async addItem(quantity: number, orderId: string, itemId: string): Promise<Order> {
    try {
      //let sql = "SELECT status FROM orders WHERE id = $1";
      //let conn = await dbclient.connect();
      //let result = await conn.query(sql, [orderId]);
      //const status = result.rows[0]['status'];
      //console.log(`Retrieved status ${status} for order with id ${orderId}.`);
      //conn.release();

      //if (status != "active") {
      //  throw new Error(`Could not add product ${itemId} to order ${orderId} because order status is ${status}`);
      //}
      console.log("[order] - addItem");
      const conn = await dbclient.connect();
      let sqlupsert = "INSERT INTO order_items (quantity, order_id, item_id) values ($1, $2, $3)";
      sqlupsert = sqlupsert + " ON CONFLICT ON CONSTRAINT order_items_order_id_item_id_key do UPDATE SET quantity = $1 RETURNING *";
      const result = await conn.query(sqlupsert, [quantity, orderId, itemId]);
      const order = result.rows[0];
      console.log(order);
      conn.release();
      return order;

      /*try {
        const orderItemId = (await this.checkItemInOrder(orderId, itemId)).id;
        console.log(orderItemId);
        if(orderItemId != undefined) {   
          const result = await this.updateItem(quantity, orderId, itemId);
          const order = result.rows[0];
          conn.release();
          console.log("update");
          return order;
        } else {
          const result = await this.insertItem(quantity, ((orderItemId as unknown) as string));
          const order = result.rows[0];
          conn.release();
          console.log("insert");
          return order;
        }
      } catch (err) {
        throw new Error(`Error during query execution: ${err}`);
      }*/
    } catch (err) {
      throw new Error(`Could not add item ${itemId} to order ${orderId}: ${err}`);
    }
  }

  async submit(orderId: string): Promise<Order> {
    try {
      const sql = "UPDATE orders SET status = 'completed' WHERE id = $1 RETURNING *";
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
      
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get completed orders for user ${username}. Error: ${err}`);
    }
  }
}
