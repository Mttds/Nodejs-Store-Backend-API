# Storefront Backend Project

## NPM scripts

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

| Type                              | URI                          | Method   | Auth
| --------------------------------- | ---------------------------- | -------- | ------------
| Products INDEX route              | /products/                   | [GET]    | None
| Products INDEX by category        | /products?category=:category | [GET]    | None
| Products SHOW route               | /products/:id                | [GET]    | None
| Products CREATE route             | /products/                   | [POST]   | JWT Token
| Products DELETE route             | /products/:id                | [POST]   | JWT Token
| Users INDEX route                 | /users/                      | [GET]    | JWT Token
| Users SHOW route                  | /users/:id                   | [GET]    | JWT Token
| Users CREATE route                | /users/                      | [POST]   | JWT Token
| Orders INDEX route                | /orders/                     | [GET]    | JWT Token
| Orders SHOW route                 | /orders/:id                  | [GET]    | JWT Token
| Orders CREATE route               | /orders/                     | [POST]   | JWT Token
| Orders DELETE route               | /orders/:id                  | [POST]   | JWT Token
| Current Order by user             | /users/:id/current-order     | [GET]    | JWT Token
| Completed Orders by user          | /users/:id/completed-orders  | [GET]    | JWT Token

# Database Models

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

- Run the create table scripts
node node_modules/db-migrate up

- Run the drop table scripts
node node_modules/db-migrate down
