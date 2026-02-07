import { gql } from '@apollo/client';

// Get current logged in user
export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      role
      status
      contactDetails
      createdAt
    }
  }
`;

// Get all users - ✅ FIXED: Added email, status, contactDetails, bannedBy
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      email
      role
      status
      contactDetails
      bannedBy
      createdAt
    }
  }
`;

// Get user by ID
export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    userById(id: $id) {
      id
      username
      email
      role
      status
      contactDetails
      bannedBy
      createdAt
    }
  }
`;

// Get all items (marketplace - active only)
export const GET_ITEMS = gql`
  query GetItems {
    items {
      id
      name
      description
      price
      sellerId
      userName
      image
      category
      inStock
      createdAt
    }
  }
`;

// Admin: Get all items (including banned)
export const GET_ALL_ITEMS = gql`
  query GetAllItems {
    allItems {
      id
      name
      description
      price
      sellerId
      userName
      image
      category
      inStock
      status
      bannedBy
      createdAt
    }
  }
`;

// Get item by ID
export const GET_ITEM_BY_ID = gql`
  query GetItemById($id: ID!) {
    itemById(id: $id) {
      id
      name
      description
      price
      sellerId
      userName
      image
      category
      inStock
      createdAt
    }
  }
`;

// Get items by seller
export const GET_ITEMS_BY_SELLER = gql`
  query GetItemsBySeller($sellerId: ID!) {
    itemsBySeller(sellerId: $sellerId) {
      id
      name
      description
      price
      userName
      category
      inStock
    }
  }
`;

// Get my items (logged in user)
export const GET_MY_ITEMS = gql`
  query GetMyItems {
    myItems {
      id
      name
      description
      price
      userName
      category
      inStock
      createdAt
    }
  }
`;

// Get all transactions
export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
      id
      orderId
      userId
      items {
        itemId
        name
        price
        quantity
      }
      totalAmount
      status
      createdAt
      user {
        id
        username
      }
    }
  }
`;

// Get transactions by user
export const GET_TRANSACTIONS_BY_USER = gql`
  query GetTransactionsByUser($userId: ID!) {
    transactionsByUser(userId: $userId) {
      id
      orderId
      items {
        itemId
        name
        price
        quantity
      }
      totalAmount
      status
      createdAt
    }
  }
`;

// Get my transactions
export const GET_MY_TRANSACTIONS = gql`
  query GetMyTransactions {
    myTransactions {
      id
      orderId
      items {
        itemId
        name
        price
        quantity
      }
      totalAmount
      status
      createdAt
    }
  }
`;