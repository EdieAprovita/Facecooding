import request from 'supertest';
import App from '../app';

jest.mock('../config/database', () => ({
  __esModule: true,
  default: {
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    getConnectionStatus: jest.fn(() => true),
  },
}));

describe('Auth Routes', () => {
  const app = new App().getApp();

  it('should return 401 for GET /api/auth/me when not authenticated', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
