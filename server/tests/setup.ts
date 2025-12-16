// always bypass JWT token verification
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(() => ({ user_id: 1 })),
}));