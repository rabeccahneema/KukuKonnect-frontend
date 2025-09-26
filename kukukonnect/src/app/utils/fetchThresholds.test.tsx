import { fetchThresholds, updateThresholds } from './fetchThresholds';

describe('fetchThresholds', () => {
  const baseUrl = 'api/thresholds';

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should returns thresholds data when fetch is successful', async () => {
    const mockData = [{ id: 1, min: 10, max: 20 }];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    } as any);

    const result = await fetchThresholds();
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(baseUrl);
  });

  it('Should throws error when response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    } as any);

    await expect(fetchThresholds()).rejects.toThrow('Something went wrong: Not Found');
    expect(global.fetch).toHaveBeenCalledWith(baseUrl);
  });

  it('Should throws error when fetch itself fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    await expect(fetchThresholds()).rejects.toThrow('Failed to fetch thresholds: Network error');
    expect(global.fetch).toHaveBeenCalledWith(baseUrl);
  });
});

describe('updateThresholds', () => {
  const device_id = 'xyz789';
  const data = {
    device_id,
    temp_threshold_min: '10',
    temp_threshold_max: '35',
    humidity_threshold_min: '30',
    humidity_threshold_max: '80',
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should returns updated thresholds data when fetch is successful', async () => {
    const mockResponse = { success: true };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    const result = await updateThresholds(data);
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      `api/thresholds/${device_id}`,
      expect.objectContaining({
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    );
  });

  it('Should throw error when response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Bad Request',
    } as any);

    await expect(updateThresholds(data)).rejects.toThrow('Something went wrong: Bad Request');
    expect(global.fetch).toHaveBeenCalledWith(
      `api/thresholds/${device_id}`,
      expect.any(Object)
    );
  });

  it('Should throws error when fetch itself fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    await expect(updateThresholds(data)).rejects.toThrow('Failed to update thresholds: Network error');
    expect(global.fetch).toHaveBeenCalledWith(
      `api/thresholds/${device_id}`,
      expect.any(Object)
    );
  });
});