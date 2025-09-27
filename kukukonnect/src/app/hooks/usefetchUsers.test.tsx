import { renderHook, waitFor, act } from '@testing-library/react';
import useFetchUsers from './usefetchUsers';
import { fetchUsers } from '../utils/fetchUsers';
import { UserType } from '../utils/types/users';


jest.mock('../utils/fetchUsers');

const mockUsers: UserType[] = [
  {
    username: 'Akinyi',
    first_name: 'John',
    last_name: 'Anyango',
    phone_number: '123-456-7890',
    email: 'akinyi@gmail.com',
    device_id: 'device-1',
    user_type: 'admin',
  },
  {
    username: 'TonyHocky',
    first_name: 'Jane',
    last_name: 'otieno',
    phone_number: '079876543210',
    email: 'tony@gmail.com',
    device_id: 'device-2',
    user_type: 'user',
  },
];

describe('useFetchUsers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should return the initial state correctly', () => {
    const { result } = renderHook(() => useFetchUsers());
    expect(result.current.users).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should fetch and update state correctly with non-empty data', async () => {
    (fetchUsers as jest.Mock).mockResolvedValue(mockUsers);
    
    const { result } = renderHook(() => useFetchUsers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.users).toEqual(mockUsers);
      expect(result.current.error).toBe(null);
    });
  });


  it('should fetch and update state correctly with empty data', async () => {
    (fetchUsers as jest.Mock).mockResolvedValue([]);
    
    const { result } = renderHook(() => useFetchUsers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.users).toEqual([]);
      expect(result.current.error).toBe(null);
    });
  });


  it('should handle errors and update state correctly on failure', async () => {
    const errorMessage = 'Network error occurred';
    (fetchUsers as jest.Mock).mockRejectedValue(new Error(errorMessage));
    
    const { result } = renderHook(() => useFetchUsers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.users).toEqual([]);
      expect(result.current.error).toBe(errorMessage);
    });
  });


  it('should call fetchUsers only once on initial render', async () => {
    (fetchUsers as jest.Mock).mockResolvedValue(mockUsers);
    renderHook(() => useFetchUsers());
    
    await waitFor(() => expect(fetchUsers).toHaveBeenCalledTimes(1));
  });


  it('should not re-fetch data on re-renders', async () => {
    (fetchUsers as jest.Mock).mockResolvedValue(mockUsers);
    const { rerender } = renderHook(() => useFetchUsers());

    await waitFor(() => expect(fetchUsers).toHaveBeenCalledTimes(1));

    rerender();
    rerender();
    expect(fetchUsers).toHaveBeenCalledTimes(1);
  });

  
  it('should show loading during the fetch and stop once complete', async () => {
    const promise = Promise.resolve(mockUsers);
    (fetchUsers as jest.Mock).mockReturnValue(promise);
    
    const { result } = renderHook(() => useFetchUsers());
    
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
  });


  it('should refetch data when the refetch function is called', async () => {
    (fetchUsers as jest.Mock)
      .mockResolvedValueOnce([]) 
      .mockResolvedValueOnce(mockUsers); 

    const { result } = renderHook(() => useFetchUsers());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.users).toEqual([]);

    await act(async () => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.users).toEqual(mockUsers);
    });

    expect(fetchUsers).toHaveBeenCalledTimes(2);
  });
  
  it('should reset state when refetch is called', async () => {
    (fetchUsers as jest.Mock)
      .mockResolvedValueOnce(mockUsers)
      .mockRejectedValue(new Error('Refetch error')); 

    const { result } = renderHook(() => useFetchUsers());

    
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.users).toEqual(mockUsers);

    
    await act(async () => {
      result.current.refetch();
    });


    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).not.toBe(null);
    });
  });


  it('should return a stable refetch function', () => {
    const { result, rerender } = renderHook(() => useFetchUsers());
    const initialRefetch = result.current.refetch;

    rerender();


    expect(result.current.refetch).toBe(initialRefetch);
  });

});
