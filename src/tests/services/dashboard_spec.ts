import { DashboardQueries } from '../../services/dashboard';

const store = new DashboardQueries();

describe("Dashboard Service", () => {
  it("productInOrders method should return a list of records", async () => {
    const result = await store.productInOrders();
    expect(result).toEqual([]);
  });
});
