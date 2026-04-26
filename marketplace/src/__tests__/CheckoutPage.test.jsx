import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Components/store/authSlice';
import CheckoutPage from '../Components/CheckoutPage';
import { CREATE_TRANSACTION } from '../graphql/mutations';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

describe('CheckoutPage Component', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        window.alert = jest.fn();
    });

    const createStore = (cart) => configureStore({
        reducer: { auth: authReducer },
        preloadedState: { auth: { cart } }
    });

    const fillFormAndSubmit = () => {
        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/Delivery Address/i), { target: { value: '123 Test St' } });
        fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
        fireEvent.click(screen.getByLabelText(/Credit Card/i));
        
        fireEvent.click(screen.getByRole('button', { name: /Place Order/i }));
    };

    it('Items using { name, price } pass to mutation with no undefined values', async () => {
        const store = createStore([{ id: '1', name: 'Standard Item', price: 10 }]);

        let mutationCalled = false;
        let mutationVariables = null;

        const mocks = [{
            request: {
                query: CREATE_TRANSACTION,
                variables: {
                    input: {
                        items: [{ itemId: '1', name: 'Standard Item', price: 10, quantity: 1 }],
                        totalAmount: 10
                    }
                }
            },
            result: () => {
                mutationCalled = true;
                mutationVariables = {
                    input: {
                        items: [{ itemId: '1', name: 'Standard Item', price: 10, quantity: 1 }],
                        totalAmount: 10
                    }
                };
                return {
                    data: {
                        createTransaction: {
                            id: 'tx1',
                            orderId: 'ORD-123',
                            userId: 'u1',
                            items: [{ itemId: '1', name: 'Standard Item', price: 10, quantity: 1 }],
                            totalAmount: 10,
                            status: 'completed',
                            createdAt: '123456789'
                        }
                    }
                };
            }
        }];

        render(
            <Provider store={store}>
                <MockedProvider mocks={mocks} addTypename={false}>
                    <MemoryRouter>
                        <CheckoutPage />
                    </MemoryRouter>
                </MockedProvider>
            </Provider>
        );

        fillFormAndSubmit();

        await waitFor(() => {
            expect(mutationCalled).toBe(true);
        });

        expect(mutationVariables.input.items[0].name).not.toBeUndefined();
        expect(mutationVariables.input.items[0].price).not.toBeUndefined();
        expect(mutationVariables.input.totalAmount).not.toBeNaN();
        expect(mutationVariables.input.totalAmount).toBe(10);
    });

    it('Items using { itemName, itemPrice } pass to mutation with no undefined values', async () => {
        const store = createStore([{ _id: '2', itemName: 'Alternative Item', itemPrice: 20 }]);

        let mutationCalled = false;
        let mutationVariables = null;

        const mocks = [{
            request: {
                query: CREATE_TRANSACTION,
                variables: {
                    input: {
                        items: [{ itemId: '2', name: 'Alternative Item', price: 20, quantity: 1 }],
                        totalAmount: 20
                    }
                }
            },
            result: () => {
                mutationCalled = true;
                mutationVariables = {
                    input: {
                        items: [{ itemId: '2', name: 'Alternative Item', price: 20, quantity: 1 }],
                        totalAmount: 20
                    }
                };
                return {
                    data: {
                        createTransaction: {
                            id: 'tx2',
                            orderId: 'ORD-124',
                            userId: 'u1',
                            items: [{ itemId: '2', name: 'Alternative Item', price: 20, quantity: 1 }],
                            totalAmount: 20,
                            status: 'completed',
                            createdAt: '123456789'
                        }
                    }
                };
            }
        }];

        render(
            <Provider store={store}>
                <MockedProvider mocks={mocks} addTypename={false}>
                    <MemoryRouter>
                        <CheckoutPage />
                    </MemoryRouter>
                </MockedProvider>
            </Provider>
        );

        fillFormAndSubmit();

        await waitFor(() => {
            expect(mutationCalled).toBe(true);
        });

        expect(mutationVariables.input.items[0].name).toBe('Alternative Item');
        expect(mutationVariables.input.items[0].price).toBe(20);
        expect(mutationVariables.input.totalAmount).not.toBeNaN();
        expect(mutationVariables.input.totalAmount).not.toBe(0);
    });

    it('Mutation is never called with totalAmount of NaN or 0 when items exist', async () => {
        const store = createStore([
            { id: '1', name: 'Item 1', price: 10 },
            { _id: '2', itemName: 'Item 2', itemPrice: 20 }
        ]);

        let mutationCalled = false;

        const mocks = [{
            request: {
                query: CREATE_TRANSACTION,
                variables: {
                    input: {
                        items: [
                            { itemId: '1', name: 'Item 1', price: 10, quantity: 1 },
                            { itemId: '2', name: 'Item 2', price: 20, quantity: 1 }
                        ],
                        totalAmount: 30
                    }
                }
            },
            result: () => {
                mutationCalled = true;
                return {
                    data: {
                        createTransaction: {
                            id: 'tx3',
                            orderId: 'ORD-125',
                            userId: 'u1',
                            items: [],
                            totalAmount: 30,
                            status: 'completed',
                            createdAt: '123456789'
                        }
                    }
                };
            }
        }];

        render(
            <Provider store={store}>
                <MockedProvider mocks={mocks} addTypename={false}>
                    <MemoryRouter>
                        <CheckoutPage />
                    </MemoryRouter>
                </MockedProvider>
            </Provider>
        );

        // Verify UI shows correct total
        expect(screen.getByText(/Total Amount: \$30.00/)).toBeInTheDocument();

        fillFormAndSubmit();

        await waitFor(() => {
            expect(mutationCalled).toBe(true);
        });
    });
});
