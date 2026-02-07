import { gql } from '@apollo/client';

// Register new user
export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      success
      message
      token
      user {
        id
        username
        email
        contactDetails
        role
        status
      }
    }
  }
`;

// Login user
export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      success
      message
      token
      user {
        id
        username
        role
      }
    }
  }
`;

// Create new item
export const CREATE_ITEM = gql`
  mutation CreateItem($input: ItemInput!) {
    createItem(input: $input) {
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

// Update item
export const UPDATE_ITEM = gql`
  mutation UpdateItem($id: ID!, $input: ItemInput!) {
    updateItem(id: $id, input: $input) {
      id
      name
      description
      price
      image
      category
      inStock
    }
  }
`;

// Delete item
export const DELETE_ITEM = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id)
  }
`;

// Create transaction
export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: TransactionInput!) {
    createTransaction(input: $input) {
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
    }
  }
`;

// Update transaction status (admin only)
export const UPDATE_TRANSACTION_STATUS = gql`
  mutation UpdateTransactionStatus($id: ID!, $status: String!) {
    updateTransactionStatus(id: $id, status: $status) {
      id
      orderId
      status
    }
  }
`;

// Admin: Ban item
export const BAN_ITEM = gql`
  mutation BanItem($id: ID!, $bannedBy: String!) {
    banItem(id: $id, bannedBy: $bannedBy) {
      id
      name
      status
      bannedBy
    }
  }
`;

// Admin: Unban item
export const UNBAN_ITEM = gql`
  mutation UnbanItem($id: ID!) {
    unbanItem(id: $id) {
      id
      name
      status
    }
  }
`;

// Admin: Ban user
export const BAN_USER = gql`
  mutation BanUser($id: ID!, $bannedBy: String!) {
    banUser(id: $id, bannedBy: $bannedBy) {
      id
      username
      status
    }
  }
`;

// Admin: Unban user
export const UNBAN_USER = gql`
  mutation UnbanUser($id: ID!) {
    unbanUser(id: $id) {
      id
      username
      status
    }
  }
`;

// Admin: Delete user
export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;