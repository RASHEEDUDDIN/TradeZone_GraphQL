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

// Generate orderId before saving
transactionSchema.pre('save', function(next) {
  if (!this.orderId) {
    this.orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);