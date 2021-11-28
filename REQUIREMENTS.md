# API Requirements
Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page.

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

## Data Shapes
#### products

| Field            | Data Type          | Join
| ---------------- | ----------------   | ---------------------- 
| id               | SERIAL PRIMARY KEY | order_items.item_id
| name             | VARCHAR(100)       |
| type             | VARCHAR(50)        |
| category         | VARCHAR(50)        |
| weight           | INTEGER            |
| price            | NUMERIC(10, 2)     |

#### users

| Field            | Data Type          | Join
| ---------------- | ----------------   | ---------------------- 
| id               | SERIAL PRIMARY KEY | orders.user_id
| firstname        | VARCHAR(50)        |
| lastname         | VARCHAR(50)        |
| password_digest  | VARCHAR            |


#### orders

| Field            | Data Type          | Join
| ---------------- | ----------------   | ---------------------- 
| id               | SERIAL PRIMARY KEY |
| status           | VARCHAR(64)        |
| user_id          | BIGINT             | Foreign Key to users.id

#### order_items

| Field            | Data Type          | Join
| ---------------- | ----------------   | ---------------------- 
| id               | SERIAL PRIMARY KEY |
| quantity         | INTEGER            |
| order_id         | BIGINT             | Foreign Key to orders.id
| item_id          | BIGINT             | Foreign Key to products.id

Additional constraints: UNIQUE (order_id, item_id)
