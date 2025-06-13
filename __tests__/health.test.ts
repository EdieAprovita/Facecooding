import request from 'supertest';
import App from '../src/app';

jest.mock('normalize-url', () => jest.fn((u) => u));

jest.mock('../src/config/database', () => jest.fn());

describe('Health Endpoint', () => {
  let app: App;

  beforeAll(() => {
    app = new App();
  });

  it('responds with server status', async () => {
    const response = await request(app.getApp()).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Server is running');
  });
});
export {};
