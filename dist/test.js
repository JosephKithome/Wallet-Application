"use strict";
// import request from 'supertest';
// import { App } from '../app';
// describe('User Registration Endpoint', () => {
//     it('should register a new user with valid data', async () => {
//         const userData = {
//             username: 'testuser',
//             email: 'test@example.com',
//             password: 'password123',
//             firstName: 'John',
//             lastName: 'Doe',
//             phone: '1234567890'
//         };
//         const res = await request(app)
//             .post('/api/v1/user/signup')
//             .send(userData);
//         expect(res.status).toEqual(200);
//         expect(res.body.message).toEqual('User registered successfully');
//     });
//     it('should return an error for invalid username', async () => {
//         const userData = {
//             username: '', // Empty username
//             email: 'test@example.com',
//             password: 'password123',
//             firstName: 'John',
//             lastName: 'Doe',
//             phone: '1234567890'
//         };
//         const res = await request(app)
//             .post('/api/v1/user/signup')
//             .send(userData);
//         expect(res.status).toEqual(400); 
//         expect(res.body.error).toEqual('Please provide a valid username'); 
//     });
// });
// describe('User Login Endpoint', () => {
//     it('should successfully log in a user with valid credentials', async () => {
//         const userData = {
//             email: 'test@example.com',
//             password: 'password123'
//         };
//         const res = await request(app)
//             .post('/api/v1/user/login')
//             .send(userData);
//         expect(res.status).toEqual(200);
//         expect(res.body.token).toBeDefined(); 
//     });
//     it('should return an error for invalid email', async () => {
//         const userData = {
//             email: '', // Empty email
//             password: 'password123'
//         };
//         const res = await request(app)
//             .post('/api/v1/user/login')
//             .send(userData);
//         expect(res.status).toEqual(400); 
//         expect(res.body.error).toEqual('Please provide a valid email and password'); 
//     });
//     it('should return an error for invalid password', async () => {
//         const userData = {
//             email: 'test@example.com',
//             password: '' // Empty password
//         };
//         const res = await request(app)
//             .post('/api/v1/user/login')
//             .send(userData);
//         expect(res.status).toEqual(400); 
//         expect(res.body.error).toEqual('Please provide a valid password'); 
//     });
//     it('should return an error for user not found', async () => {
//         const userData = {
//             email: 'nonexistent@example.com', 
//             password: 'password123'
//         };
//         const res = await request(app)
//             .post('/api/v1/user/login')
//             .send(userData);
//         expect(res.status).toEqual(401); 
//         expect(res.text).toEqual('Invalid Email');
//     });
//     // Test case for incorrect password
//     it('should return an error for incorrect password', async () => {
//         const userData = {
//             email: 'test@example.com',
//             password: 'incorrectpassword'
//         };
//         const res = await request(app)
//             .post('/api/v1/user/login')
//             .send(userData);
//         expect(res.status).toEqual(401); 
//         expect(res.text).toEqual('Invalid email');
//     });
// });
