import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SetPassword from "./page";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, ...rest } = props;
    return <img {...rest} fill={fill ? "true" : undefined} />;
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockSetPassword = jest.fn();
let mockLoading = false;
jest.mock("../hooks/useSetPassword", () => ({
  __esModule: true,
  default: () => ({
    SetPassword: mockSetPassword,
    loading: mockLoading,
    error: null,
  }),
}));

describe("SetPassword Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLoading = false;
  });

  it("renders all form fields and UI elements", () => {
    render(<SetPassword />);
    const setPasswordTexts = screen.getAllByText("Set Password");
    expect(setPasswordTexts).toHaveLength(2);
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Set Password/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Log in/i })).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  it("toggles password visibility for password and confirm fields", () => {
    render(<SetPassword />);
    const passwordInput = screen.getByLabelText("Password");
    const confirmInput = screen.getByLabelText("Confirm password");
    const toggles = screen.getAllByRole("button", { name: /Show/i });
    const passwordToggle = toggles[0];
    const confirmToggle = toggles[1];

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

  it("shows loading state when submitting", async () => {
    mockLoading = true;
    render(<SetPassword />);
    const button = screen.getByRole("button", { name: /Set Password/i });
    expect(button).toBeDisabled();
  });

  it("requires all fields before submit", async () => {
    render(<SetPassword />);
    fireEvent.click(screen.getByRole("button", { name: /Set Password/i }));
    expect(mockSetPassword).not.toHaveBeenCalled();
  });

  it("shows login link", () => {
    render(<SetPassword />);
    const loginLink = screen.getByRole("link", { name: /Log in/i });
    expect(loginLink).toHaveAttribute("href", "/login");
  });
});
