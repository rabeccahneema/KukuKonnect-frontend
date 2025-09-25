import { renderHook, waitFor } from '@testing-library/react';
import useFetchUser from './useFetchUser';

global.fetch = jest.fn();

const user1 = {
  id: 1,
  first_name: 'Mercy',
  last_name: '',
  email: 'mercy@example.com',
  username: 'mercy',
  phone_number: '+1234567890',
  user_type: 'customer',
  device_id: 'device-123',
  image: 'https://example.com/avatar.jpg',
};

const user2 = {
  id: 2,
  first_name: 'Emebet',
  last_name: 'Keza',
  email: 'emebet@example.com',
  username: 'emebet_keza',
  phone_number: '+1234567890',
  user_type: 'customer',
  device_id: 'device-123',
  image: 'https://example.com/avatar.jpg',
};

describe('useFetchUser', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === '/api/users/1') {
        return Promise.resolve({ ok: true, json: async () => user1 });
      }
      if (url === '/api/users/2') {
        return Promise.resolve({ ok: true, json: async () => user2 });
      }
      throw new Error(`Unexpected URL: ${url}`);
    });
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should refetch when userId changes', async () => {
    const { result, rerender } = renderHook(
      ({ userId }) => useFetchUser(userId),
      { initialProps: { userId: 1 } }
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toEqual(user1);

    rerender({ userId: 2 });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toEqual(user2); 
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});