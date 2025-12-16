import request from 'supertest';
import app from '../../src/app';
import bcrypt from 'bcrypt';

// mock prisma
jest.mock('../../src/prisma', () => ({
    getPrisma: () => ({
        user: {
            findUnique: jest.fn(async ({ where }) => {
                if (where.username === 'existinguser') return { user_id: 1, username: 'existinguser', email: 'existing@example.com' };
                if (where.email === 'existing@example.com') return { user_id: 1, username: 'existinguser', email: 'existing@example.com' };
                return null;
            }),
            create: jest.fn(async ({ data }) => ({ user_id: 2, ...data }))
        },
        userPermission: {
            create: jest.fn(async ({ data }) => ({ user_id: data.user_id }))
        }
    })
}));

// mock bcrypt
jest.mock('bcrypt', () => ({
    hash: jest.fn(async (password, salt) => 'FAKEHASH')
}));

describe('User routes', () => {

    it('POST /api/v1/users/register returns 201 when valid input', async () => {
        const res = await request(app)
            .post('/api/v1/user/register')
            .send({ username: 'newuser', email: 'new@example.com', password: 'password123' });
        
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.user_id).toBe(2);
    });

    it('POST /api/v1/users/register returns 400 if missing fields', async () => {
        const res = await request(app)
            .post('/api/v1/user/register')
            .send({ username: '', email: '', password: '' });

        expect(res.status).toBe(400);
    });

    it('POST /api/v1/users/register returns 400 if invalid email', async () => {
        const res = await request(app)
            .post('/api/v1/user/register')
            .send({ username: 'user', email: 'not-an-email', password: 'password123' });

        expect(res.status).toBe(400);
    });

    it('POST /api/v1/users/register returns 400 if password too short', async () => {
        const res = await request(app)
            .post('/api/v1/user/register')
            .send({ username: 'user', email: 'user@example.com', password: 'short' });

        expect(res.status).toBe(400);
    });

    it('POST /api/v1/users/register returns 400 if username too short', async () => {
        const res = await request(app)
            .post('/api/v1/user/register')
            .send({ username: 'ab', email: 'user@example.com', password: 'password123' });

        expect(res.status).toBe(400);
    });

    it('POST /api/v1/users/register returns 400 if username already exists', async () => {
        const res = await request(app)
            .post('/api/v1/user/register')
            .send({ username: 'existinguser', email: 'new@example.com', password: 'password123' });

        expect(res.status).toBe(400);
    });

    it('POST /api/v1/users/register returns 400 if email already exists', async () => {
        const res = await request(app)
            .post('/api/v1/user/register')
            .send({ username: 'newuser', email: 'existing@example.com', password: 'password123' });

        expect(res.status).toBe(400);
    });

});
