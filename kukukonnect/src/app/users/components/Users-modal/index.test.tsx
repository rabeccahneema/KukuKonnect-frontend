import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddUserModal from ".";

describe("AddUserModal Component", () => {
  const onAddUserMock = jest.fn();
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const farmerUser = {
    first_name: "Njoki",
    last_name: "Wanjiku",
    email: "njoki.wanjiku@gmail.com",
    phone_number: "0712345678",
    username: "njoki_wanjiku",
    device_id: "deviceKikuyu01",
    user_type: "Farmer",
  };

  it("does not render when show is false", () => {
    const { container } = render(
      <AddUserModal show={false} onClose={onCloseMock} onAddUser={onAddUserMock} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders input fields and updates on change", () => {
    render(<AddUserModal show={true} onClose={onCloseMock} onAddUser={onAddUserMock} />);

    const firstNameInput = screen.getByLabelText(/First name/i);
    fireEvent.change(firstNameInput, { target: { value: farmerUser.first_name } });
    expect(firstNameInput).toHaveValue(farmerUser.first_name);

    const lastNameInput = screen.getByLabelText(/Last name/i);
    fireEvent.change(lastNameInput, { target: { value: farmerUser.last_name } });
    expect(lastNameInput).toHaveValue(farmerUser.last_name);

    const emailInput = screen.getByLabelText(/Email Address/i);
    fireEvent.change(emailInput, { target: { value: farmerUser.email } });
    expect(emailInput).toHaveValue(farmerUser.email);
  });

  it("calls onAddUser and shows success message on submit", async () => {
    onAddUserMock.mockResolvedValueOnce(undefined);

    render(<AddUserModal show={true} onClose={onCloseMock} onAddUser={onAddUserMock} />);

    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: farmerUser.first_name } });
    fireEvent.change(screen.getByLabelText(/Last name/i), { target: { value: farmerUser.last_name } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: farmerUser.email } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: farmerUser.phone_number } });
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: farmerUser.username } });
    fireEvent.change(screen.getByLabelText(/Device id/i), { target: { value: farmerUser.device_id } });

    fireEvent.click(screen.getByText(/Add Farmer/i));

    await waitFor(() => {
      expect(onAddUserMock).toHaveBeenCalledWith(expect.objectContaining(farmerUser));
      expect(screen.getByText(/Farmer added successfully!/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText(/Farmer added successfully!/i)).not.toBeInTheDocument();
    }, { timeout: 2500 });
  });

  it("calls onClose when cancel button clicked", () => {
    render(<AddUserModal show={true} onClose={onCloseMock} onAddUser={onAddUserMock} />);

    fireEvent.click(screen.getByText(/Cancel/i));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("calls onClose when close icon clicked", () => {
    render(<AddUserModal show={true} onClose={onCloseMock} onAddUser={onAddUserMock} />);

    fireEvent.click(screen.getByLabelText("Close modal"));
    expect(onCloseMock).toHaveBeenCalled();
  });
});
