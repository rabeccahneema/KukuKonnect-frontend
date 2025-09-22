import { renderHook, act } from "@testing-library/react";
import useSetPassword from "./useSetPassword";
import { setPassword } from "../utils/setpasswordUtils";

jest.mock("../utils/setpasswordUtils", () => ({
  setPassword: jest.fn(),
}));

describe("useSetPassword hook", () => {
  const email = "test@example.com";
  const password = "12345678";

  it("returns result and sets loading", async () => {
    (setPassword as jest.Mock).mockResolvedValue({
      message: "Password set successfully",
    });
    const { result } = renderHook(() => useSetPassword());
    let response;
    await act(async () => {
      response = await result.current.SetPassword(email, password);
    });
    expect(response).toEqual({ message: "Password set successfully" });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("sets error on failure", async () => {
    (setPassword as jest.Mock).mockRejectedValue(
      new Error("Set password failed")
    );
    const { result } = renderHook(() => useSetPassword());
    let response;
    await act(async () => {
      response = await result.current.SetPassword(email, password);
    });
    expect(response).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Set password failed");
  });
});
