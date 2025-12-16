// src/tests/comment/comment.test.ts
import request from 'supertest';
import app from '../../src/app';

// Mock Prisma
jest.mock('../../src/prisma', () => ({
    getPrisma: () => ({
        post: {
            findFirst: jest.fn(async ({ where }) => {
                if (where.post_id === 1) return { post_id: 1 };
                return null;
            }),
        },
        comment: {
            create: jest.fn(async ({ data }) => ({ comment_id: 1 })),
            findMany: jest.fn(async () => [{ 
                comment_id: 1,
                content: 'test comment',
                user: { username: 'tester' },
                _count: { commentLikes: 0, commentDislikes: 0 },
                creation_date: new Date(),
            }]),
            findFirst: jest.fn(async ({ where }) => {
                if (where.comment_id === 1) return { comment_id: 1 };
                return null;
            }),
        },
        commentLike: {
            findFirst: jest.fn(async () => null),
            create: jest.fn(async ({ data }) => ({ id: 1 })),
        },
        commentDislike: {
            findFirst: jest.fn(async () => null),
            create: jest.fn(async ({ data }) => ({ id: 1 })),
        },
    }),
}));

describe('Comment routes', () => {

    // createComment
    it('POST /api/v1/comment/createcomment returns 201 when post exists', async () => {
        const res = await request(app)
            .post('/api/v1/comment/createcomment')
            .send({ post_id: 1, content: 'Hello' })
            .set('Cookie', ['token=FAKETOKEN']);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
    });

    it('POST /api/v1/comment/createcomment returns 404 if post does not exist', async () => {
        const res = await request(app)
            .post('/api/v1/comment/createcomment')
            .send({ post_id: 999, content: 'Hello' })
            .set('Cookie', ['token=FAKETOKEN']);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });

    // findManyComments
    it('GET /api/v1/comment/viewcomments returns 200 with comments', async () => {
        const res = await request(app)
            .get('/api/v1/comment/viewcomments?post_id=1');

        expect(res.status).toBe(200);
        expect(res.body.comments.length).toBeGreaterThan(0);
    });

    // voteComments
    it('POST /api/v1/comment/votecomment returns 201 on like', async () => {
        const res = await request(app)
            .post('/api/v1/comment/votecomment')
            .send({ comment_id: 1, like: 1 })
            .set('Cookie', ['token=FAKETOKEN']);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
    });

    it('POST /api/v1/comment/votecomment returns 400 for invalid input', async () => {
        const res = await request(app)
            .post('/api/v1/comment/votecomment')
            .send({ comment_id: 'abc', like: 5 })
            .set('Cookie', ['token=FAKETOKEN']);

        expect(res.status).toBe(400);
    });

    it('POST /api/v1/comment/votecomment returns 404 if comment does not exist', async () => {
        const { getPrisma } = require('../../src/prisma');
        getPrisma().comment.findFirst.mockImplementationOnce(async () => null);

        const res = await request(app)
            .post('/api/v1/comment/votecomment')
            .send({ comment_id: 999, like: 1 })
            .set('Cookie', ['token=FAKETOKEN']);

        expect(res.status).toBe(404);
    });

});
