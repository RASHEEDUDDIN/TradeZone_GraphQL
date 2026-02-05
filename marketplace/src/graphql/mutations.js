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