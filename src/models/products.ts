import dbclient from '../database/database';

export type Product = {
  //id: Number; // autogenerated by postgres
  name: string;
  type: string;
  category: string;
  weight: number;
  price: number;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await dbclient.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      conn.release;
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get products ${err}`);
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const conn = await dbclient.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`);
    }
  }

  async create(b: Product): Promise<Product> {
    try {
      const sql = 'INSERT INTO products (name, type, category, weight, price) VALUES($1, $2, $3, $4, $5) RETURNING *';
      const conn = await dbclient.connect();
      const result = await conn.query(sql, [b.name, b.type, b.category, b.weight, b.price]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Could not add new product ${b.name}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1)';
      const conn = await dbclient.connect();
      const result = await conn.query(sql, [id])
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Could not delete product ${id}. Error: ${err}`);
    }
  }
}
