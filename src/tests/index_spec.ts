import supertest from 'supertest';
import app from '../index';
import dbclient from '../database/database';

const request = supertest(app);
let user = {firstname: 'testendpoint', lastname: 'testendpoint', username: 'testendpoint', password: 'testendpoint'};
var token = "";
describe('Endpoint tests', () => {
  //==================================================================
  // Products
  //==================================================================
  it('gets the products endpoint', async () => {
    const response = await request.get('/products');
    expect(response.status).toBe(200);
  });

  it('gets the products endpoint with id 1', async () => {
    const response = await request.get('/products/1');
    expect(response.status).toBe(200);
  });

  it('gets the products endpoint with category test', async () => {
    const response = await request.get('/products?category=test');
    expect(response.status).toBe(200);
  });

  //==================================================================
  // Users
  //==================================================================
  // create
  it('posts to the users endpoint to create a user', async () => {
    const response = await request.post('/users').send(user);
    token = response.body;
    expect(response.status).toBe(200);
  });

  // index without authorization
  it('gets the users endpoint with no request body to get an unathorized (no token provided)', async () => {
    const response = await request.get('/users');
    expect(response.status).toBe(401);
  });

  // index with authorization
  it('gets the users endpoint providing a token', async () => {
    const body = {'token': token};
    const response = await request.get('/users').send(body);
    expect(response.status).toBe(200);
  });

  // authentication with password
  it('posts to the users/authenticate endpoint providing the correct password', async () => {
    const body = {'username': user.username, 'password': user.password};
    console.log(body);
    const response = await request.post('/users/authenticate').send(body);
    expect(response.status).toBe(200);
  });

  // delete with authorization
  it('posts to the users/:id endpoint to delete the created user', async () => {
    let userId = "0";
    try {
      const sql = 'SELECT id FROM users WHERE 1=1';
      const conn = await dbclient.connect();
      const result = await conn.query(sql);
      userId = result.rows[0].id;
      conn.release();
    } catch (err) {
      throw new Error(`Could not find user with id ${userId}. Error: ${err}`);
    }
    const body = {'token': token};
    const response = await request.post(`/users/${userId}`).send(body);
    expect(response.status).toBe(200);
  });

  //==================================================================
  // Orders
  //==================================================================
  it('gets the orders endpoint', async () => {
    const body = {'token': token};
    const response = await request.get('/orders').send(body);
    expect(response.status).toBe(200);
  });
});
