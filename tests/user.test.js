const request = require('supertest');
const app = require('../app');

describe('User API', () => {
  // Test for registering a user
  it('should register a user', async () => {
    const res = await request(app).post('/api/users/register').send({
      name: 'John Doe',
      email: 'john@test.com',
      password: 'password123',
      mobile: '1234567890'
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('User created successfully');
  });

  // Test for invalid user registration (missing fields)
  it('should return error when missing required fields', async () => {
    const res = await request(app).post('/api/users/register').send({
      email: 'john@test.com',
      password: 'password123'
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBeDefined();
  });

  // Test for login with valid credentials
  it('should login a user with correct credentials', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: 'john@test.com',
      password: 'password123'
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();  // Check if token is returned
  });

  // Test for login with incorrect credentials
  it('should return error for incorrect login credentials', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: 'john@test.com',
      password: 'wrongpassword'
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  // Test for retrieving user details
  it('should retrieve user details with valid token', async () => {
    const loginRes = await request(app).post('/api/users/login').send({
      email: 'john@test.com',
      password: 'password123'
    });
    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/users/12345')  // replace with actual user ID
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toBe('john@test.com');
  });

  // Test for retrieving user details with invalid token
  it('should return error for invalid token', async () => {
    const res = await request(app)
      .get('/api/users/12345')
      .set('Authorization', 'Bearer invalidtoken');
    
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toBe('Invalid token');
  });
});
