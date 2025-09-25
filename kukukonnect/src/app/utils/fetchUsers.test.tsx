
import { fetchUsers, addFarmers } from '../utils/fetchUsers';
global.fetch = jest.fn();

describe('fetchUsers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return data when fetch is successful', async () => {
    const mockResult = [{ username: 'amos' }];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult,
    });

    const result = await fetchUsers();
    expect(result).toEqual(mockResult);
    expect(fetch).toHaveBeenCalledWith('/api/users');
  });

  it('Should throw error when response not ok', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request'
    });
    await expect(fetchUsers()).rejects.toThrow('Something went wrong: Bad Request');
  });

  it('Should throw error when fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('network error'));
    await expect(fetchUsers()).rejects.toThrow('Failed to fetch users: network error');
  });
});

describe('addFarmers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const farmerData = {
    username: 'amos',
    first_name: 'Amos',
    last_name: 'Hezron',
    phone_number: '07440000',
    email: 'amos@example.com',
    device_id: 'device123',
    user_type: 'Farmer'
  };

  it('Should return data when POST is successful', async () => {
    const mockResult = { success: true };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult,
    });

    const result = await addFarmers(farmerData);
    expect(result).toEqual(mockResult);
    expect(fetch).toHaveBeenCalledWith('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farmerData),
    });
  });

  it('Should throw error when POST response not ok', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Unauthorized'
    });
    await expect(addFarmers(farmerData)).rejects.toThrow('Something went wrong: Unauthorized');
  });

  it('Should throw  error when POST fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('network error'));
    await expect(addFarmers(farmerData)).rejects.toThrow('Failed to add farmer: network error');
  });
});