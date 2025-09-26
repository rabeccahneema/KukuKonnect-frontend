const mockForgotPassword = jest.fn();

jest.mock('../hooks/useForgotPassword', () => ({
  __esModule: true,
  default: () => ({
    forgotPassword: mockForgotPassword,
    loading: false,
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPasswordPage from "./page";

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders email input and submit button", () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send otp/i })).toBeInTheDocument();
  });

  it("shows error if email is empty", async () => {
    mockForgotPassword.mockResolvedValue(undefined);
    render(<ForgotPasswordPage />);
    fireEvent.click(screen.getByRole("button", { name: /send otp/i }));
    await waitFor(() => {
      expect(screen.getByText(/sending otp failed/i)).toBeInTheDocument();
    });
  });

  it("calls forgotPassword with entered email", async () => {
    mockForgotPassword.mockResolvedValue({});
    render(<ForgotPasswordPage />);
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send otp/i }));
    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith("test@example.com");
    });
  });

  it("shows success message on successful OTP send", async () => {
    mockForgotPassword.mockResolvedValue({});
    render(<ForgotPasswordPage />);
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send otp/i }));
    await waitFor(() => {
      expect(screen.getByText(/otp sent successfully/i)).toBeInTheDocument();
    });
  });

  it("shows error message if forgotPassword returns error", async () => {
    mockForgotPassword.mockResolvedValue({ error: "User with this email does not exist." });
    render(<ForgotPasswordPage />);
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "nouser@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send otp/i }));
    await waitFor(() => {
      expect(screen.getByText(/user with this email does not exist/i)).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it("shows error if forgotPassword returns fallback error", async () => {
    mockForgotPassword.mockResolvedValue(undefined);
    render(<ForgotPasswordPage />);
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send otp/i }));
    await waitFor(() => {
      expect(screen.getByText(/sending otp failed/i)).toBeInTheDocument();
    });
  });
});
