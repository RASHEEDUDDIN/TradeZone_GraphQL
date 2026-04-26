# 🛍️ TradeZone Marketplace

A full-stack e-commerce marketplace application built with **React**, **GraphQL**, **Node.js**, **MongoDB**, **PostgreSQL**, and **Redis**. It features a robust polyglot persistence architecture, caching, and comprehensive administration tools. Users can buy and sell items, while administrators can manage users, items, and transactions.

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)](https://graphql.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)](https://mui.com/)

---

## ✨ Features

### 👤 User Features
- 🔐 User registration and authentication (JWT-based)
- 🛒 Browse marketplace items
- 🛍️ Add items to cart and checkout
- 📦 Create and manage personal item listings
- 📜 View transaction history
- 📄 Download order receipts as PDF

### 👨‍💼 Admin Features
- 🔧 Admin dashboard with comprehensive management tools
- 👥 View and manage all users
- 🚫 Ban/unban users (prevents login)
- 📦 View and manage all items
- ⛔ Ban/unban items (hides from marketplace)
- 🗑️ Delete users and items
- 💼 View all transactions across the platform
- ➕ Create new admin accounts

### 🎯 Additional Features
- ⚡ **Redis Caching** for high-performance item retrieval
- 🗄️ **Polyglot Persistence**: MongoDB as primary DB, PostgreSQL (Supabase) for transaction dual-writes
- 🧪 **Jest Regression Tests** and benchmark scripts included
- 🎨 Modern, responsive UI with Material-UI
- 🔄 Real-time data updates with Apollo Client
- 🔒 Secure authentication with JWT tokens
- 📊 Transaction management system
- 🖼️ Item image support
- 🔍 Category-based item organization
- 💳 Multiple payment method options

---

## 🛠️ Technologies Used

### Frontend
- **React** - UI library
- **Apollo Client** - GraphQL client
- **Redux Toolkit** - State management
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **jsPDF** - PDF generation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Apollo Server** - GraphQL server
- **MongoDB** - Primary database
- **Mongoose** - ODM for MongoDB
- **PostgreSQL (Supabase)** - Relational database for transaction dual-writes
- **Sequelize** - ORM for PostgreSQL
- **Redis** - In-memory caching
- **Jest** - Testing framework
- **JWT** - Authentication
- **bcryptjs** - Password hashing

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas account)
- **Redis** (optional, but recommended for caching)
- **PostgreSQL** (optional, via local or Supabase, for transaction dual-writes)

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/tradezone-marketplace.git
cd tradezone-marketplace
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Variables
Create a `.env` file in the `tradezone-graphql-backend` folder:
```env
MONGODB_URI=mongodb://localhost:27017/tradezone
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tradezone

# Optional: Supabase PostgreSQL for dual-writes
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres

# Optional: Redis URL for caching
REDIS_URL=redis://localhost:6379

JWT_SECRET=your_super_secret_jwt_key_here_change_this
PORT=4000
```

#### Start Backend Server
```bash
npm run dev
```
Backend will run on `http://localhost:4000/graphql`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../marketplace
npm install
```

#### Start Frontend
```bash
npm start
```
Frontend will run on `http://localhost:3000`

---

## 📁 Project Structure

```
tradezone-marketplace/
│
├── tradezone-graphql-backend/  # Backend (GraphQL API)
│   ├── config/                 # DB & Redis configs
│   ├── models/                 # Mongoose & Sequelize models
│   │   ├── User.js
│   │   ├── Item.js
│   │   ├── Transaction.js
│   │   └── TransactionPG.js
│   ├── schema/                 # GraphQL schema
│   │   └── typeDefs.js
│   ├── resolvers/              # GraphQL resolvers
│   │   └── index.js
│   ├── scripts/                # Benchmark queries
│   ├── __tests__/              # Jest regression tests
│   ├── index.js                # Server entry point
│   ├── package.json
│   └── .env
│
└── marketplace/                # Frontend (React)
    ├── public/
    ├── src/
    │   ├── Components/         # React components
    │   │   ├── AdminDashboard.js
    │   │   ├── UserDashboard.js
    │   │   ├── Marketplace.js
    │   │   ├── CartPage.js
    │   │   ├── CheckoutPage.js
    │   │   ├── UserTransactions.js
    │   │   └── ...
    │   ├── graphql/            # GraphQL queries & mutations
    │   │   ├── queries.js
    │   │   ├── mutations.js
    │   │   └── client.js
    │   ├── store/              # Redux store
    │   │   └── authSlice.js
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── README.md
```

