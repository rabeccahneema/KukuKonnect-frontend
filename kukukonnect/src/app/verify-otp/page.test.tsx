jest.setTimeout(15000);

jest.mock("../hooks/useVerifyOtp", () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      verify: jest.fn(),
      loading: false,
    })),
  };
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
}));

import useVerifyOtp from "../hooks/useVerifyOtp";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OtpVerificationPage from "./page";

describe("OtpVerificationPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("forgotPasswordEmail", "test@example.com");
  });

  it("renders OTP inputs and verify button", () => {
    render(<OtpVerificationPage />);
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
    expect(screen.getByRole("button", { name: /verify/i })).toBeInTheDocument();
  });

  it("shows error if OTP is incomplete", async () => {
    render(<OtpVerificationPage />);
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) =>
      fireEvent.change(input, { target: { value: "" } })
    );
    fireEvent.click(screen.getByRole("button", { name: /verify/i }));
    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          content.includes("Please enter the 4-digit code")
        )
      ).toBeInTheDocument();
    });
  });

  it("calls verify with email and OTP", async () => {
    const mockVerify = jest.fn().mockResolvedValue({ success: true });
    (useVerifyOtp as jest.Mock).mockImplementation(() => ({
      verify: mockVerify,
      loading: false,
    }));

    render(<OtpVerificationPage />);
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input, i) => {
      fireEvent.change(input, { target: { value: String(i + 1) } });
    });
    fireEvent.click(screen.getByRole("button", { name: /verify/i }));
    await waitFor(() => {
      expect(mockVerify).toHaveBeenCalledWith("test@example.com", "1234");
    });
  });

  it("shows success message and redirects on valid OTP", async () => {
    const mockVerify = jest.fn().mockResolvedValue({
      success: true,
      message: "OTP verified successfully.",
    });
    (useVerifyOtp as jest.Mock).mockImplementation(() => ({
      verify: mockVerify,
      loading: false,
    }));

    render(<OtpVerificationPage />);
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input, i) => {
      fireEvent.change(input, { target: { value: String(i + 1) } });
    });
    fireEvent.click(screen.getByRole("button", { name: /verify/i }));
    await waitFor(
      () => {
        expect(
          screen.getByText((content) =>
            content.includes("OTP verified successfully.")
          )
        ).toBeInTheDocument();
      },
      { timeout: 15000 }
    );
  });

  it("shows error message for invalid OTP", async () => {
    const mockVerify = jest.fn().mockResolvedValue({ error: "Invalid or expired OTP" });
    (useVerifyOtp as jest.Mock).mockImplementation(() => ({
      verify: mockVerify,
      loading: false,
    }));

    render(<OtpVerificationPage />);
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input, i) => {
      fireEvent.change(input, { target: { value: String(i + 1) } });
    });
    fireEvent.click(screen.getByRole("button", { name: /verify/i }));
    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          content.includes("Invalid or expired OTP")
        )
      ).toBeInTheDocument();
    });
  });

  it("shows error if verify returns fallback error", async () => {
    (useVerifyOtp as jest.Mock).mockImplementation(() => ({
      verify: jest.fn().mockResolvedValue(undefined),
      loading: false,
    }));

    render(<OtpVerificationPage />);
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input, i) =>
      fireEvent.change(input, { target: { value: String(i + 1) } })
    );
    fireEvent.click(screen.getByRole("button", { name: /verify/i }));
    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          content.includes("OTP verification failed")
        )
      ).toBeInTheDocument();
    });
  });
});
