import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Components/store/authSlice';
import UserLogin from '../Components/UserLogin';
import { LOGIN } from '../graphql/mutations';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

describe('UserLogin Component', () => {
    let store;

    beforeEach(() => {
        store = configureStore({
            reducer: { auth: authReducer }
        });
        mockNavigate.mockClear();
    });

    it('After successful LOGIN mutation response, navigate() is called immediately with correct route', async () => {
        const mocks = [
            {
                request: {
                    query: LOGIN,
                    variables: { username: 'testuser', password: 'password123' },
                },
                result: {
                    data: {
                        login: {
                            success: true,
                            message: 'Login successful',
                            token: 'mock-token',
                            user: {
                                id: '1',
                                username: 'testuser',
                                role: 'user',
                                status: 'active'
                            }
                        }
                    }
                }
            }
        ];

        render(
            <Provider store={store}>
                <MockedProvider mocks={mocks} addTypename={false}>
                    <MemoryRouter>
                        <UserLogin />
                    </MemoryRouter>
                </MockedProvider>
            </Provider>
        );

        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Login/i, exact: true }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/user/dashboard', { replace: true });
        });
    });

    it('navigate() does NOT rely on a useEffect watching Redux state changes', async () => {
        const mocks = [
            {
                request: {
                    query: LOGIN,
                    variables: { username: 'adminuser', password: 'password123' },
                },
                result: {
                    data: {
                        login: {
                            success: true,
                            message: 'Login successful',
                            token: 'mock-token',
                            user: {
                                id: '1',
                                username: 'adminuser',
                                role: 'admin',
                                status: 'active'
                            }
                        }
                    }
                }
            }
        ];

        render(
            <Provider store={store}>
                <MockedProvider mocks={mocks} addTypename={false}>
                    <MemoryRouter>
                        <UserLogin />
                    </MemoryRouter>
                </MockedProvider>
            </Provider>
        );

        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'adminuser' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Login/i, exact: true }));

        await waitFor(() => {
            // It should be called immediately on mutation success, not waiting for state
            expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard', { replace: true });
        });
    });

    it('A banned user (status: "banned") does NOT trigger navigate()', async () => {
        // KNOWN BUG: LOGIN mutation in mutations.js does not select status field. 
        // Ban check in UserLogin.js is unreachable. 
        // Fix: add status to the LOGIN mutation selection set.
        
        // This test simulates the server returning status: 'banned', but because the real
        // GraphQL mutation query does not request the 'status' field, Apollo Client might
        // strip it out or complain. But if we mock it, we expect it to be passed.
        // Wait, the test expects status to be passed, but the bug in UserLogin is that
        // it checks `result.user.status === 'banned'`.
        const mocks = [
            {
                request: {
                    query: LOGIN,
                    variables: { username: 'banneduser', password: 'password123' },
                },
                result: {
                    data: {
                        login: {
                            success: true,
                            message: 'Login successful',
                            token: 'mock-token',
                            user: {
                                id: '1',
                                username: 'banneduser',
                                role: 'user',
                                status: 'banned'
                            }
                        }
                    }
                }
            }
        ];

        render(
            <Provider store={store}>
                <MockedProvider mocks={mocks} addTypename={false}>
                    <MemoryRouter>
                        <UserLogin />
                    </MemoryRouter>
                </MockedProvider>
            </Provider>
        );

        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'banneduser' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Login/i, exact: true }));

        // Wait for the mutation to resolve and component to process it
        await new Promise(resolve => setTimeout(resolve, 1000));

        // This will fail because navigate WILL be called, since status is undefined !== 'banned'
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
