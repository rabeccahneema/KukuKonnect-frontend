import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "./page";
import { useRouter } from "next/navigation";
import useLogin from "../hooks/useLogin";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("../hooks/useLogin", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("next/image", () => ({ __esModule: true, default: () => null }));
jest.mock("next/link", () => ({ __esModule: true, default: (props: { children: React.ReactNode }) => props.children }));

describe("Login Component", () => {
  const mockLogin = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useLogin as jest.Mock).mockReturnValue({
      login: mockLogin,
      loading: false,
    });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form input fields", () => {
    render(<Login />);
    expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log In/i })).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.getByText(/Forgot password/i)).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    render(<Login />);
    const passwordInput = screen.getByPlaceholderText("Password");
    const passwordToggle = screen.getByLabelText(/show password/i);
    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(passwordToggle);
    expect(passwordInput).toHaveAttribute("type", "text");
    fireEvent.click(passwordToggle);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("shows error message when login fails", async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /Log In/i }));
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes("Invalid credentials"))).toBeInTheDocument();
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "wrongpass");
    }, { timeout: 10000 });
  });

  it("disables submit button when loading", () => {
    (useLogin as jest.Mock).mockReturnValue({ login: mockLogin, loading: true });
    render(<Login />);
    expect(screen.getByRole("button", { name: /Logging In.../i })).toBeDisabled();
  });

  it("calls login and redirects to dashboard for Farmer", async () => {
    jest.useFakeTimers();
    mockLogin.mockResolvedValueOnce({ user: { user_type: "Farmer" } });
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: "farmer@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "pass" } });
    fireEvent.click(screen.getByRole("button", { name: /Log In/i }));
    jest.advanceTimersByTime(100);
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
    jest.useRealTimers();
  });

  it("calls login and redirects to users for Agrovet", async () => {
    jest.useFakeTimers();
    mockLogin.mockResolvedValueOnce({ user: { user_type: "Agrovet" } });
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: "agrovet@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "pass" } });
    fireEvent.click(screen.getByRole("button", { name: /Log In/i }));
    jest.advanceTimersByTime(100);
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/users");
    });
    jest.useRealTimers();
  });
});
