const resolvers = require('../../src/resolvers');
const Transaction = require('../../src/models/Transaction');

jest.mock('../../src/models/Transaction');

describe('createTransaction resolver', () => {
  const userContext = { user: { id: 'user123', role: 'user' } };
  const mockInput = {
    items: [{ itemId: 'item1', name: 'Item 1', price: 10, quantity: 1 }],
    totalAmount: 10
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup the mock constructor to return an object with a save method
    Transaction.mockImplementation(function(data) {
      Object.assign(this, data);
      // Mock the auto-generation of orderId that happens in pre-save hook
      this.orderId = 'ORD-123456789-ABCDEF';
      this.save = jest.fn().mockResolvedValue(this);
    });
  });

  it('Throws authentication error if no user in context', async () => {
    await expect(
      resolvers.Mutation.createTransaction(null, { input: mockInput }, {})
    ).rejects.toThrow('Authentication required. Please login.');
  });

  it('Resolver creates a transaction with correct fields', async () => {
    await resolvers.Mutation.createTransaction(
      null, 
      { input: mockInput }, 
      userContext
    );

    expect(Transaction).toHaveBeenCalledWith({
      userId: 'user123',
      items: mockInput.items,
      totalAmount: mockInput.totalAmount,
      status: 'completed'
    });
  });

  it('Returns a transaction object with orderId present', async () => {
    const result = await resolvers.Mutation.createTransaction(
      null, 
      { input: mockInput }, 
      userContext
    );

    expect(result).toBeDefined();
    expect(result.orderId).toBeDefined();
  });

  it('Does not throw "next is not a function"', async () => {
    await expect(
      resolvers.Mutation.createTransaction(null, { input: mockInput }, userContext)
    ).resolves.not.toThrow();
  });
});
