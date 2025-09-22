import { renderHook, act } from "@testing-library/react";
import useLogin from "./useLogin";
import { useRouter } from "next/navigation";
import { Login } from "../utils/loginUtils";

jest.mock("../utils/loginUtils", () => ({
  Login: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => "/"),
  useSearchParams: jest.fn(() => new URLSearchParams("")),
}));

describe("useLogin hook", () => {
  const pushMock = jest.fn();
  const email = "test@example.com";
  const password = "abc123";

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
      replace: jest.fn(),
      prefetch: jest.fn(),
      pathname: "/",
      query: {},
      asPath: "/",
    });
  });

  it("initial state", () => {
    const { result } = renderHook(() => useLogin());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("successful login", async () => {
    (Login as jest.Mock).mockResolvedValue({
      message: "Login successful",
      token: "abc.def.ghi",
    });
    const { result } = renderHook(() => useLogin());
    let response;
    await act(async () => {
      response = await result.current.login(email, password);
    });
    expect(Login).toHaveBeenCalledWith(email, password);
    expect(response).toEqual({
      message: "Login successful",
      token: "abc.def.ghi",
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("sets error on login failure response", async () => {
    (Login as jest.Mock).mockResolvedValue({ detail: "Error" });
    const { result } = renderHook(() => useLogin());
    let response;
    await act(async () => {
      response = await result.current.login(email, password);
    });
    expect(result.current.loading).toBe(false);
  });

  it("sets error on thrown error", async () => {
    (Login as jest.Mock).mockRejectedValue(new Error("Network Error"));
    const { result } = renderHook(() => useLogin());
    let response;
    await act(async () => {
      response = await result.current.login(email, password);
    });
    expect(result.current.error).toBe("Network Error");
    expect(result.current.loading).toBe(false);
  });
});
