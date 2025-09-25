import { Login } from "./loginUtils";

describe("Login util", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns data when response is ok", async () => {
    const mockResponseData = {
      message: "Login successful",
      token: "abc.def.ghi",
    };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        statusText: "OK",
        json: () => Promise.resolve(mockResponseData),
      } as Response)
    );
    const result = await Login("test@example.com", "abc123");
    expect(result).toEqual(mockResponseData);
    expect(fetch).toHaveBeenCalledWith("/api/login", expect.any(Object));
  });

  it("throws error when response is not ok", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: "Bad Request",
        json: () => Promise.resolve({}),
      } as Response)
    );
    await expect(Login("nouser@example.com", "badpass")).rejects.toThrow(
      "Login failed: Bad Request"
    );
    expect(fetch).toHaveBeenCalledWith("/api/login", expect.any(Object));
  });

  it("throws error when fetch rejects", async () => {
    const errorMessage = "Network error";
    global.fetch = jest.fn(() => Promise.reject(new Error(errorMessage)));
    await expect(Login("test@example.com", "abc123")).rejects.toThrow(
      "Failed to  login: " + errorMessage
    );
    expect(fetch).toHaveBeenCalledWith("/api/login", expect.any(Object));
  });
});
