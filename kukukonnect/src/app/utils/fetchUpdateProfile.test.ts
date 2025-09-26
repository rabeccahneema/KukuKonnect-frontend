import { updateUser } from "./fetchUpdateProfile";

global.fetch = jest.fn();

describe('updateUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('should update user successfully with valid token, user data, and file', async () => {
    const userId = 1;
    const token = 'valid-token';
    const userData = { first_name: 'Becky', email: 'becky@example.com' };
    const file = new File(['test'], 'profile.jpg', { type: 'image/jpeg' });
    const mockResponse = { id: userId, ...userData, image: 'profile.jpg' };

    localStorage.setItem('token', token);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await updateUser(userId, userData, file);

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(`/api/users/${userId}`, expect.objectContaining({
      method: 'PUT',
      headers: expect.objectContaining({
        Authorization: `Token ${token}`,
      }),
      body: expect.any(FormData),
    }));

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
    const formData = fetchCall[1].body as FormData;
    expect(formData.get('first_name')).toBe(userData.first_name);
    expect(formData.get('email')).toBe(userData.email);
    expect(formData.get('image')).toEqual(file);
  });

  test('should update user successfully with valid token and user data but no file', async () => {
    const userId = 1;
    const token = 'valid-token';
    const userData = { first_name: 'Becky', email: 'becky@example.com' };
    const mockResponse = { id: userId, ...userData };

    localStorage.setItem('token', token);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await updateUser(userId, userData, null);

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(`/api/users/${userId}`, expect.objectContaining({
      method: 'PUT',
      headers: expect.objectContaining({
        Authorization: `Token ${token}`,
      }),
      body: expect.any(FormData),
    }));

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
    const formData = fetchCall[1].body as FormData;
    expect(formData.get('first_name')).toBe(userData.first_name);
    expect(formData.get('email')).toBe(userData.email);
    expect(formData.get('image')).toBeNull();
  });

  test('should throw an error if no token is found', async () => {
    const userId = 1;
    const userData = { first_name: 'Becky', email: 'becky@example.com' };
    const file = new File(['test'], 'profile.jpg', { type: 'image/jpeg' });

    await expect(updateUser(userId, userData, file)).rejects.toThrow('No token found. Please log in.');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('should throw an error if the response is not ok', async () => {
    const userId = 1;
    const token = 'valid-token';
    const userData = { first_name: 'Becky', email: 'becky@example.com' };
    const file = new File(['test'], 'profile.jpg', { type: 'image/jpeg' });

    localStorage.setItem('token', token);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(updateUser(userId, userData, file)).rejects.toThrow('Something went wrong: Not Found');
    expect(global.fetch).toHaveBeenCalledWith(`/api/users/${userId}`, expect.objectContaining({
      method: 'PUT',
      headers: expect.objectContaining({
        Authorization: `Token ${token}`,
      }),
      body: expect.any(FormData),
    }));
  });

  test('should throw an error if the fetch request fails', async () => {
    const userId = 1;
    const token = 'valid-token';
    const userData = { first_name: 'Becky', email: 'becky@example.com' };
    const file = new File(['test'], 'profile.jpg', { type: 'image/jpeg' });

    localStorage.setItem('token', token);
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(updateUser(userId, userData, file)).rejects.toThrow('Failed to update user: Network error');
    expect(global.fetch).toHaveBeenCalledWith(`/api/users/${userId}`, expect.objectContaining({
      method: 'PUT',
      headers: expect.objectContaining({
        Authorization: `Token ${token}`,
      }),
      body: expect.any(FormData),
    }));
  });
});