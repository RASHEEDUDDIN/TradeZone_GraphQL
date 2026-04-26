const mongoose = require('mongoose');
const Transaction = require('../../src/models/Transaction');

describe('Transaction Model pre-save hook', () => {
  beforeAll(() => {
    // Mock save to manually execute the pre-save hooks so we don't need a DB connection
    jest.spyOn(Transaction.prototype, 'save').mockImplementation(async function() {
      const hooks = this.schema.s.hooks._pres.get('save') || [];
      // Find our custom hook
      const customHook = hooks.find(h => h.fn.toString().includes('this.orderId'));
      if (customHook) {
        if (customHook.fn.length > 0) {
          await new Promise((resolve) => customHook.fn.call(this, resolve));
        } else {
          await customHook.fn.call(this);
        }
      }
      return this;
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('save() resolves without throwing "next is not a function"', async () => {
    const doc = new Transaction({ 
      userId: new mongoose.Types.ObjectId(), 
      totalAmount: 100 
    });
    // This will execute the mocked save which runs the hooks
    await expect(doc.save()).resolves.not.toThrow();
  });

  it('orderId is auto-generated in ORD-{timestamp}-{random} format after save', async () => {
    const doc = new Transaction({ 
      userId: new mongoose.Types.ObjectId(), 
      totalAmount: 100 
    });
    await doc.save();
    expect(doc.orderId).toBeDefined();
    expect(doc.orderId).toMatch(/^ORD-\d+-[A-Z0-9]+$/);
  });

  it('orderId is unique across two saved documents', async () => {
    const doc1 = new Transaction({ userId: new mongoose.Types.ObjectId(), totalAmount: 100 });
    const doc2 = new Transaction({ userId: new mongoose.Types.ObjectId(), totalAmount: 100 });
    
    await doc1.save();
    await doc2.save();
    
    expect(doc1.orderId).not.toBe(doc2.orderId);
  });

  it('the pre-save hook does NOT accept or call any callback parameter', () => {
    const hooks = Transaction.schema.s.hooks._pres.get('save') || [];
    // The last hook is usually the user-defined one in the schema
    const userHook = hooks[hooks.length - 1];
    expect(userHook.fn.length).toBe(0); // Arity 0 means no 'next' param
  });
});
