import { deleteUser } from "./fetchDeleteAccount";

global.fetch = jest.fn();

describe('deleteUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('should delete user successfully with valid token and userId', async () => {
    const userId = 1;
    const token = 'valid-token';

    localStorage.setItem('token', token);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    });

    const result = await deleteUser(userId);

    expect(result).toEqual({ message: 'User deleted successfully' });
    expect(global.fetch).toHaveBeenCalledWith(`/api/users/${userId}`, expect.objectContaining({
      method: 'DELETE',
      headers: expect.objectContaining({
        Authorization: `Token ${token}`,
      }),
    }));
  });

  test('should throw an error if no token is found', async () => {
    const userId = 1;

    await expect(deleteUser(userId)).rejects.toThrow('No token found. Please log in.');
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

    await expect(deleteUser(userId)).rejects.toThrow('Something went wrong: Not Found');
    expect(global.fetch).toHaveBeenCalledWith(`/api/users/${userId}`, expect.objectContaining({
      method: 'DELETE',
      headers: expect.objectContaining({
        Authorization: `Token ${token}`,
      }),
    }));
  });
});