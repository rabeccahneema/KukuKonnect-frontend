import { setPassword } from "./setpasswordUtils";

describe("setPassword util", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns data when response is ok", async () => {
    const mockResponseData = { message: "Password set successfully" };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        statusText: "OK",
        json: () => Promise.resolve(mockResponseData),
      } as Response)
    );
    const result = await setPassword("test@example.com", "newpassword123");
    expect(result).toEqual(mockResponseData);
    expect(fetch).toHaveBeenCalledWith("/api/set_password", expect.any(Object));
  });

  it("throws error when response is not ok", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: "Bad Request",
        json: () => Promise.resolve({}),
      } as Response)
    );
    await expect(setPassword("nouser@example.com", "badpass")).rejects.toThrow(
      "Failed to set password: Setting password failed: Bad Request"
    );
    expect(fetch).toHaveBeenCalledWith("/api/set_password", expect.any(Object));
  });

  it("throws error when fetch rejects", async () => {
    const errorMessage = "Network failure";
    global.fetch = jest.fn(() => Promise.reject(new Error(errorMessage)));
    await expect(
      setPassword("test@example.com", "newpassword123")
    ).rejects.toThrow("Failed to set password: Network failure");
    expect(fetch).toHaveBeenCalledWith("/api/set_password", expect.any(Object));
  });
});
