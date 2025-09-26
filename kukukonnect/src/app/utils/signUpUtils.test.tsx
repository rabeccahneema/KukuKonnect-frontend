import { fetchRegister } from "./signUpUtils";

describe("fetchRegister util", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns data when response is ok", async () => {
    const mockResponseData = { message: "Account created", success: true };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        statusText: "OK",
        json: () => Promise.resolve(mockResponseData),
      } as Response)
    );
    const result = await fetchRegister(
      "testuser",
      "Test",
      "User",
      "test@example.com",
      "1234567890",
      "Agrovet",
      "password123"
    );
    expect(result).toEqual(mockResponseData);
    expect(fetch).toHaveBeenCalledWith("/api/signup", expect.any(Object));
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
      fetchRegister(
        "Querr",
        "No",
        "User",
        "querr@example.com",
        "0000000000",
        "Farmer",
        "badpass"
      )
    ).rejects.toThrow("Registration failed: Bad Request");
    expect(fetch).toHaveBeenCalledWith("/api/signup", expect.any(Object));
  });

  it("throws error when fetch rejects", async () => {
    const errorMessage = "Network error";
    global.fetch = jest.fn(() => Promise.reject(new Error(errorMessage)));
    await expect(
      fetchRegister(
        "failuser",
        "Fail",
        "User",
        "queer@example.com",
        "9999999999",
        "Farmer",
        "failpass"
      )
    ).rejects.toThrow("Failed to register: " + errorMessage);
    expect(fetch).toHaveBeenCalledWith("/api/signup", expect.any(Object));
  });
});
