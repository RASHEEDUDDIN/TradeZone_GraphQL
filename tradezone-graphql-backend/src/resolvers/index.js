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

const requireAdmin = (context) => {
  const user = requireAuth(context);
  if (user.role !== 'admin') {
    throw new Error('Admin access required.');
  }
  return user;
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

    // Items for marketplace (only active, in stock)
    items: async () => {
      return await Item.find({ inStock: true, status: 'active' }).sort({ createdAt: -1 });
    },

    // All items for admin (including banned)
    allItems: async () => {
      return await Item.find().sort({ createdAt: -1 });
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
        const existingUsername = await User.findOne({ username: input.username });
        if (existingUsername) {
          return { success: false, message: 'Username already exists', user: null, token: null };
        }

        const existingEmail = await User.findOne({ email: input.email });
        if (existingEmail) {
          return { success: false, message: 'Email already exists', user: null, token: null };
        }

        const user = new User({
          username: input.username,
          email: input.email,
          password: input.password,
          contactDetails: input.contactDetails || '',
          role: input.role || 'user',
          status: 'active',
          listedItems: []
        });
        await user.save();

        const token = generateToken(user);
        return {
          success: true,
          message: 'Registration successful',
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            contactDetails: user.contactDetails,
            role: user.role,
            status: user.status
          },
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

        if (user.status === 'banned') {
          return { success: false, message: 'Your account has been banned.', user: null, token: null };
        }

        const isValid = await user.comparePassword(password);
        if (!isValid) {
          return { success: false, message: 'Invalid password', user: null, token: null };
        }

        const token = generateToken(user);
        return {
          success: true,
          message: 'Login successful',
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            contactDetails: user.contactDetails,
            role: user.role,
            status: user.status
          },
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
        userName: user.username,
        status: 'active'
      });
      await item.save();
      return item;
    },

    updateItem: async (_, { id, input }, context) => {
      const user = requireAuth(context);
      const item = await Item.findById(id);
      if (!item) throw new Error('Item not found');
      if (item.sellerId.toString() !== user.id && user.role !== 'admin') {
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
      requireAdmin(context);
      return await Transaction.findByIdAndUpdate(id, { status }, { new: true });
    },

    // Admin: Ban item
    banItem: async (_, { id, bannedBy }, context) => {
      requireAdmin(context);
      const item = await Item.findByIdAndUpdate(
        id,
        { status: 'banned', bannedBy },
        { new: true }
      );
      if (!item) throw new Error('Item not found');
      return item;
    },

    // Admin: Unban item
    unbanItem: async (_, { id }, context) => {
      requireAdmin(context);
      const item = await Item.findByIdAndUpdate(
        id,
        { status: 'active', bannedBy: null },
        { new: true }
      );
      if (!item) throw new Error('Item not found');
      return item;
    },

    // Admin: Ban user
    banUser: async (_, { id, bannedBy }, context) => {
      requireAdmin(context);
      const user = await User.findByIdAndUpdate(
        id,
        { status: 'banned', bannedBy },
        { new: true }
      );
      if (!user) throw new Error('User not found');
      return user;
    },

    // Admin: Unban user
    unbanUser: async (_, { id }, context) => {
      requireAdmin(context);
      const user = await User.findByIdAndUpdate(
        id,
        { status: 'active', bannedBy: null },
        { new: true }
      );
      if (!user) throw new Error('User not found');
      return user;
    },

    // Admin: Delete user
    deleteUser: async (_, { id }, context) => {
      requireAdmin(context);
      const user = await User.findByIdAndDelete(id);
      if (!user) throw new Error('User not found');
      return true;
    }
  },

  Transaction: {
    user: async (parent) => {
      return await User.findById(parent.userId);
    }
  }
};

module.exports = resolvers;