const request = require('supertest');
const app = require('../app');

describe('Expense API', () => {
  let token;

  beforeAll(async () => {
    // Login and get token
    const loginRes = await request(app).post('/api/users/login').send({
      email: 'john@test.com',
      password: 'password123'
    });
    token = loginRes.body.token;
  });

  // Test for adding an expense with equal split
  it('should add an expense with equal split', async () => {
    const res = await request(app).post('/api/expenses').set('Authorization', `Bearer ${token}`).send({
      description: 'Lunch with friends',
      totalAmount: 3000,
      paidBy: '12345',  // replace with actual user ID
      splitType: 'equal',
      participants: [
        { userId: '12345' },
        { userId: '67890' },
        { userId: '54321' }
      ]
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('Expense added successfully');
  });

  // Test for adding an expense with exact split
  it('should add an expense with exact split', async () => {
    const res = await request(app).post('/api/expenses').set('Authorization', `Bearer ${token}`).send({
      description: 'Shopping',
      totalAmount: 2000,
      paidBy: '12345',  // replace with actual user ID
      splitType: 'exact',
      participants: [
        { userId: '12345', amount: 1000 },
        { userId: '67890', amount: 500 },
        { userId: '54321', amount: 500 }
      ]
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('Expense added successfully');
  });

  // Test for adding an expense with percentage split
  it('should add an expense with percentage split', async () => {
    const res = await request(app).post('/api/expenses').set('Authorization', `Bearer ${token}`).send({
      description: 'Party with friends',
      totalAmount: 5000,
      paidBy: '12345',  // replace with actual user ID
      splitType: 'percentage',
      participants: [
        { userId: '12345', percentage: 50 },
        { userId: '67890', percentage: 25 },
        { userId: '54321', percentage: 25 }
      ]
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('Expense added successfully');
  });

  // Test for adding an expense with invalid percentage split
  it('should return error for invalid percentage split', async () => {
    const res = await request(app).post('/api/expenses').set('Authorization', `Bearer ${token}`).send({
      description: 'Invalid Split Test',
      totalAmount: 4000,
      paidBy: '12345',  // replace with actual user ID
      splitType: 'percentage',
      participants: [
        { userId: '12345', percentage: 60 },
        { userId: '67890', percentage: 25 },
        { userId: '54321', percentage: 25 }
      ]
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Invalid percentage split');
  });

  // Test for retrieving overall expenses
  it('should retrieve all expenses', async () => {
    const res = await request(app).get('/api/expenses/overall').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test for downloading balance sheet
  it('should download balance sheet', async () => {
    const res = await request(app).get('/api/expenses/balance_sheet').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);  // Replace this with actual CSV handling logic if implemented
  });
});
