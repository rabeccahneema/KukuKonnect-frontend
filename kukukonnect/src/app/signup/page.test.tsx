import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUp from "./page";
import { useRouter } from "next/navigation";
import useRegister from "../hooks/useSignup";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../hooks/useSignup", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("SignUp Component", () => {
  const mockRegister = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRegister as jest.Mock).mockReturnValue({
      register: mockRegister,
      loading: false,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form input fields", () => {
    render(<SignUp />);
    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Phone Number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument();
  });

  it("toggles password visibility for password and confirm fields", () => {
    render(<SignUp />);
    const [passwordToggle, confirmToggle] = screen.getAllByLabelText(/show password/i);
    const passwordInput = screen.getByPlaceholderText("New password");
    const confirmInput = screen.getByPlaceholderText("Confirm password");

    expect(passwordInput).toHaveAttribute("type", "password");
    expect(confirmInput).toHaveAttribute("type", "password");

    fireEvent.click(passwordToggle);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(passwordToggle);
    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(confirmToggle);
    expect(confirmInput).toHaveAttribute("type", "text");

    fireEvent.click(confirmToggle);
    expect(confirmInput).toHaveAttribute("type", "password");
  });



  it("shows error message on registration failure", async () => {
    mockRegister.mockResolvedValueOnce(null);

    render(<SignUp />);
    fireEvent.change(screen.getByPlaceholderText("First Name"), { target: { value: "Fail" } });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), { target: { value: "Case" } });
    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "failcase" } });
    fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: "fail@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), { target: { value: "0000000000" } });
    fireEvent.change(screen.getByPlaceholderText("New password"), { target: { value: "password321" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "password321" } });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("Registration failed. Please try again.")).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    }, { timeout: 10000 });
  });

  it("shows error message on register function throwing an error", async () => {
    mockRegister.mockRejectedValueOnce(new Error("Network error"));

    render(<SignUp />);
    fireEvent.change(screen.getByPlaceholderText("First Name"), { target: { value: "Err" } });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), { target: { value: "Case" } });
    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "errcase" } });
    fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: "err@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), { target: { value: "1111111111" } });
    fireEvent.change(screen.getByPlaceholderText("New password"), { target: { value: "passworderr" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "passworderr" } });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
