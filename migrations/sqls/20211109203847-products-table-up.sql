/* Replace with your SQL commands */
CREATE TABLE products (
    name VARCHAR(100),
    type VARCHAR(50),
    category VARCHAR(50),
    weight INTEGER,
    price NUMERIC(10, 2),
    description VARCHAR(255),
    url VARCHAR(255),
    id SERIAL PRIMARY KEY
);