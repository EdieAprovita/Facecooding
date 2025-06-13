const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
jest.mock('normalize-url', () => jest.fn((u) => u));
jest.mock('../src/models/User', () => {
  const mockModel: any = function (data: any) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue(this);
    this.toJSON = jest.fn(() => this);
  };
  mockModel.findOne = jest.fn();
  mockModel.findById = jest.fn();
  mockModel.findByIdAndUpdate = jest.fn();
  mockModel.findByIdAndDelete = jest.fn();
  return mockModel;
});
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const authService = require('../src/services/authService');
const User = require('../src/models/User');

const mockedUser = User as jest.Mocked<typeof User>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should sign a JWT token', () => {
      (jwt.sign as jest.Mock).mockReturnValue('token');
      const token = authService.generateToken('123');
      expect(jwt.sign).toHaveBeenCalled();
      expect(token).toBe('token');
    });
  });

  describe('verifyToken', () => {
    it('should verify token', () => {
      (jwt.verify as jest.Mock).mockReturnValue({ user: { id: '123' } });
      const decoded = authService.verifyToken('token');
      expect(jwt.verify).toHaveBeenCalled();
      expect(decoded).toEqual({ user: { id: '123' } });
    });

    it('should throw on invalid token', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('Invalid token'); });
      expect(() => authService.verifyToken('bad')).toThrow('Invalid token');
    });
  });

  describe('hashPassword & comparePassword', () => {
    it('should hash and compare password', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const hashed = await authService.hashPassword('pass');
      expect(hashed).toBe('hashed');

      const match = await authService.comparePassword('pass', 'hashed');
      expect(match).toBe(true);
    });
  });

  describe('register', () => {
    it('should create a user and return token', async () => {
      mockedUser.findOne.mockResolvedValue(null);
      mockedUser.prototype.save = jest.fn().mockResolvedValue(true);
      jest.spyOn(authService, 'generateToken').mockReturnValue('token');
      jest.spyOn(authService, 'hashPassword').mockResolvedValue('hashed');
      jest.spyOn(authService, 'generateAvatar').mockReturnValue('avatar');

      const result = await authService.register({ name: 'n', email: 'e', password: 'p' });

      expect(result).toEqual({ token: 'token', user: expect.any(Object) });
    });
  });
});
export {};
