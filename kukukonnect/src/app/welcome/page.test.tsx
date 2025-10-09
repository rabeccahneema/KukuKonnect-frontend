import { render, screen, fireEvent } from "@testing-library/react";
import WelcomeScreen from "./page";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("WelcomeScreen", () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("renders the logo image", () => {
    render(<WelcomeScreen />);
    const logoImg = screen.getByAltText("Kuku Logo");
    expect(logoImg).toBeInTheDocument();
  });

  it("renders the welcome heading", () => {
    render(<WelcomeScreen />);
    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
    expect(screen.getByText(/Kuku/i)).toBeInTheDocument();
    expect(screen.getByText(/Konnect/i)).toBeInTheDocument();
  });

  it("renders both Farmer and AgroVet buttons", () => {
    render(<WelcomeScreen />);
    expect(screen.getByRole("button", { name: /Farmer/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /AgroVet/i })).toBeInTheDocument();
  });

  it("renders the egg image", () => {
    render(<WelcomeScreen />);
    const eggImg = screen.getByAltText(/Chick standing next to an egg/i);
    expect(eggImg).toBeInTheDocument();
  });

  it("navigates to /set-password when Farmer is clicked", () => {
    render(<WelcomeScreen />);
    fireEvent.click(screen.getByRole("button", { name: /Farmer/i }));
    expect(mockPush).toHaveBeenCalledWith("/set-password");
  });

  it("navigates to /signup when AgroVet is clicked", () => {
    render(<WelcomeScreen />);
    fireEvent.click(screen.getByRole("button", { name: /AgroVet/i }));
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
