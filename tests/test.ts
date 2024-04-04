import { Request, Response } from 'express';
import { AuthController } from '../controllers/auth/AuthController';
import AuthService from '../services/AuthService';



// Mocking the AuthService
jest.mock('../../services/AuthService');

// Mocking the Request and Response objects
const mockRequest = {} as Request;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn(),
} as unknown as Response;

describe('AuthController', () => {
  describe('signUp', () => {
    it('should return 200 status with success message if registration succeeds', async () => {
      const authService = new AuthService() as jest.Mocked<AuthService>;
      const authController = new AuthController() as jest.Mocked<AuthController>
      authService.registerUser.mockResolvedValueOnce({ success: true, message: 'User registered successfully' });
      
      await authController.signUp(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
    });

    it('should return 400 status with error message if registration fails', async () => {
      const authService = new AuthService() as jest.Mocked<AuthService>;
      const authController = new AuthController() as jest.Mocked<AuthController>
      authService.registerUser.mockResolvedValueOnce({ success: false, message: 'Email already exists' });
      
      await authController.signUp(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Email already exists' });
    });

    it('should return 500 status if an error occurs during registration', async () => {
      const authService = new AuthService() as jest.Mocked<AuthService>;
      authService.registerUser.mockRejectedValueOnce(new Error('Database error'));
      const authController = new AuthController() as jest.Mocked<AuthController>
    
      await authController.signUp(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Error occurred while registering user.');
    });
  });

 
});
