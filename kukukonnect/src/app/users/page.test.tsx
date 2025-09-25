import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FarmersPage from "./page";
import * as useFetchUsersHook from "../hooks/usefetchUsers";
import * as fetchUsersUtils from "../utils/fetchUsers";

describe("FarmersPage Component", () => {
  const mockUsers = [
    {
      id: 1,
      first_name: "Linn",
      last_name: "Achieng",
      email: "Achieng@gmail.com",
      phone_number: "078901111",
      username: "linnachieng",
      device_id: "dev123",
      user_type: "Farmer",
    },
    {
      id: 2,
      first_name: "Wendy",
      last_name: "Okinyo",
      email: "okinyogmail.com",
      phone_number: "0789002222222",
      username: "wendy_okinyo",
      device_id: "dev456",
      user_type: "Farmer",
    },
  ];

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders loading state", () => {
    jest.spyOn(useFetchUsersHook, "default").mockReturnValue({
      users: [],
      loading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<FarmersPage />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    jest.spyOn(useFetchUsersHook, "default").mockReturnValue({
      users: [],
      loading: false,
      error: "Failed to load users",
      refetch: jest.fn(),
    });

    render(<FarmersPage />);
    expect(screen.getByText(/Failed to load users/i)).toBeInTheDocument();
  });

  it("renders users and filters by search input", () => {
    jest.spyOn(useFetchUsersHook, "default").mockReturnValue({
      users: mockUsers,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<FarmersPage />);
    expect(screen.getByText(/Linn Achieng/i)).toBeInTheDocument();
    expect(screen.getByText(/Wendy Okinyo/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Search by name, email, or username/i), {
      target: { value: "Linn" },
    });

    expect(screen.getByText(/Linn Achieng/i)).toBeInTheDocument();
    expect(screen.queryByText(/Wendy Okinyo/i)).not.toBeInTheDocument();
  });

  it("opens and closes the AddUserModal", () => {
    jest.spyOn(useFetchUsersHook, "default").mockReturnValue({
      users: mockUsers,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<FarmersPage />);
    fireEvent.click(screen.getByText(/Add Farmer/i));
    
  });

  it("adds user and shows success message briefly", async () => {
    const refetchMock = jest.fn();
    jest.spyOn(useFetchUsersHook, "default").mockReturnValue({
      users: mockUsers,
      loading: false,
      error: null,
      refetch: refetchMock,
    });
    jest.spyOn(fetchUsersUtils, "addFarmers").mockResolvedValue(undefined);

    render(<FarmersPage />);
    fireEvent.click(screen.getByText(/Add Farmer/i));
    
  });
});
