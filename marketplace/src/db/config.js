const dbPromise = new Promise((resolve, reject) => {
  const request = indexedDB.open('marketplaceDB', 1);
  
  request.onerror = (event) => {
    reject('Database error: ' + event.target.errorCode);
  };

  request.onsuccess = (event) => {
    resolve(event.target.result);
  };

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    
    // Create users store
    if (!db.objectStoreNames.contains('users')) {
      const usersStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
      usersStore.createIndex('username', 'username', { unique: true });
    }

    // Create items store
    if (!db.objectStoreNames.contains('items')) {
      const itemsStore = db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
      itemsStore.createIndex('sellerId', 'sellerId');
    }

    // Create transactions store
    if (!db.objectStoreNames.contains('transactions')) {
      const transactionsStore = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
      transactionsStore.createIndex('userId', 'userId');
    }

    // Create admins store
    if (!db.objectStoreNames.contains('admins')) {
      const adminsStore = db.createObjectStore('admins', { keyPath: 'id', autoIncrement: true });
      adminsStore.createIndex('username', 'username', { unique: true });
    }
  };
});

export default dbPromise;
