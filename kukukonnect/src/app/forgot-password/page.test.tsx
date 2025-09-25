(useForgotPassword as jest.Mock).mockImplementation(() => ({
  forgotPassword: jest.fn(),
  loading: false,
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

jest.mock("../hooks/useForgotPassword", () => ({
  __esModule: true,
  default: jest.fn(),
}));
import useForgotPassword from "../hooks/useForgotPassword";

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
    (useForgotPassword as jest.Mock).mockImplementation(() => ({
      forgotPassword: jest.fn().mockResolvedValue(undefined),
      loading: false,
    }));
    render(<ForgotPasswordPage />);
    fireEvent.click(screen.getByRole("button", { name: /send otp/i }));
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes("Sending otp failed"))).toBeInTheDocument();
    });
  });

  it("calls forgotPassword with entered email", async () => {
    const mockForgotPassword = jest.fn().mockResolvedValue({});
    (useForgotPassword as jest.Mock).mockImplementation(() => ({
      forgotPassword: mockForgotPassword,
      loading: false,
    }));
    render(<ForgotPasswordPage />);
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send otp/i }));
    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith("test@example.com");
    });
  });

  it("shows success message on successful OTP send", async () => {
    const mockForgotPassword = jest.fn().mockResolvedValue({});
    (useForgotPassword as jest.Mock).mockImplementation(() => ({
      forgotPassword: mockForgotPassword,
      loading: false,
    }));
    render(<ForgotPasswordPage />);
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send otp/i }));
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes("OTP sent successfully"))).toBeInTheDocument();
    });
  });

  it("shows error message if forgotPassword returns error", async () => {
    const mockForgotPassword = jest.fn().mockResolvedValue({ error: "User with this email does not exist." });
    (useForgotPassword as jest.Mock).mockImplementation(() => ({
      forgotPassword: mockForgotPassword,
      loading: false,
    }));
    render(<ForgotPasswordPage />);
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "nouser@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send otp/i }));
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes("User with this email does not exist"))).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it("shows error if forgotPassword returns fallback error", async () => {
    (useForgotPassword as jest.Mock).mockImplementation(() => ({
      forgotPassword: jest.fn().mockResolvedValue(undefined),
      loading: false,
    }));
    render(<ForgotPasswordPage />);
    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send otp/i }));
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes("Sending otp failed"))).toBeInTheDocument();
    });
  });
});
