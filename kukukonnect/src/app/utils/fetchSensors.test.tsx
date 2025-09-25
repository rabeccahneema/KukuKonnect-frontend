import { fetchSensors } from './fetchSensors';

describe('fetchSensors', () => {
  const baseUrl = 'api/sensor';
  let globalFetch: typeof global.fetch;

  beforeEach(() => {
    globalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = globalFetch;
  });

  it('should return sensors data when fetch is successful', async () => {
    const mockData = [{ id: 1, name: 'Sensor1' }];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const result = await fetchSensors();
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(baseUrl);
  });

  it('should throw an error when response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(fetchSensors()).rejects.toThrow('Something went wrong:Not Found');
    expect(global.fetch).toHaveBeenCalledWith(baseUrl);
  });

  it('should throw an error when fetch throws', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    await expect(fetchSensors()).rejects.toThrow('Failed to fetch sensors:Network error');
    expect(global.fetch).toHaveBeenCalledWith(baseUrl);
  });
});