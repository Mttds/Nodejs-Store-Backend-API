# Storefront Backend Project

## NPM scripts

To setup all the required packages run: `npm install` in the project root folder. It will install the packages listed in package.json.

Test suite: `npm run test`

Start the server with the src directory (dev): `npm run dev`

Compile the Typescript src into Javascript in the build directory: `npm run build`

Start the server with the compiled build directory: `npm run start`

## Required Technologies

The application uses the following libraries:
- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Environment variables

The .env file in the application root folder contains the following variables:
- DATABASE_HOST: database server;
- DATABASE_NAME: dev database name;
- DATABASE_USER: database user;
- DATABASE_PASSWD: database password;
- DATABASE_TEST_NAME: test database name;
- ENV: environment type  (dev, test, ...);
- BCRYPT_PASSWORD: bcrypt password;
- SALT_ROUND: number of salt rounds applied by bcrypt;
- PEPPER: pepper to be added to the password hashing;
- TOKEN_SECRET: token for the jwt authentication;

## API Endpoints

| Type                                | URI                                  | Method   | Authentication/Authorization
| ----------------------------------- | ------------------------------------ | -------- | ------------
| Products INDEX route                | /products/                           | [GET]    | None
| Products INDEX by category          | /products?category=:category         | [GET]    | None
| Products SHOW route                 | /products/:id                        | [GET]    | None
| Products CREATE route               | /products/                           | [POST]   | JWT Token
| Products DELETE route               | /products/:id                        | [POST]   | JWT Token
| Users INDEX route                   | /users/                              | [GET]    | JWT Token
| Users SHOW route                    | /users/:id                           | [GET]    | JWT Token
| Users CREATE route                  | /users/                              | [POST]   | Signed JWT Token Returned
| Users DESTROY route                 | /users/:id                           | [POST]   | JWT Token
| Users AUTH route                    | /users/authenticate                  | [POST]   | Password, Signed JWT Token Returned
| Orders INDEX route                  | /orders/                             | [GET]    | JWT Token
| Orders SHOW route                   | /orders/:id                          | [GET]    | JWT Token
| Orders CREATE route                 | /orders/                             | [POST]   | JWT Token
| Orders DELETE route                 | /orders/:id                          | [POST]   | JWT Token
| Orders ADDITEM route                | /orders/:id/items                    | [POST]   | JWT Token
| Orders SUBMIT route                 | /orders/:id/submit                   | [POST]   | JWT Token
| Current Order by user               | /orders/current?username=:username   | [GET]    | JWT Token
| Completed Orders by user            | /orders/completed?username=:username | [GET]    | JWT Token
| Dashboard products in orders (cart) | /dashboard/products-in-orders        | [GET]    | JWT Token

The Orders SUBMIT route will change the status of the order id in the URI HTTP request from active to completed.

The Dashboard products in orders (cart) route will return a view with each item associated to its quantity, username and order id.

## Getting a JWT Token

In order to be able to test most of the endpoints we need to provide a valid JWT Token for Authorization otherwise a 401 HTTP status will be returned (Unauthorized).

There are two ways to do so:
1) Creating a user using the POST request at the /users endpoint providing firstname, lastname, username, and password. A signed token will be returned in the request body;
2) If we already have a valid username/password we can POST a request to /users/authenticate and a valid token will be returned in the request body if the tuple is correct (i.e username is in the database and the provided password is validated against the hashed password saved for that user);

The token can then be used by providing it in the Bearer Token field of the Authorization section (for example using Postman to make requests).

## Database

The postgresql database runs on the default port 5432. To connect to the database the .env file in the project root folder should have the following variables:

- DATABASE_HOST: database server;
- DATABASE_NAME: dev database name;
- DATABASE_USER: database user;
- DATABASE_PASSWD: database password;

, Or DATABASE_TEST_NAME (test database name) instead of DATABASE_NAME if run with ENV=test. The JavaScript driver to connect to the DB is pg and should be an available package for the project.

The file database.json in the root folder should be created with the following structure:

{
    "dev": {
        "driver": "pg",
        "host": "127.0.0.1",
        "database": "<dbname>",
        "user": "<dbuser>",
        "password": "<dbpwd>"
    },
    "test": {
        "driver": "pg",
        "host": "127.0.0.1",
        "database": "<dbname>",
        "user": "<dbuser>",
        "password": "<dbpwd>"
    }
}

- products

| Field            | Data Type          | Join
| ---------------- | ----------------   | ---------------------- 
| id               | SERIAL PRIMARY KEY | order_items.item_id
| name             | VARCHAR(100)       |
| type             | VARCHAR(50)        |
| category         | VARCHAR(50)        |
| weight           | INTEGER            |
| price            | NUMERIC(10, 2)     |

- users

| Field            | Data Type          | Join
| ---------------- | ----------------   | ---------------------- 
| id               | SERIAL PRIMARY KEY | orders.user_id
| firstname        | VARCHAR(50)        |
| lastname         | VARCHAR(50)        |
| password_digest  | VARCHAR            |


- orders

| Field            | Data Type          | Join
| ---------------- | ----------------   | ---------------------- 
| id               | SERIAL PRIMARY KEY |
| status           | VARCHAR(64)        |
| user_id          | BIGINT             | Foreign Key to users.id

- order_items

| Field            | Data Type          | Join
| ---------------- | ----------------   | ---------------------- 
| id               | SERIAL PRIMARY KEY |
| quantity         | INTEGER            |
| order_id         | BIGINT             | Foreign Key to orders.id
| item_id          | BIGINT             | Foreign Key to products.id

Additional constraints: UNIQUE (order_id, item_id)

# Class Models

| Class            | Object               
| ---------------- | ------------------------------------------------------------------------------------------------
| ProductStore     | Product = {name: string; type: string; category: string; weight: number; price: number;}
| UserStore        | User = {firstname: string; lastname: string, password: string;}
| OrderStore       | Order = {status: string, user_id: number;}

# Routes Handlers

| File                  | Object               
| --------------------- | -----------------
| handlers/products.ts  | product_routes
| handlers/users.ts     | users_routes
| handlers/orders.ts    | order_routes

# Authorization

JWT is used for enpoint authorization except for the Products GET endpoints which do not require a token.

# DB Creation & Migration

- Run the create table scripts: `node node_modules/db-migrate up`

- Run the drop table scripts: `node node_modules/db-migrate down`
