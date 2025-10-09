import { renderHook, act } from "@testing-library/react";
import useResetPassword from "./useResetPassword";
import * as utils from "../utils/resetpasswordUtils";

jest.mock("../utils/resetpasswordUtils", () => ({
  resetPassword: jest.fn(),
}));

describe("useResetPassword hook", () => {
  const mockResetPassword = utils.resetPassword as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns result on successful password reset", async () => {
    mockResetPassword.mockResolvedValue({ message: "Password reset successfully" });
    const { result } = renderHook(() => useResetPassword());
    let response;
    await act(async () => {
      response = await result.current.ResetPassword("test@example.com", "pass123");
    });
    expect(response).toEqual({ message: "Password reset successfully" });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("returns null and sets error for failure", async () => {
    mockResetPassword.mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useResetPassword());
    let response;
    await act(async () => {
      response = await result.current.ResetPassword("test@example.com", "pass123");
    });
    expect(response).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Network error");
  });

  it("returns null and sets error for undefined result", async () => {
    mockResetPassword.mockResolvedValue(undefined);
    const { result } = renderHook(() => useResetPassword());
    let response;
    await act(async () => {
      response = await result.current.ResetPassword("test@example.com", "pass123");
    });
    expect(response).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Resetting password failed");
  });
});
