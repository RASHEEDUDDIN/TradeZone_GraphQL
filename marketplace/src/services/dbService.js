import dbPromise from '../db/config';

const executeDBOperation = async (operation, data) => {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(operation.store, operation.mode);
    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve(operation.result);

    const store = transaction.objectStore(operation.store);
    let request;
    
    if (operation.type === 'getAll') {
      request = store.getAll();
    } else if (operation.type === 'get') {
      request = store.get(operation.id);
    } else if (operation.type === 'put') {
      request = store.put(operation.data);
    } else if (operation.type === 'add') {
      request = store.add(data);
    } else if (operation.type === 'delete') {
      request = store.delete(operation.id);
    } else if (operation.type === 'clear') {
      request = store.clear();
    }

    if (request) {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    } else {
      reject(new Error('Invalid operation type'));
    }
  });
};



export const itemService = {
  getAll: async () => {
    try {
      const db = await dbPromise;
      const transaction = db.transaction('items', 'readonly');
      const store = transaction.objectStore('items');
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          // Ensure we have an array of items
          const items = Array.isArray(request.result) ? request.result : [];
          resolve(items);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error fetching items:', error);
      return [];
    }
  },

  create: async (item) => {
    return executeDBOperation({
      store: 'items',
      mode: 'readwrite',
      type: 'put',
      data: item
    });
  },

  update: async (itemId, updates) => {
    const db = await dbPromise;
    const transaction = db.transaction('items', 'readwrite');
    const store = transaction.objectStore('items');
    
    return new Promise((resolve, reject) => {
      // First get the item
      const getItemRequest = store.get(itemId);
      
      getItemRequest.onsuccess = () => {
        const item = getItemRequest.result;
        if (!item) {
          reject(new Error('Item not found'));
          return;
        }

        // Update the item with new values
        Object.assign(item, updates);
        
        // Put the updated item back
        const updateRequest = store.put(item);
        
        updateRequest.onsuccess = () => {
          resolve(item);
        };
        
        updateRequest.onerror = () => {
          reject(updateRequest.error);
        };
      };

      getItemRequest.onerror = () => {
        reject(getItemRequest.error);
      };
    });
  },

  delete: async (itemId) => {
    return executeDBOperation({
      store: 'items',
      mode: 'readwrite',
      type: 'delete',
      id: itemId
    });
  },

  getById: async (itemId) => {
    return executeDBOperation({
      store: 'items',
      mode: 'readonly',
      type: 'get',
      id: itemId
    });
  }
};

export const transactionService = {
  getAll: async () => {
    const db = await dbPromise;
    const transaction = db.transaction('transactions', 'readonly');
    const store = transaction.objectStore('transactions');
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Transaction getAll success:', request.result);
        resolve(request.result);
      };
      request.onerror = () => {
        console.error('Transaction getAll error:', request.error);
        reject(request.error);
      };
    });
  },
  clearDatabase: async () => {
    const db = await dbPromise;
    
    const stores = ['users', 'items', 'transactions', 'admins'];
    const clearPromises = stores.map(storeName => {
      return executeDBOperation({
        store: storeName,
        mode: 'readwrite',
        type: 'clear'
      });
    });

    return Promise.all(clearPromises)
        .then(() => {
          console.log('Database cleared successfully');
        })
        .catch(error => {
          console.error('Error clearing database:', error);
          throw error;
        });
  },
  create: async (transactionData) => {
    const db = await dbPromise;
    const transaction = db.transaction('transactions', 'readwrite');
    const store = transaction.objectStore('transactions');
    const request = store.add(transactionData);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Transaction create success:', request.result);
        resolve(request.result);
      };
      request.onerror = () => {
        console.error('Transaction create error:', request.error);
        reject(request.error);
      };
    });
  },
  getUserTransactions: async (userId) => {
    const db = await dbPromise;
    const transaction = db.transaction('transactions', 'readonly');
    const store = transaction.objectStore('transactions');
    const index = store.index('userId');
    const request = index.getAll(userId);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Transaction getUserTransactions success:', request.result);
        resolve(request.result);
      };
      request.onerror = () => {
        console.error('Transaction getUserTransactions error:', request.error);
        reject(request.error);
      };
    });
  }
};

