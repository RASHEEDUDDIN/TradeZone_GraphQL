import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from '../Components/AdminDashboard';
import { GET_ALL_ITEMS, GET_USERS, GET_TRANSACTIONS } from '../graphql/queries';

describe('AdminDashboard Component', () => {
    beforeEach(() => {
        // Mock localStorage
        Storage.prototype.getItem = jest.fn((key) => {
            if (key === 'userRole') return 'admin';
            if (key === 'username') return 'admin_user';
            return null;
        });
    });

    const createMocks = (users) => [
        {
            request: { query: GET_USERS },
            result: { data: { users } }
        },
        {
            request: { query: GET_ALL_ITEMS },
            result: { data: { allItems: [] } }
        },
        {
            request: { query: GET_TRANSACTIONS },
            result: { data: { transactions: [] } }
        }
    ];

    it('When GET_USERS returns user with status: "active", Ban button renders', async () => {
        const mocks = createMocks([{
            id: '1',
            username: 'active_user',
            email: 'test@test.com',
            role: 'user',
            status: 'active',
            contactDetails: '123',
            bannedBy: null,
            createdAt: '2023-01-01'
        }]);

        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <MemoryRouter>
                    <AdminDashboard />
                </MemoryRouter>
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('active_user')).toBeInTheDocument();
        });

        const banButton = screen.getByRole('button', { name: 'Ban' });
        expect(banButton).toBeInTheDocument();
    });

    it('When GET_USERS returns user with status: "banned", Unban button renders', async () => {
        const mocks = createMocks([{
            id: '2',
            username: 'banned_user',
            email: 'test@test.com',
            role: 'user',
            status: 'banned',
            contactDetails: '123',
            bannedBy: 'admin_user',
            createdAt: '2023-01-01'
        }]);

        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <MemoryRouter>
                    <AdminDashboard />
                </MemoryRouter>
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('banned_user')).toBeInTheDocument();
        });

        const unbanButton = screen.getByRole('button', { name: 'Unban' });
        expect(unbanButton).toBeInTheDocument();
    });

    it('status field is never undefined in rendered output', async () => {
        const mocks = createMocks([{
            id: '3',
            username: 'some_user',
            email: 'test@test.com',
            role: 'user',
            status: 'active',
            contactDetails: '123',
            bannedBy: null,
            createdAt: '2023-01-01'
        }]);

        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <MemoryRouter>
                    <AdminDashboard />
                </MemoryRouter>
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('some_user')).toBeInTheDocument();
        });

        // Ensure "undefined" does not appear as a status
        const undefinedElements = screen.queryAllByText(/undefined/i);
        expect(undefinedElements.length).toBe(0);
    });

    it('bannedBy field is accessible and not undefined after ban mutation', async () => {
        const mocks = createMocks([{
            id: '4',
            username: 'banned_user_2',
            email: 'test@test.com',
            role: 'user',
            status: 'banned',
            contactDetails: '123',
            bannedBy: 'admin_user',
            createdAt: '2023-01-01'
        }]);

        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <MemoryRouter>
                    <AdminDashboard />
                </MemoryRouter>
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('banned_user_2')).toBeInTheDocument();
        });

        expect(screen.getByText('Banned by: admin_user')).toBeInTheDocument();
    });
});
