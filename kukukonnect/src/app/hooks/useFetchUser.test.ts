import { renderHook, waitFor } from '@testing-library/react';
import useFetchUser from './useFetchUser';
import { fetchUser } from '../utils/fetchUser';
import { UserType } from '../utils/types/user';

jest.mock('../utils/fetchUser');

const mockUser: UserType = {
  id: 1,
  username: 'linn_amondi',
  first_name: 'Linn',
  last_name: 'Amondi',
  phone_number: '+1234567890',
  email: 'linn.amondi@example.com',
  user_type: 'customer',
  image: 'https://example.com/avatar.jpg  ',
  device_id: 'device-123',
};

describe('useFetchUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch user data successfully', async () => {
    (fetchUser as jest.Mock).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useFetchUser(1));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
    expect(fetchUser).toHaveBeenCalledWith(1);
  });

  it('should handle fetch error', async () => {
    const errorMessage = 'Network error';
    (fetchUser as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFetchUser(2));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe(errorMessage);
    expect(fetchUser).toHaveBeenCalledWith(2);
  });

  it('should refetch when userId changes', async () => {
    const mockUser1: UserType = {
      ...mockUser,
      id: 1,
      first_name: 'Mercy',
      last_name: '',
      username: 'mercy',
      email: 'mercy@example.com',
    };
    const mockUser2: UserType = {
      ...mockUser,
      id: 2,
      first_name: 'Emebet',
      last_name: 'Keza',
      username: 'emebet_keza',
      email: 'emebet.keza@example.com',
    };

    (fetchUser as jest.Mock)
      .mockResolvedValueOnce(mockUser1)
      .mockResolvedValueOnce(mockUser2);

    const { result, rerender } = renderHook(
      ({ userId }: { userId: number }) => useFetchUser(userId),
      { initialProps: { userId: 1 } }
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toEqual(mockUser1);

    rerender({ userId: 2 });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toEqual(mockUser2);
    expect(fetchUser).toHaveBeenCalledTimes(2);
  });

  it('should not fetch if userId is the same', async () => {
    (fetchUser as jest.Mock).mockResolvedValue(mockUser);

    const { result, rerender } = renderHook(
      ({ userId }: { userId: number }) => useFetchUser(userId),
      { initialProps: { userId: 1 } }
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    rerender({ userId: 1 });

    expect(fetchUser).toHaveBeenCalledTimes(1);
  });

  it('should handle cleanup properly', async () => {
    let resolve: (value: UserType) => void;
    const promise = new Promise<UserType>((res) => {
      resolve = res;
    });
    (fetchUser as jest.Mock).mockReturnValue(promise);

    const { unmount } = renderHook(() => useFetchUser(1));

    unmount();
    resolve!(mockUser);
  });
});