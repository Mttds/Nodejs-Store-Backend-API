import { Order, OrderStore } from '../../models/order';
import { User, UserStore } from '../../models/user';
import dbclient from '../../database/database';

const store = new OrderStore();
const storeUser = new UserStore();

describe("Order Model", () => {
  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("index method should return a list of records", async () => {
    const result = await store.index();
    expect(result).toEqual([]);
  });

  it("show method should return a single object after creating the order with create", async () => {
    let newOrderId = "0";
    let newUserId = "0";

    const mockUser = {
      username: "testorder",
      firstname: "testorder",
      lastname: "testorder",
      password: "testorder"
    }
    const newUser = await storeUser.create(mockUser);

    try {
      const sql = 'SELECT id FROM users WHERE username = $1';
      const conn = await dbclient.connect();
      const result = await conn.query(sql, [newUser.username]);
      newUserId = result.rows[0].id;
      conn.release();
    } catch (err) {
      throw new Error(`Could not find user ${newUser.username}. Error: ${err}`);
    }

    const mockOrder = {
      status: "active",
      user_id: ((newUserId as unknown) as number)
    }
    const newOrder = await store.create(mockOrder);

    try {
      const sql = 'SELECT id FROM orders WHERE 1=1';
      const conn = await dbclient.connect();
      const result = await conn.query(sql);
      newOrderId = result.rows[0].id;
      conn.release();
    } catch (err) {
      throw new Error(`Could not find order ${newOrderId}. Error: ${err}`);
    }

    const result = await store.show(newOrderId);
    expect(result).toEqual(jasmine.any(Object));
  });

  it("currentOrder method should return the current active order for the user testorder", async () => {
    const result = await store.currentOrder("testorder");
    expect(result).toEqual(jasmine.any(Object));
  });

  it("submit method should change the status to completed", async () => {
    let orderId = "0";
    let status = "";
    try {
      const sql = 'SELECT id FROM orders WHERE 1=1';
      const conn = await dbclient.connect();
      const result = await conn.query(sql);
      orderId = result.rows[0].id;
      conn.release();
    } catch (err) {
      throw new Error(`Could not find order ${orderId}. Error: ${err}`);
    }

    const _result = await store.submit(orderId);
    try {
      const sql = 'SELECT status FROM orders WHERE id = $1';
      const conn = await dbclient.connect();
      const result = await conn.query(sql, [orderId]);
      status = result.rows[0].status;
      conn.release();
    } catch (err) {
      throw new Error(`Could not find order ${orderId}. Error: ${err}`);
    }

    expect(status).toEqual("completed");
  });

  it("completedOrders method should return the current completed order for the user testorder after the submit", async () => {
    const result = await store.completedOrders("testorder");
    expect(result).toEqual(jasmine.any(Object));
  });

  it("delete method should delete the created order", async () => {
    let orderId = "0";
    try {
      const sql = 'SELECT id FROM orders WHERE 1=1';
      const conn = await dbclient.connect();
      const result = await conn.query(sql);
      orderId = result.rows[0].id;
      conn.release();
    } catch (err) {
      throw new Error(`Could not find order with id ${orderId}. Error: ${err}`);
    }
    let userid = "0";

    const result = await store.delete(orderId);
    try {
      const sql = 'SELECT id FROM users WHERE 1=1';
      const conn = await dbclient.connect();
      const result = await conn.query(sql);
      userid = result.rows[0].id;
      conn.release();
    } catch (err) {
      throw new Error(`Could not find user with id ${userid}. Error: ${err}`);
    }
    const _result = await storeUser.delete(userid);
    expect(result).toBeUndefined();
  });
})
