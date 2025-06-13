// Centralized Jest setup for common mocks
jest.mock('normalize-url', () => jest.fn((u: string) => u));
