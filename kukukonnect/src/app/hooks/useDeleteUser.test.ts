import { renderHook, act } from '@testing-library/react';
import useDeleteUser from './useDeleteUser'; 
import * as fetchDeleteAccount from '../utils/fetchDeleteAccount'; 


jest.mock('../utils/fetchDeleteAccount');

describe('useDeleteUser', () => {
  const mockDeleteUser = fetchDeleteAccount.deleteUser as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with correct default state', () => {
    const { result } = renderHook(() => useDeleteUser());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.success).toBe(false);
  });

  test('should handle successful user deletion', async () => {
    mockDeleteUser.mockResolvedValueOnce({ message: 'User deleted successfully' });

    const { result } = renderHook(() => useDeleteUser());

    await act(async () => {
      await result.current.remove(1);
    });

    expect(mockDeleteUser).toHaveBeenCalledWith(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.success).toBe(true);
  });

  test('should handle deletion error', async () => {
    const errorMessage = 'Failed to delete user: Not Found';
    mockDeleteUser.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useDeleteUser());

    await act(async () => {
      await result.current.remove(1);
    });

    expect(mockDeleteUser).toHaveBeenCalledWith(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.success).toBe(false);
  });

  test('should set loading state during deletion', async () => {
    let resolvePromise: (value: unknown) => void;
    mockDeleteUser.mockImplementation(() => new Promise((resolve) => {
      resolvePromise = resolve;
    }));

    const { result } = renderHook(() => useDeleteUser());

    let removePromise: Promise<void>;
    await act(async () => {
      removePromise = result.current.remove(1);
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.success).toBe(false);

    await act(async () => {
      resolvePromise!({ message: 'User deleted successfully' });
      await removePromise;
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(true);
  });
});