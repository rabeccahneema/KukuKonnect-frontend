import useVerifyOtp from "./useVerifyOtp";
import { act, renderHook } from "@testing-library/react";
import { verifyOtp } from "../utils/verifyotpUtils";

jest.mock("../utils/verifyotpUtils", () => ({
  verifyOtp: jest.fn(),
}));

describe("useVerifyOtp hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls verifyOtp and returns result", async () => {
    (verifyOtp as jest.Mock).mockResolvedValue({ success: true });
    const { result } = renderHook(() => useVerifyOtp());
    let res;
    await act(async () => {
      res = await result.current.verify("test@example.com", "1234");
    });
    expect(verifyOtp).toHaveBeenCalledWith("test@example.com", "1234");
    expect(res).toEqual({ success: true });
  });

  it("sets error if verifyOtp throws", async () => {
    (verifyOtp as jest.Mock).mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useVerifyOtp());
    await act(async () => {
      await result.current.verify("test@example.com", "1234");
    });
    expect(result.current.error).toMatch(/network error/i);
  });

  it("returns error if verifyOtp returns error", async () => {
    (verifyOtp as jest.Mock).mockResolvedValue({
      error: "Invalid or expired OTP",
    });
    const { result } = renderHook(() => useVerifyOtp());
    let res;
    await act(async () => {
      res = await result.current.verify("test@example.com", "9999");
    });
  });
});
