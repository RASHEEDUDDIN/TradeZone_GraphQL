const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    contactDetails: String
    role: String!
    status: String!        # ✅ Changed from String to String! (required)
    bannedBy: String       # ✅ ADDED - This was missing!
    listedItems: [String]
    createdAt: String
  }

  type AuthPayload {
    success: Boolean!
    message: String
    user: User
    token: String
  }

  type Item {
    id: ID!
    name: String!
    description: String
    price: Float!
    sellerId: ID!
    userName: String!
    image: String
    category: String
    inStock: Boolean
    status: String
    bannedBy: String
    createdAt: String
  }

  type TransactionItem {
    itemId: ID!
    name: String!
    price: Float!
    quantity: Int!
  }

  type Transaction {
    id: ID!
    orderId: String!
    userId: ID!
    user: User
    items: [TransactionItem!]!
    totalAmount: Float!
    status: String!
    createdAt: String
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    contactDetails: String
    role: String
  }

  input ItemInput {
    name: String!
    description: String
    price: Float!
    image: String
    category: String
  }

  input TransactionItemInput {
    itemId: ID!
    name: String!
    price: Float!
    quantity: Int!
  }

  input TransactionInput {
    items: [TransactionItemInput!]!
    totalAmount: Float!
  }

  type Query {
    me: User
    users: [User!]!
    userById(id: ID!): User
    items: [Item!]!
    allItems: [Item!]!
    itemById(id: ID!): Item
    itemsBySeller(sellerId: ID!): [Item!]!
    myItems: [Item!]!
    transactions: [Transaction!]!
    transactionsByUser(userId: ID!): [Transaction!]!
    myTransactions: [Transaction!]!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    createItem(input: ItemInput!): Item!
    updateItem(id: ID!, input: ItemInput!): Item!
    deleteItem(id: ID!): Boolean!
    createTransaction(input: TransactionInput!): Transaction!
    updateTransactionStatus(id: ID!, status: String!): Transaction!
    
    # Admin mutations
    banItem(id: ID!, bannedBy: String!): Item!
    unbanItem(id: ID!): Item!
    banUser(id: ID!, bannedBy: String!): User!
    unbanUser(id: ID!): User!
    deleteUser(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;