---

## 🔑 Default Admin Account

To create an admin account, use the registration with role set to `'admin'` in the backend, or use the admin registration feature in the app.

**First Admin Setup:**
1. Register a normal user
2. Manually update their role in MongoDB:
```javascript
db.users.updateOne(
  { username: "your_username" },
  { $set: { role: "admin" } }
)
```

Then login and use "Create New Admin" feature to create additional admins.

---

## 📊 GraphQL Schema Overview

### Queries
```graphql
# User queries
me: User
users: [User!]!
userById(id: ID!): User

# Item queries
items: [Item!]!              # Active items only
allItems: [Item!]!           # All items (admin)
myItems: [Item!]!
itemById(id: ID!): Item

# Transaction queries
transactions: [Transaction!]!
myTransactions: [Transaction!]!
```

### Mutations
```graphql
# Authentication
register(input: RegisterInput!): AuthPayload!
login(username: String!, password: String!): AuthPayload!

# Item management
createItem(input: ItemInput!): Item!
updateItem(id: ID!, input: ItemInput!): Item!
deleteItem(id: ID!): Boolean!

# Transaction
createTransaction(input: TransactionInput!): Transaction!

# Admin operations
banUser(id: ID!, bannedBy: String!): User!
unbanUser(id: ID!): User!
banItem(id: ID!, bannedBy: String!): Item!
unbanItem(id: ID!): Item!
deleteUser(id: ID!): Boolean!
```

---

## 🎯 Usage

### For Users

1. **Register/Login**
   - Navigate to `/user-login`
   - Register a new account or login

2. **Browse Marketplace**
   - View available items
   - Add items to cart

3. **Checkout**
   - Fill delivery information
   - Select payment method
   - Complete order

4. **Manage Listings**
   - Create new item listings
   - View your items in dashboard
   - Update or delete items

### For Admins

1. **Access Admin Dashboard**
   - Login with admin credentials
   - Access `/admin/dashboard`

2. **Manage Users**
   - View all registered users
   - Ban/unban users
   - Delete user accounts

3. **Manage Items**
   - View all marketplace items
   - Ban inappropriate items
   - Delete items

4. **Monitor Transactions**
   - View all platform transactions
   - Track order details

---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected routes (frontend & backend)
- ✅ Role-based access control (User/Admin)
- ✅ GraphQL context-based authorization
- ✅ Input validation

---

## 🚧 Future Enhancements

- [ ] Product reviews and ratings
- [ ] Advanced search and filtering
- [ ] Email notifications for orders
- [ ] Order tracking system
- [ ] Image upload with cloud storage (Cloudinary/AWS S3)
- [ ] Seller analytics dashboard
- [ ] Wishlist functionality

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Rasheeduddin Mohammed**
- Full Stack Developer
- 📧 Email: mohammedrasheed3108@gmail.com
- 💼 LinkedIn: [Mohammed Rasheeduddin](https://www.linkedin.com/in/rasheeduddinmohammed/)
---

## 🙏 Acknowledgments

- Material-UI for the beautiful component library
- Apollo GraphQL for excellent documentation
- MongoDB for the flexible database solution
- React community for continuous support

---

## 📸 Screenshots

### User Dashboard
![User Dashboard](screenshots/user-dashboard.png)

### Marketplace
![Marketplace](screenshots/marketplace.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)

### Checkout Process
![Checkout](screenshots/checkout.png)

---

## 🐛 Bug Reports

If you discover any bugs, please create an issue on GitHub with:
- Bug description
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ using React, GraphQL, and MongoDB**