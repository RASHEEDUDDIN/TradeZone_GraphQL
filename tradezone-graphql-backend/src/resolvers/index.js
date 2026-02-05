const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const requireAuth = (context) => {
  if (!context.user) {
    throw new Error('Authentication required. Please login.');
  }
  return context.user;
};

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      const authUser = requireAuth(context);
      return await User.findById(authUser.id);
    },

    users: async () => {
      return await User.find().sort({ createdAt: -1 });
    },

    userById: async (_, { id }) => {
      return await User.findById(id);
    },

    items: async () => {
      return await Item.find({ inStock: true }).sort({ createdAt: -1 });
    },

    itemById: async (_, { id }) => {
      return await Item.findById(id);
    },

    itemsBySeller: async (_, { sellerId }) => {
      return await Item.find({ sellerId }).sort({ createdAt: -1 });
    },

    myItems: async (_, __, context) => {
      const user = requireAuth(context);
      return await Item.find({ sellerId: user.id }).sort({ createdAt: -1 });
    },

    transactions: async () => {
      return await Transaction.find().sort({ createdAt: -1 });
    },

    transactionsByUser: async (_, { userId }) => {
      return await Transaction.find({ userId }).sort({ createdAt: -1 });
    },

    myTransactions: async (_, __, context) => {
      const user = requireAuth(context);
      return await Transaction.find({ userId: user.id }).sort({ createdAt: -1 });
    }
  },

  Mutation: {
    register: async (_, { input }) => {
      try {
        const existingUser = await User.findOne({ username: input.username });
        if (existingUser) {
          return { success: false, message: 'Username already exists', user: null, token: null };
        }

        const user = new User({
          username: input.username,
          password: input.password,
          role: input.role || 'user'
        });
        await user.save();

        const token = generateToken(user);
        return {
          success: true,
          message: 'Registration successful',
          user: { id: user._id, username: user.username, role: user.role },
          token
        };
      } catch (error) {
        return { success: false, message: error.message, user: null, token: null };
      }
    },

    login: async (_, { username, password }) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return { success: false, message: 'User not found', user: null, token: null };
        }

        const isValid = await user.comparePassword(password);
        if (!isValid) {
          return { success: false, message: 'Invalid password', user: null, token: null };
        }

        const token = generateToken(user);
        return {
          success: true,
          message: 'Login successful',
          user: { id: user._id, username: user.username, role: user.role },
          token
        };
      } catch (error) {
        return { success: false, message: error.message, user: null, token: null };
      }
    },

    createItem: async (_, { input }, context) => {
      const user = requireAuth(context);
      const item = new Item({
        ...input,
        sellerId: user.id,
        userName: user.username
      });
      await item.save();
      return item;
    },

    updateItem: async (_, { id, input }, context) => {
      const user = requireAuth(context);
      const item = await Item.findById(id);
      if (!item) throw new Error('Item not found');
      if (item.sellerId.toString() !== user.id) {
        throw new Error('Not authorized');
      }
      Object.assign(item, input);
      await item.save();
      return item;
    },

    deleteItem: async (_, { id }, context) => {
      const user = requireAuth(context);
      const item = await Item.findById(id);
      if (!item) throw new Error('Item not found');
      if (item.sellerId.toString() !== user.id && user.role !== 'admin') {
        throw new Error('Not authorized');
      }
      await Item.findByIdAndDelete(id);
      return true;
    },

    createTransaction: async (_, { input }, context) => {
      const user = requireAuth(context);
      const transaction = new Transaction({
        userId: user.id,
        items: input.items,
        totalAmount: input.totalAmount,
        status: 'completed'
      });
      await transaction.save();
      return transaction;
    },

    updateTransactionStatus: async (_, { id, status }, context) => {
      const user = requireAuth(context);
      if (user.role !== 'admin') {
        throw new Error('Admin access required');
      }
      return await Transaction.findByIdAndUpdate(id, { status }, { new: true });
    }
  },

  Transaction: {
    user: async (parent) => {
      return await User.findById(parent.userId);
    }
  }
};

module.exports = resolvers;