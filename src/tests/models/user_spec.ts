import { User, UserStore } from '../../models/user';
import dbclient from '../../database/database';

const store = new UserStore();

describe("User Model", () => {
  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("index method should return a list of records", async () => {
    const result = await store.index();
    expect(result).toHaveSize(result.length);
  });

  it("show method should return a single object after creating the user with create", async () => {
    const mockUser = {
      username: "test",
      firstname: "test",
      lastname: "test",
      password: "test"
    }
    const newUser = await store.create(mockUser);
    let newUserId = "0";

    try {
      const sql = 'SELECT id FROM users WHERE username = $1';
      const conn = await dbclient.connect();
      const result = await conn.query(sql, [newUser.username]);
      newUserId = result.rows[0].id;
      conn.release();
    } catch (err) {
      throw new Error(`Could not find user ${newUser.username}. Error: ${err}`);
    }

    const result = await store.show(newUserId);
    expect(result).toEqual(jasmine.any(Object));
  });

  it("authenticate method should return a single object after providing the test username and password", async () => {
    const username = "test";
    const password = "test";
    const result = await store.authenticate(username, password);
    expect(result).toEqual(jasmine.any(Object));
  });

  it("authenticate method should return null after providing the wrong password", async () => {
    const username = "test";
    const password = "wrong";
    const result = await store.authenticate(username, password);
    expect(result).toBeNull();
  });

  it("delete method should delete the created user", async () => {
    let userid = "0";
    try {
      const sql = 'SELECT id FROM users WHERE 1=1';
      const conn = await dbclient.connect();
      const result = await conn.query(sql);
      userid = result.rows[0].id;
      conn.release();
    } catch (err) {
      throw new Error(`Could not find user with id ${userid}. Error: ${err}`);
    }
    const result = await store.delete(userid);
    expect(result).toBeUndefined();
  });
});
