import store from './store';

test('Redux store initialises with correct auth state', () => {
  const state = store.getState();
  expect(state).toHaveProperty('auth');
  expect(state.auth).toHaveProperty('userName');
  expect(state.auth).toHaveProperty('userRole');
});
