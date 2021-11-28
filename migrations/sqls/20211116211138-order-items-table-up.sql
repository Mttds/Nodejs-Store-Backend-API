/* Replace with your SQL commands */
CREATE TABLE order_items(
    id SERIAL PRIMARY KEY,
    quantity integer,
    order_id bigint REFERENCES orders(id),
    item_id bigint REFERENCES products(id),
    UNIQUE (order_id, item_id)
);