import { expect } from 'chai';
import chaiHttp from 'chai-http'; 
import { describe, it } from 'mocha';
import bcrypt from 'bcrypt';
import { User } from '../models/schema';
import { app } from '../app';

chai.use(chaiHttp); // Use chaiHttp plugin

describe('User Registration', () => {
    it('should register a new user successfully', async () => {
        const userData = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        };

        // Clear existing user data
        await User.deleteMany({});

        // Make POST request to register a new user
        const res = await chai.request(app) // Use chai.request for HTTP requests
            .post('/api/user/signup')
            .send(userData);

        // Assert the response status code
        expect(res.status).to.equal(200);

        // Assert the response body
        expect(res.body).to.have.property('message').to.equal('User registered successfully');

        // Verify user is saved in the database
        const user = await User.findOne({ email: userData.email });
        expect(user).to.exist;
        expect(user?.username).to.equal(userData.username);

        // Verify password is hashed
        const isPasswordCorrect = await bcrypt.compare(userData.password, user?.password || '');
        expect(isPasswordCorrect).to.be.true;
    });
});
