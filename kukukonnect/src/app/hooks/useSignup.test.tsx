import { renderHook, act } from "@testing-library/react";
import useRegister from "./useSignup";
import { useRouter } from "next/navigation";
import { fetchRegister } from "../utils/signUpUtils";

jest.mock("../utils/signUpUtils", () => ({
  fetchRegister: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => "/"),
  useSearchParams: jest.fn(() => new URLSearchParams("")),
}));

describe("useRegister hook", () => {
  const pushMock = jest.fn();
  const userData = {
    username: "testuser",
    first_name: "Test",
    last_name: "User",
    email: "test@example.com",
    phone_number: "1234567890",
    user_type: "Agrovet",
    password: "password123",
  };

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
    const { result } = renderHook(() => useRegister());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("successful register", async () => {
    (fetchRegister as jest.Mock).mockResolvedValue({
      success: true,
      message: "Account created",
    });
    const { result } = renderHook(() => useRegister());
    let response;
    await act(async () => {
      response = await result.current.register(
        userData.username,
        userData.first_name,
        userData.last_name,
        userData.email,
        userData.phone_number,
        userData.user_type,
        userData.password,
        null
      );
    });
    expect(fetchRegister).toHaveBeenCalledWith(
      userData.username,
      userData.first_name,
      userData.last_name,
      userData.email,
      userData.phone_number,
      userData.user_type,
      userData.password,
      null
    );
    expect(response).toEqual({ success: true, message: "Account created" });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("sets error on register failure response", async () => {
    (fetchRegister as jest.Mock).mockResolvedValue({ detail: "Error" });
    const { result } = renderHook(() => useRegister());
    let response;
    await act(async () => {
      response = await result.current.register(
        userData.username,
        userData.first_name,
        userData.last_name,
        userData.email,
        userData.phone_number,
        userData.user_type,
        userData.password,
        null
      );
    });
    expect(result.current.loading).toBe(false);
  });

  it("sets error on thrown error", async () => {
    (fetchRegister as jest.Mock).mockRejectedValue(new Error("Network Error"));
    const { result } = renderHook(() => useRegister());
    let response;
    await act(async () => {
      response = await result.current.register(
        userData.username,
        userData.first_name,
        userData.last_name,
        userData.email,
        userData.phone_number,
        userData.user_type,
        userData.password,
        null
      );
    });
    expect(result.current.error).toBe("Network Error");
    expect(result.current.loading).toBe(false);
  });
});
