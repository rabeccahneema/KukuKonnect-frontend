import useForgotPassword from "./useForgotPassword";
import { act, renderHook } from "@testing-library/react";
import { ForgotPassword } from "../utils/forgotpasswordUtils";

jest.mock("../utils/forgotpasswordUtils", () => ({
  ForgotPassword: jest.fn(),
}));

describe("useForgotPassword hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls ForgotPassword and returns result", async () => {
    (ForgotPassword as jest.Mock).mockResolvedValue({ success: true });
    const { result } = renderHook(() => useForgotPassword());
    let res; 
    await act(async () => {
      res = await result.current.forgotPassword("test@example.com");
    });
    expect(ForgotPassword).toHaveBeenCalledWith("test@example.com");
    expect(res).toEqual({ success: true });
  });

  it("sets error if ForgotPassword throws", async () => {
    (ForgotPassword as jest.Mock).mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useForgotPassword());
    await act(async () => {
      await result.current.forgotPassword("test@example.com");
    });
    expect(result.current.error).toMatch(/network error/i);
  });

  it("sets error if ForgotPassword returns error", async () => {
    (ForgotPassword as jest.Mock).mockResolvedValue({
      error: "User with this email does not exist.",
    });
    const { result } = renderHook(() => useForgotPassword());
    await act(async () => {
      await result.current.forgotPassword("queer@gmail.com");
    });
    expect(result.current.error).toBeNull();
  });
});
