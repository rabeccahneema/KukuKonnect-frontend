import { verifyOtp } from "./verifyotpUtils";

describe("verifyOtp util", () => {
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
    const result = await verifyOtp("test@example.com", "1234");
    expect(result).toEqual(mockResponseData);
    expect(fetch).toHaveBeenCalledWith("/api/verify_otp", expect.any(Object));
  });

  it("throws error when response is not ok", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: "Bad Request",
        json: () => Promise.resolve({}),
      } as Response)
    );
    await expect(verifyOtp("queer@example.com", "9999")).resolves.toEqual({
      success: false,
      message: "Failed to verify Otp: OTP verification failed: Bad Request",
    });
    expect(fetch).toHaveBeenCalledWith("/api/verify_otp", expect.any(Object));
  });

  it("throws error when fetch rejects", async () => {
    const errorMessage = "Network error";
    global.fetch = jest.fn(() => Promise.reject(new Error(errorMessage)));
    await expect(verifyOtp("test@example.com", "1234")).resolves.toEqual({
      success: false,
      message: "Failed to verify Otp: Network error",
    });
    expect(fetch).toHaveBeenCalledWith("/api/verify_otp", expect.any(Object));
  });
});
