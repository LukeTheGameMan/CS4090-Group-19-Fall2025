import request from 'supertest';
import app from '../../src/app';

// mock getPrisma
jest.mock('../../src/prisma', () => ({
    getPrisma: () => ({
        post: {
            findFirst: jest.fn(async ({ where }) => {
                if (where.post_id === 1) {
                    return {
                        post_id: 1,
                        title: 'Test Post',
                        content: 'Hello World',
                        user_id: 1,
                        user: { username: 'testuser' },
                        _count: { postLikes: 5, postDislikes: 2, comments: 3 },
                        creation_date: new Date(),
                    };
                }
                if (where.post_id === 2) {  // add this for your test
                    return {
                        post_id: 2,
                        title: 'Another Post',
                        content: 'Second post content',
                        user_id: 2,
                        user: { username: 'anotheruser' },
                        _count: { postLikes: 0, postDislikes: 0, comments: 0 },
                        creation_date: new Date(),
                    };
                }
                return null;
            }),
            findMany: jest.fn(async () => [
                {
                    post_id: 1,
                    title: 'Test Post',
                    content: 'Hello World',
                    user_id: 1,
                    user: { username: 'testuser' },
                    _count: { postLikes: 5, postDislikes: 2, comments: 3 },
                    creation_date: new Date(),
                },
            ]),
            create: jest.fn(async () => ({ post_id: 1 })),
        },
        postLike: {
            findFirst: jest.fn(async ({ where }) => {
                if (where.user_id === 1 && where.post_id === 1) return { id: 1 };
                return null;
            }),
            create: jest.fn(async () => ({ id: 1 })),
        },
        postDislike: {
            findFirst: jest.fn(async ({ where }) => null),
            create: jest.fn(async () => ({ id: 1 })),
        },
    }),
}));

describe('Post routes', () => {

    const tokenCookie = 'token=FAKETOKEN'; // fake token for requireAuth

    it('POST /api/v1/post/createpost returns 201', async () => {
        const res = await request(app)
            .post('/api/v1/post/createpost')
            .set('Cookie', [tokenCookie])
            .send({ title: 'New Post', content: 'Content here' });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.post_id).toBe(1);
    });

    it('GET /api/v1/post/getpost returns 200 if post exists', async () => {
        const res = await request(app)
            .get('/api/v1/post/getpost')
            .query({ post_id: 1 });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.post.post_id).toBe(1);
        expect(res.body.post.username).toBe('testuser');
    });

    it('GET /api/v1/post/getpost returns 404 if post does not exist', async () => {
        const res = await request(app)
            .get('/api/v1/post/getpost')
            .query({ post_id: 999 });

        expect(res.status).toBe(404);
    });

    it('GET /api/v1/post/viewposts returns 200 with posts', async () => {
        const res = await request(app)
            .get('/api/v1/post/viewposts');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.posts.length).toBeGreaterThan(0);
        expect(res.body.posts[0]).toHaveProperty('post_id');
        expect(res.body.posts[0]).toHaveProperty('username');
    });

    it('POST /api/v1/post/votepost returns 201 when liking a post', async () => {
        const res = await request(app)
            .post('/api/v1/post/votepost')
            .set('Cookie', [tokenCookie])
            .send({ post_id: 2, like: 1 }); // post_id 2 is not liked yet in mock

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
    });

    it('POST /api/v1/post/votepost returns 409 if already liked', async () => {
        const res = await request(app)
            .post('/api/v1/post/votepost')
            .set('Cookie', [tokenCookie])
            .send({ post_id: 1, like: 1 }); // post_id 1 is already liked in mock

        expect(res.status).toBe(409);
    });

    it('POST /api/v1/post/votepost returns 400 for invalid input', async () => {
        const res = await request(app)
            .post('/api/v1/post/votepost')
            .set('Cookie', [tokenCookie])
            .send({ post_id: 'abc', like: 5 });

        expect(res.status).toBe(400);
    });

});