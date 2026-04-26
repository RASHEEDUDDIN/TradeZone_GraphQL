import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Components/store/authSlice';
import CartPage from '../Components/CartPage';

describe('CartPage Component', () => {
    it('Cart item with { name, price } format renders price correctly', () => {
        const store = configureStore({
            reducer: { auth: authReducer },
            preloadedState: {
                auth: {
                    cart: [
                        { id: '1', name: 'Item 1', price: 10.50 }
                    ]
                }
            }
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Price: $10.50')).toBeInTheDocument();
        expect(screen.getByText('Total: $10.50')).toBeInTheDocument();
        
        const undefinedElements = screen.queryAllByText(/undefined/i);
        expect(undefinedElements.length).toBe(0);
    });

    it('Cart item with { itemName, itemPrice } format renders price correctly', () => {
        const store = configureStore({
            reducer: { auth: authReducer },
            preloadedState: {
                auth: {
                    cart: [
                        { id: '2', itemName: 'Item 2', itemPrice: 20.75 }
                    ]
                }
            }
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(screen.getByText('Price: $20.75')).toBeInTheDocument();
        expect(screen.getByText('Total: $20.75')).toBeInTheDocument();

        const undefinedElements = screen.queryAllByText(/undefined/i);
        expect(undefinedElements.length).toBe(0);
    });

    it('Total amount calculates correctly for both formats combined', () => {
        const store = configureStore({
            reducer: { auth: authReducer },
            preloadedState: {
                auth: {
                    cart: [
                        { id: '1', name: 'Item 1', price: 10.00 },
                        { id: '2', itemName: 'Item 2', itemPrice: 20.00 }
                    ]
                }
            }
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CartPage />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText('Price: $10.00')).toBeInTheDocument();
        expect(screen.getByText('Price: $20.00')).toBeInTheDocument();
        expect(screen.getByText('Total: $30.00')).toBeInTheDocument();

        const undefinedElements = screen.queryAllByText(/undefined/i);
        expect(undefinedElements.length).toBe(0);
    });
});
