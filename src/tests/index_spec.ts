import supertest from 'supertest';
import app from '../index';

const request = supertest(app);
const user = {firstname: 'testendpoint', lastname: 'testendpoint', username: 'testendpoint', password: 'testendpoint'};
const product = {name: 'testproduct', type: 'test', category: 'testcategory', weight: 1, price: 1};
let userId = "0";
let productId = "0";
let orderId = "0";
let token = "";
describe('Endpoint tests', () => {
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
  it('gets the users endpoint with no request body to get an unauthorized (no token provided)', async () => {
    const response = await request.get('/users');
    expect(response.status).toBe(401);
  });

  // index with authorization
  it('gets the users endpoint providing a token', async () => {
    //const body = {'token': token};
    const headers = {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'};
    const response = await request.get('/users').set(headers);
    userId = response.body[0].id;
    expect(response.status).toBe(200);
  });

  // authentication with password
  it('posts to the users/authenticate endpoint providing the correct password', async () => {
    const body = {'username': user.username, 'password': user.password};
    const response = await request.post('/users/authenticate').send(body);
    expect(response.status).toBe(200);
  });

  //==================================================================
  // Products
  //==================================================================
  // index
  it('gets the products endpoint', async () => {
    const response = await request.get('/products');
    expect(response.status).toBe(200);
  });

  // show
  it('gets the products endpoint with id 1', async () => {
    const response = await request.get('/products/1');
    expect(response.status).toBe(200);
  });

  // index by category
  it('gets the products endpoint with category testcategory', async () => {
    const response = await request.get('/products?category=testcategory');
    expect(response.status).toBe(200);
  });

  // create
  it('posts to the products endpoint to create a product', async () => {
    const headers = {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'};
    const response = await request.post('/products').set(headers).send(product);
    expect(response.status).toBe(200);
  });

  // index by category after product creation
  it('gets the products endpoint with category testcategory after creating a product for the category', async () => {
    const response = await request.get('/products?category=testcategory');
    productId = response.body[0].id;
    expect(response.status).toBe(200);
    expect(response.body[0].name).toEqual("testproduct");
  });

  //==================================================================
  // Orders
  //==================================================================
  // create
  it('posts to the orders endpoint to create an order with the previously created user', async () => {
    const headers = {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'};
    const order = {'user_id': userId, 'status': 'active'};
    const response = await request.post('/orders').set(headers).send(order);
    expect(response.status).toBe(200);
  });

  // index
  it('gets the orders endpoint', async () => {
    //const body = {'token': token};
    const headers = {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'};
    const response = await request.get('/orders').set(headers);
    orderId = response.body[0].id;
    expect(response.body[0].status).toBe("active");
    expect(response.status).toBe(200);
  });

  // orders/current
  it('gets the orders/current?username=:username endpoint', async () => {
    //const body = {'token': token};
    const headers = {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'};
    const response = await request.get('/orders/current').query({'username': 'testendpoint'}).set(headers);
    expect(response.status).toBe(200);
  });

  it('gets the orders/completed?username=:username endpoint', async () => {
    //const body = {'token': token};
    const headers = {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'};
    const response = await request.get('/orders/completed').query({'username': 'testendpoint'}).set(headers);
    expect(response.status).toBe(200);
  });

  //==================================================================
  // Cleanup using delete endpoints for users, products, and orders
  // Must be done in the correct order due to database foreign keys
  //==================================================================
  // delete the created order with authorization
  it('posts to the orders/:id endpoint to delete the created order', async () => {
    //const body = {'token': token};
    const headers = {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'};
    const response = await request.post(`/orders/${orderId}`).set(headers);
    expect(response.status).toBe(200);
  });

  // delete the created product with authorization
  it('posts to the products/:id endpoint to delete the created product', async () => {
    //const body = {'token': token};
    const headers = {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'};
    const response = await request.post(`/products/${productId}`).set(headers);
    expect(response.status).toBe(200);
  });

  // delete the created user with authorization
  it('posts to the users/:id endpoint to delete the created user', async () => {
    //const body = {'token': token};
    const headers = {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'};
    const response = await request.post(`/users/${userId}`).set(headers);
    expect(response.status).toBe(200);
  });
});
