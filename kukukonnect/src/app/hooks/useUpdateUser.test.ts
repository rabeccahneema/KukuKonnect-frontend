import { renderHook, act } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import useUpdateUser from './useUpdateUser';
import * as fetchUpdateProfileModule from '../utils/fetchUpdateProfile';
import { UserType } from '../utils/types/user';


jest.mock('../utils/fetchUpdateProfile');

describe('useUpdateUser', () => {
  const mockUpdateUser = fetchUpdateProfileModule.updateUser as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with correct default state', () => {
    const { result } = renderHook(() => useUpdateUser());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.success).toBe(false);
  });

  test('should handle successful user update', async () => {
    mockUpdateUser.mockResolvedValue(undefined);

    const { result } = renderHook(() => useUpdateUser());
    const userId = 1;
    const userData: Partial<UserType> = { email: 'carine@example.com' };
    const file = new File([''], 'avatar.png', { type: 'image/png' });

    await act(async () => {
      await result.current.update(userId, userData, file);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.success).toBe(true);
    }, { timeout: 3000 });

    expect(mockUpdateUser).toHaveBeenCalledWith(userId, userData, file);
  });

  test('should handle update error', async () => {
    const errorMessage = 'Failed to update user';
    mockUpdateUser.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useUpdateUser());
    const userId = 1;
    const userData: Partial<UserType> = { email: 'carine@example.com' };
    const file = new File([''], 'avatar.png', { type: 'image/png' });

    await act(async () => {
      await result.current.update(userId, userData, file).catch(() => {});
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.success).toBe(false);
    }, { timeout: 3000 });

    expect(mockUpdateUser).toHaveBeenCalledWith(userId, userData, file);
  });

  test('should set loading state during update', async () => {
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockUpdateUser.mockImplementation(() => promise);

    const { result } = renderHook(() => useUpdateUser());
    const userId = 1;
    const userData: Partial<UserType> = { email: 'carine@example.com' };
    const file = new File([''], 'avatar.png', { type: 'image/png' });

    let updatePromise: Promise<void> | undefined;
    await act(async () => {
      updatePromise = result.current.update(userId, userData, file);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe(null);
      expect(result.current.success).toBe(false);
    }, { timeout: 1000 });

    await act(async () => {
      resolvePromise!(undefined);
      await promise;
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.success).toBe(true);
    }, { timeout: 3000 });

    if (updatePromise) await updatePromise;
    expect(mockUpdateUser).toHaveBeenCalledWith(userId, userData, file);
  });
});