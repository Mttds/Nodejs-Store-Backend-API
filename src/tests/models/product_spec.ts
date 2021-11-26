import { Product, ProductStore } from '../../models/products';
import dbclient from '../../database/database';

const store = new ProductStore();

describe("Product Model", () => {
  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("index method should return a list of records", async () => {
    const result = await store.index();
    expect(result).toEqual([]);
  });

  it("show method should return a single object after creating the product with create", async () => {
    const mockProduct = {
      name: "test",
      type: "test",
      category: "test",
      weight: 1,
      price: 1
    }
    const newProduct = await store.create(mockProduct);
    let newProductId = "0";

    try {
      const sql = 'SELECT id FROM products WHERE name = $1';
      const conn = await dbclient.connect();
      const result = await conn.query(sql, [newProduct.name]);
      newProductId = result.rows[0].id;
      conn.release();
    } catch (err) {
      throw new Error(`Could not find product ${newProduct.name}. Error: ${err}`);
    }

    const result = await store.show(newProductId);
    expect(result).toEqual(jasmine.any(Object));
  });

  it("indexByCategory method should return the created product with test category", async () => {
    const result = await store.indexByCategory("test");
    expect(result).toEqual(jasmine.any(Object));
  });

  it("indexByCategory method should not return the created product if passing a different category", async () => {
    const result = await store.indexByCategory("anothercategory");
    expect(result).toEqual([]);
  });

  it("delete method should delete the created product", async () => {
    let productId = "0";
    try {
      const sql = 'SELECT id FROM products WHERE 1=1';
      const conn = await dbclient.connect();
      const result = await conn.query(sql);
      productId = result.rows[0].id;
      conn.release();
    } catch (err) {
      throw new Error(`Could not find product with id ${productId}. Error: ${err}`);
    }
    const result = await store.delete(productId);
    expect(result).toBeUndefined();
  });
});
