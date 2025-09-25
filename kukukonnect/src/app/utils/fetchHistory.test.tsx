import {fetchHistory} from "./fetchHistory";

global.fetch = jest.fn();

describe("fetchHistory", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return JSON data when fetch is successful", async () => {
    const mockData = [{ id: 1, temperature: 23 }];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    const result = await fetchHistory();
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith("api/history");
  });

  it("should throw error if response is not ok", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    await expect(fetchHistory()).rejects.toThrow(
      "Something went wrong:Internal Server Error"
    );
  });

  it("should throw error if fetch throws", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchHistory()).rejects.toThrow(
      "Failed to fetch history data:Network error"
    );
  });
});


