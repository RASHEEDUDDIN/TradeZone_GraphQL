import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/client';

const root = ReactDOM.createRoot(document.getElementById('root'));

// ✅ Clear Apollo cache before rendering to fix status field issue
client.resetStore().then(() => {
  console.log('✅ Apollo cache reset successfully');
  
  root.render(
    <ApolloProvider client={client}>
      <Provider store={store}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </Provider>
    </ApolloProvider>
  );
}).catch(err => {
  console.error('❌ Error resetting cache:', err);
  
  // Render anyway even if cache reset fails
  root.render(
    <ApolloProvider client={client}>
      <Provider store={store}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </Provider>
    </ApolloProvider>
  );
});

reportWebVitals();