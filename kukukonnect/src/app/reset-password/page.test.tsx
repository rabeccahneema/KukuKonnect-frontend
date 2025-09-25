import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPassword from "./page";
import useResetPassword from "../hooks/useResetPassword";
import { useRouter } from "next/navigation";

jest.mock("../hooks/useResetPassword", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("next/image", () => ({ __esModule: true, default: () => null }));
jest.mock("next/link", () => ({ __esModule: true, default: (props: { children: React.ReactNode }) => props.children }));

describe("ResetPassword Page", () => {
  const mockResetPassword = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useResetPassword as jest.Mock).mockReturnValue({
      resetPassword: mockResetPassword,
      loading: false,
    });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it("renders all input fields and button", () => {
    render(<ResetPassword />);
    expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reset Password/i })).toBeInTheDocument();
  });

  it("shows error if passwords do not match", async () => {
    render(<ResetPassword />);
    fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "pass1" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "pass2" } });
    fireEvent.click(screen.getByRole("button", { name: /Set Password/i }));
    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("calls resetPassword with correct values", async () => {
    mockResetPassword.mockResolvedValue({ message: "Password reset successfully" });
    render(<ResetPassword />);
    fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "pass123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "pass123" } });
    fireEvent.click(screen.getByRole("button", { name: /Set Password/i }));
    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith("test@example.com", "pass123");
    });
  });

  it("shows success message and redirects on success", async () => {
    mockResetPassword.mockResolvedValue({ message: "Password reset successfully" });
    render(<ResetPassword />);
    fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "pass123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "pass123" } });
    fireEvent.click(screen.getByRole("button", { name: /Set Password/i }));
    await waitFor(() => {
      expect(screen.getByText(/Password reset successfully/i)).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it("shows error if resetPassword returns error", async () => {
    mockResetPassword.mockResolvedValue({ error: "Email not found" });
    render(<ResetPassword />);
    fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: "nouser@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "pass123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "pass123" } });
    fireEvent.click(screen.getByRole("button", { name: /Set Password/i }));
    await waitFor(() => {
      expect(screen.getByText(/Email not found/i)).toBeInTheDocument();
    });
  });

  it("shows fallback error if resetPassword returns undefined", async () => {
    mockResetPassword.mockResolvedValue(undefined);
    render(<ResetPassword />);
    fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "pass123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "pass123" } });
    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes("Set password failed"))).toBeInTheDocument();
    });
  });
});
