import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// GraphQL server URL
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

// Error handling link - logs errors to console
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }
  if (networkError) {
    console.error(`[Network error]:`, networkError);
  }
});

// Add auth token to every request
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Create Apollo Client with proper link chain
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]), // ✅ Use 'from' to properly chain links
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Force users query to always use fresh data
          users: {
            merge(existing, incoming) {
              return incoming;
            }
          },
          // Force items query to always use fresh data
          allItems: {
            merge(existing, incoming) {
              return incoming;
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
    mutate: {
      fetchPolicy: 'network-only',
    }
  },
});

export default client;