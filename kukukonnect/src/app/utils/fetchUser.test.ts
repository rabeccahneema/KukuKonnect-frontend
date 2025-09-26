import { fetchUser } from './fetchUser'; 

global.fetch = jest.fn();

describe('fetchUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('should fetch user successfully with valid token and userId', async () => {
    const userId = 1;
    const token = 'valid-token';
    const mockUser = { id: userId, name: 'John Doe', email: 'john@example.com' };

    localStorage.setItem('token', token);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const result = await fetchUser(userId);

    expect(result).toEqual(mockUser);
    expect(global.fetch).toHaveBeenCalledWith(`/api/users/${userId}`, {
      headers: { Authorization: `Token ${token}` },
    });
  });

  test('should throw an error if no token is found', async () => {
    const userId = 1;

    await expect(fetchUser(userId)).rejects.toThrow('No token found. Please log in.');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('should throw an error if the response is not ok', async () => {
    const userId = 1;
    const token = 'valid-token';

    localStorage.setItem('token', token);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(fetchUser(userId)).rejects.toThrow('Something went wrong: Not Found');
    expect(global.fetch).toHaveBeenCalledWith(`/api/users/${userId}`, {
      headers: { Authorization: `Token ${token}` },
    });
  });

  test('should throw an error if the fetch request fails', async () => {
    const userId = 1;
    const token = 'valid-token';

    localStorage.setItem('token', token);
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchUser(userId)).rejects.toThrow('Failed to fetch user: Network error');
    expect(global.fetch).toHaveBeenCalledWith(`/api/users/${userId}`, {
      headers: { Authorization: `Token ${token}` },
    });
  });
});