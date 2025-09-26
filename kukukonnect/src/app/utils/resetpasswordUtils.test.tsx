import { resetPassword } from "./resetpasswordUtils";

describe("resetPassword util", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns data when response is ok", async () => {
    const mockResponseData = { message: "Password reset successful" };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        statusText: "OK",
        json: () => Promise.resolve(mockResponseData),
      } as Response)
    );
    const result = await resetPassword("test@example.com", "newpassword123");
    expect(result).toEqual(mockResponseData);
    expect(fetch).toHaveBeenCalledWith(
      "/api/reset_password",
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
    await expect(
      resetPassword("queen@gmail.com", "badpassword")
    ).rejects.toThrow(
      "Failed to reset password: Resetting password failed: Bad Request"
    );
    expect(fetch).toHaveBeenCalledWith(
      "/api/reset_password",
      expect.any(Object)
    );
  });

  it("throws error when fetch rejects", async () => {
    const errorMessage = "Network error";
    global.fetch = jest.fn(() => Promise.reject(new Error(errorMessage)));
    await expect(
      resetPassword("test@example.com", "newpassword123")
    ).rejects.toThrow("Failed to reset password: Network error");
    expect(fetch).toHaveBeenCalledWith(
      "/api/reset_password",
      expect.any(Object)
    );
  });
});
