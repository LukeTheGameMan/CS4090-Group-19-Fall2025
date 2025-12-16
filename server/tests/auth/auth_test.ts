import request from 'supertest';
import app from '../../src/app';
import jwt from 'jsonwebtoken';

jest.mock('../../src/prisma', () => ({
    getPrisma: () => ({
        user: {
            findUnique: jest.fn(async ({ where }) => {
                if (where.username === 'exists') {
                    return { user_id: 1, username: 'exists', password_hash: '$2b$10$abcdef' };
                }
                if (where.user_id === 1) {
                    return { user_id: 1, username: 'exists', email: 'test@example.com' };
                }
                return null;
            }),
        },
    }),
}));

jest.mock('bcrypt', () => ({
    compare: jest.fn(async () => true),
}));

jest.mock('../../src/api/v1/auth/createToken', () => ({
    createToken: () => 'FAKETOKEN',
}));

describe('Auth routes', () => {

    it('POST /api/v1/auth/login returns 200 when user exists', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ username: 'exists', password: 'anything' });

        expect(res.status).toBe(200);
    });

    it('POST /api/v1/auth/login returns 404 if user does not exist', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ username: 'nonexistent', password: 'anything' });

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it('POST /api/v1/auth/login returns 401 if password invalid', async () => {
        // override bcrypt mock for this test
        const bcrypt = require('bcrypt');
        bcrypt.compare.mockImplementationOnce(async () => false);

        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ username: 'exists', password: 'wrongpass' });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it('GET /api/v1/auth/me returns 200 with user info', async () => {
        const res = await request(app)
            .get('/api/v1/auth/me')
            .set('Cookie', ['token=FAKETOKEN']);

        expect(res.status).toBe(200);
        expect(res.body.user.username).toBe('exists');
    });

    it('GET /api/v1/auth/me returns 401 if no token', async () => {
        const res = await request(app)
            .get('/api/v1/auth/me'); // no cookie

        expect(res.status).toBe(401);
    });

    it('GET /api/v1/auth/me returns 403 if token invalid', async () => {
        // override jwt.verify to throw
        (jwt as any).verify.mockImplementationOnce(() => {
            throw new Error('Invalid token');
        });

        const res = await request(app)
            .get('/api/v1/auth/me')
            .set('Cookie', ['token=BADTOKEN']);

        expect(res.status).toBe(403);
    });

});