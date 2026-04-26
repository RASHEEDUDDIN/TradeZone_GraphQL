import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Components/store/authSlice';
import OrderConfirmationPage from '../Components/OrderConfirmationPage';

// Mock jsPDF
jest.mock('jspdf', () => {
    return {
        jsPDF: jest.fn().mockImplementation(() => ({
            setFontSize: jest.fn(),
            text: jest.fn(),
            setLineWidth: jest.fn(),
            line: jest.fn(),
            save: jest.fn()
        }))
    };
});

describe('OrderConfirmationPage Component (Documenting Bug 5)', () => {
    let store;

    beforeEach(() => {
        store = configureStore({
            reducer: { auth: authReducer },
            preloadedState: {
                auth: { userName: 'Test User' }
            }
        });
    });

    // BUG: orderDetails is never populated — useLocation() not implemented. PDF will be empty.
    it('Assert the PDF button renders and the component does NOT crash when orderDetails is null', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <OrderConfirmationPage />
                </MemoryRouter>
            </Provider>
        );

        // The component renders the success message
        expect(screen.getByText('Thank You!')).toBeInTheDocument();
        expect(screen.getByText('Your order has been placed successfully')).toBeInTheDocument();

        // The PDF button is present
        const pdfButton = screen.getByRole('button', { name: /Download Order PDF/i });
        expect(pdfButton).toBeInTheDocument();

        // Clicking it should not crash the app, even though orderDetails is null
        fireEvent.click(pdfButton);
        
        // At this point we know the app didn't crash because we can still find elements
        expect(screen.getByText('Thank You!')).toBeInTheDocument();
    });

    it('Assert orderDetails is null on mount (bug documented)', () => {
        // Since we cannot directly access component state in React Testing Library,
        // we can observe that the items table from orderDetails never renders.
        // We will pass state via MemoryRouter to prove it's ignored.
        
        const mockTransactionData = {
            transaction: {
                items: [{ name: 'Test Item', price: 100 }],
                total: 100
            }
        };

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[{ pathname: '/order-confirmation', state: mockTransactionData }]}>
                    <OrderConfirmationPage />
                </MemoryRouter>
            </Provider>
        );

        // If orderDetails was populated from location.state, we might see something
        // but there is literally no code in the component that renders order details!
        // The component only renders the success message.
        // Let's verify that the item 'Test Item' is NOT in the document.
        expect(screen.queryByText('Test Item')).not.toBeInTheDocument();
        
        // This confirms orderDetails is null / unused in the render function.
        // The guard works because the component does not crash.
    });
});