export const userService = {
  login: async (username, password) => {
    const db = await dbPromise;
    const transaction = db.transaction('users', 'readonly');
    const store = transaction.objectStore('users');
    const index = store.index('username');
    const request = index.get(username);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const user = request.result;
        if (user && user.password === password) {
          resolve(user);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  },
  
  checkUsername: async (username) => {
    const db = await dbPromise;
    const transaction = db.transaction('users', 'readonly');
    const store = transaction.objectStore('users');
    const index = store.index('username');
    const request = index.get(username);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(!!request.result);
      };
      request.onerror = () => reject(request.error);
    });
  },
  register: async (userData) => {
    const db = await dbPromise;
    const transaction = db.transaction('users', 'readwrite');
    const store = transaction.objectStore('users');
    const request = store.add({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      contactDetails: userData.contactDetails,
      role: userData.role,
      listedItems: userData.listedItems || [],
      status: userData.status || 'active'
    });

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
    });
  },
  updateStatus: async (userId, status, bannedBy) => {
    const db = await dbPromise;
    const transaction = db.transaction('users', 'readwrite');
    const store = transaction.objectStore('users');
    const request = store.get(userId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const user = request.result;
        if (user) {
          user.status = status;
          user.bannedBy = bannedBy;
          const updateRequest = store.put(user);
          updateRequest.onsuccess = () => resolve(updateRequest.result);
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('User not found'));
        }
      };
      request.onerror = () => reject(request.error);
    });
  },
  getAll: async () => {
    const db = await dbPromise;
    const transaction = db.transaction('users', 'readonly');
    const store = transaction.objectStore('users');
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
    });
  },
  delete: async (userId) => {
    const db = await dbPromise;
    const transaction = db.transaction(['users', 'items'], 'readwrite');
    const usersStore = transaction.objectStore('users');
    const itemsStore = transaction.objectStore('items');

    // First get the user to get their username
    const userRequest = usersStore.get(userId);
    
    return new Promise((resolve, reject) => {
      userRequest.onsuccess = () => {
        const user = userRequest.result;
        if (!user) {
          reject(new Error('User not found'));
          return;
        }

        // Get items using the sellerId index
        const itemsRequest = itemsStore.index('sellerId').getAll(userId);
        itemsRequest.onsuccess = () => {
          const itemsToDelete = itemsRequest.result;

          // Delete each item
          const deletePromises = itemsToDelete.map(item => {
            return executeDBOperation({
              store: 'items',
              mode: 'readwrite',
              type: 'delete',
              id: item.id
            });
          });

          // Delete the user after deleting items
          deletePromises.push(executeDBOperation({
            store: 'users',
            mode: 'readwrite',
            type: 'delete',
            id: userId
          }));

          // Wait for all deletions to complete
          Promise.all(deletePromises)
            .then(() => {
              console.log(`Successfully deleted user ${user.username} and ${itemsToDelete.length} items`);
              resolve(userId);
            })
            .catch(error => {
              console.error('Error during deletion:', error);
              reject(error);
            });
        };

        itemsRequest.onerror = () => reject(itemsRequest.error);
      };

      userRequest.onerror = () => reject(userRequest.error);
    });
  }
};

export const adminService = {
  login: async (username, password) => {
    const db = await dbPromise;
    const transaction = db.transaction('admins', 'readonly');
    const store = transaction.objectStore('admins');
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const admins = request.result;
        const admin = admins.find(a => a.username === username);
        if (admin && admin.password === password) {
          resolve(admin);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  },
  register: async (adminData) => {
    const db = await dbPromise;
    const transaction = db.transaction('admins', 'readwrite');
    const store = transaction.objectStore('admins');
    const index = store.index('username');
    const request = index.get(adminData.username);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        if (request.result) {
          reject(new Error('Username already exists'));
        } else {
          const addRequest = store.add(adminData);
          addRequest.onsuccess = () => {
            resolve(addRequest.result);
          };
          addRequest.onerror = () => {
            reject(addRequest.error);
          };
        }
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }
};
