const mongoose = require('mongoose');

const transactionItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    default: 1
  }
});

const transactionSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [transactionItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'refunded'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate orderId before saving - ✅ Fixed: Removed next() call
transactionSchema.pre('save', function() {
  if (!this.orderId) {
    this.orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  // ✅ No next() needed for synchronous operations in Mongoose 5+
});

module.exports = mongoose.model('Transaction', transactionSchema);