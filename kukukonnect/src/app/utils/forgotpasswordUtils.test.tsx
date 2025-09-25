import { ForgotPassword } from "./forgotpasswordUtils";

describe("ForgotPassword util", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns data when response is ok", async () => {
    const mockResponseData = { success: true };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        statusText: "OK",
        json: () => Promise.resolve(mockResponseData),
      } as Response)
    );
    const result = await ForgotPassword("test@example.com");
    expect(result).toEqual(mockResponseData);
    expect(fetch).toHaveBeenCalledWith(
      "/api/forgot_password",
      expect.any(Object)
    );
  });

  it("throws error when response is not ok", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: "Bad Request",
        json: () => Promise.resolve({}),
      } as Response)
    );
    await expect(ForgotPassword("nouser@example.com")).rejects.toThrow(
      "Failed to send otp: Bad Request"
    );
    expect(fetch).toHaveBeenCalledWith(
      "/api/forgot_password",
      expect.any(Object)
    );
  });

  it("throws error when fetch rejects", async () => {
    const errorMessage = "Network error";
    global.fetch = jest.fn(() => Promise.reject(new Error(errorMessage)));
    await expect(ForgotPassword("test@example.com")).rejects.toThrow(
      "Failed to send otp: " + errorMessage
    );
    expect(fetch).toHaveBeenCalledWith(
      "/api/forgot_password",
      expect.any(Object)
    );
  });
});
