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

describe('Health Check', () => {
  const app = new App().getApp();

  it('should return 200 on GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });
});
