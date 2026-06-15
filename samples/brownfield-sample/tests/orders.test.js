const request = require('supertest');
const app = require('../src/index');

// Mock mongoose to avoid needing a real DB connection in unit tests
jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');
  return {
    ...actual,
    connect: jest.fn().mockResolvedValue({}),
    model: jest.fn(),
    Schema: actual.Schema,
  };
});

jest.mock('../src/models/order');
jest.mock('../src/middleware/auth', () => (req, res, next) => {
  req.user = { sub: 'test-user-123', role: 'admin' };
  next();
});

const Order = require('../src/models/order');

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /orders', () => {
  it('returns a list of orders', async () => {
    const mockOrders = [
      { _id: 'order-1', customerId: 'cust-abc', status: 'pending', items: [] },
      { _id: 'order-2', customerId: 'cust-xyz', status: 'shipped', items: [] },
    ];
    Order.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockOrders),
    });

    const res = await request(app).get('/orders');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('filters by status when query param provided', async () => {
    Order.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue([]),
    });

    await request(app).get('/orders?status=pending');
    expect(Order.find).toHaveBeenCalledWith({ status: 'pending' });
  });
});

describe('POST /orders', () => {
  it('creates an order with valid payload', async () => {
    const mockOrder = {
      _id: 'order-new',
      customerId: 'cust-123',
      items: [{ productId: 'p1', sku: 'SKU-001', name: 'Widget', quantity: 2, unitPrice: 9.99 }],
      status: 'pending',
      save: jest.fn().mockResolvedValue(true),
    };
    Order.mockImplementation(() => mockOrder);

    const res = await request(app)
      .post('/orders')
      .send({
        customerId: 'cust-123',
        items: [{ productId: 'p1', sku: 'SKU-001', name: 'Widget', quantity: 2, unitPrice: 9.99 }],
      });

    expect(res.statusCode).toBe(201);
  });

  it('returns 400 when customerId is missing', async () => {
    const res = await request(app)
      .post('/orders')
      .send({ items: [{ productId: 'p1', sku: 'SKU-001', name: 'Widget', quantity: 1, unitPrice: 5.00 }] });

    expect(res.statusCode).toBe(400);
  });

  it('returns 400 when items array is empty', async () => {
    const res = await request(app)
      .post('/orders')
      .send({ customerId: 'cust-123', items: [] });

    expect(res.statusCode).toBe(400);
  });
});
