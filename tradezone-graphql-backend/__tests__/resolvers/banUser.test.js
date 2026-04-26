const resolvers = require('../../src/resolvers');
const User = require('../../src/models/User');

// Mock User model
jest.mock('../../src/models/User');

describe('banUser and unbanUser resolvers', () => {
  const adminContext = { user: { role: 'admin' } };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('banUser returns user object with status: "banned"', async () => {
    User.findByIdAndUpdate.mockResolvedValue({
      _id: '123',
      status: 'banned',
      bannedBy: 'admin1'
    });

    const result = await resolvers.Mutation.banUser(
      null, 
      { id: '123', bannedBy: 'admin1' }, 
      adminContext
    );

    expect(result).toBeDefined();
    expect(result.status).toBe('banned');
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      '123',
      { status: 'banned', bannedBy: 'admin1' },
      { new: true }
    );
  });

  it('banUser sets bannedBy to the passed admin username', async () => {
    User.findByIdAndUpdate.mockResolvedValue({
      _id: '123',
      status: 'banned',
      bannedBy: 'admin_user_x'
    });

    const result = await resolvers.Mutation.banUser(
      null, 
      { id: '123', bannedBy: 'admin_user_x' }, 
      adminContext
    );

    expect(result.bannedBy).toBe('admin_user_x');
  });

  it('unbanUser returns user object with status: "active"', async () => {
    User.findByIdAndUpdate.mockResolvedValue({
      _id: '123',
      status: 'active',
      bannedBy: null
    });

    const result = await resolvers.Mutation.unbanUser(
      null, 
      { id: '123' }, 
      adminContext
    );

    expect(result.status).toBe('active');
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      '123',
      { status: 'active', bannedBy: null },
      { new: true }
    );
  });

  it('unbanUser sets bannedBy to null', async () => {
    User.findByIdAndUpdate.mockResolvedValue({
      _id: '123',
      status: 'active',
      bannedBy: null
    });

    const result = await resolvers.Mutation.unbanUser(
      null, 
      { id: '123' }, 
      adminContext
    );

    expect(result.bannedBy).toBeNull();
  });

  it('banUser on already-banned user still resolves (no throw)', async () => {
    User.findByIdAndUpdate.mockResolvedValue({
      _id: '123',
      status: 'banned',
      bannedBy: 'admin1'
    });

    await expect(
      resolvers.Mutation.banUser(null, { id: '123', bannedBy: 'admin1' }, adminContext)
    ).resolves.not.toThrow();
  });

  it('Both resolvers return the status field (not undefined)', async () => {
    User.findByIdAndUpdate.mockResolvedValueOnce({
      _id: '123',
      status: 'banned'
    });

    const banResult = await resolvers.Mutation.banUser(
      null, 
      { id: '123', bannedBy: 'admin' }, 
      adminContext
    );
    expect(banResult.status).toBeDefined();

    User.findByIdAndUpdate.mockResolvedValueOnce({
      _id: '123',
      status: 'active'
    });

    const unbanResult = await resolvers.Mutation.unbanUser(
      null, 
      { id: '123' }, 
      adminContext
    );
    expect(unbanResult.status).toBeDefined();
  });
});
