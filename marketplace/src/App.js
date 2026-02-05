import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import AdminLogin from './Components/AdminLogin';
import UserLogin from './Components/UserLogin';
import Register from './Components/Register';
import UserDashboard from './Components/UserDashboard';
import AdminDashboard from './Components/AdminDashboard';
import Marketplace from './Components/Marketplace';
import AdminRegister from './Components/AdminRegister';
import GuestDashboard from './Components/GuestDashboard';
import CartPage from './Components/CartPage';
import CheckoutPage from './Components/CheckoutPage';
import OrderConfirmationPage from './Components/OrderConfirmationPage';
import AdminTransactions from './Components/AdminTransactions';
import UserTransactions from './Components/UserTransactions';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import { Provider } from 'react-redux';
import store from './store';

function App() {
  const dispatch = useDispatch();
  const { userName, userRole } = useSelector((state) => state.auth);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('userRole');
    if (storedUsername && storedRole) {
      dispatch({
        type: 'auth/login',
        payload: {
          username: storedUsername,
          userRole: storedRole
        }
      });
    }
    // Wait for auth state to update before setting loading to false
    const timer = setTimeout(() => {
      setIsAuthLoading(false);
    }, 1000); // 1 second delay to ensure auth state is loaded

    return () => clearTimeout(timer); // Clean up the timer
  }, [dispatch]);

  // Update localStorage when auth state changes
  useEffect(() => {
    if (userName) {
      localStorage.setItem('username', userName);
      localStorage.setItem('userRole', userRole);
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
    }
    console.log("App Re-rendered with:", { userName, userRole });
    // Force a re-render when auth state changes
    setIsAuthLoading(true);
    setTimeout(() => setIsAuthLoading(false), 100);
  }, [userName, userRole]);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/*" element={
            isAuthLoading ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
              }}>
                <h2>Loading...</h2>
              </div>
            ) : (
              <Routes>
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin-register" element={<AdminRegister />} />
                <Route path="/user-login" element={<UserLogin />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/guestdashboard" element={<GuestDashboard />} />
                
                {/* Protected routes */}
                <Route path="/admin/dashboard" element={
                  userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/guestdashboard" replace />
                } />
                <Route path="/admin/transactions" element={
                  userRole === 'admin' ? <AdminTransactions /> : <Navigate to="/guestdashboard" replace />
                } />
                <Route path="/user/dashboard" element={
                  userRole === 'user' ? <UserDashboard /> : <Navigate to="/guestdashboard" replace />
                } />
                <Route path="/cart" element={
                  userRole === 'user' ? <CartPage /> : <Navigate to="/guestdashboard" replace />
                } />
                <Route path="/checkout" element={
                  userRole === 'user' ? <CheckoutPage /> : <Navigate to="/guestdashboard" replace />
                } />
                <Route path="/order-confirmation" element={
                  userRole === 'user' ? <OrderConfirmationPage /> : <Navigate to="/guestdashboard" replace />
                } />
                <Route path="/user/transactions" element={
                  userRole === 'user' ? <UserTransactions /> : <Navigate to="/guestdashboard" replace />
                } />

                {/* Catch-all route */}
                <Route path="*" element={
                  userRole === 'admin' ? (
                    <Navigate to="/admin/dashboard" replace />
                  ) : userRole === 'user' ? (
                    <Navigate to="/user/dashboard" replace />
                  ) : (
                    <Navigate to="/guestdashboard" replace />
                  )
                } />
              </Routes>
            )
          } />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
