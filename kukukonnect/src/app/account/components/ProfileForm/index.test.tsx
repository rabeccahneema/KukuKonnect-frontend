import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ProfileForm from '.';

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

jest.mock('lucide-react', () => ({
  Edit: () => <svg data-testid="edit-icon" />,
}));

global.URL.createObjectURL = jest.fn(() => 'mock-preview-url');

describe('ProfileForm', () => {
  const mockOnSave = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockUser = {
    first_name: 'Meaza',
    last_name: 'Misgina',
    email: 'meaza@example.com',
    phone_number: '1234567890',
    username: 'meazi',
    device_id: 'device123',
    image: 'https://example.com/image.jpg',
    user_type: 'Farmer',
  };

  const defaultProps = {
    user: mockUser,
    onSave: mockOnSave,
    saving: false,
    error: null,
    onSuccess: mockOnSuccess,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user data correctly when not editing', () => {
    render(<ProfileForm {...defaultProps} />);
    
    expect(screen.getByLabelText('First Name')).toHaveValue('Meaza');
    expect(screen.getByLabelText('Last Name')).toHaveValue('Misgina');
    expect(screen.getByLabelText('Email')).toHaveValue('meaza@example.com');
    expect(screen.getByLabelText('Phone Number')).toHaveValue('1234567890');
    expect(screen.getByLabelText('Username')).toHaveValue('meazi');
    
    expect(screen.getByLabelText('Device ID')).toBeInTheDocument();
    expect(screen.getByLabelText('Device ID')).toBeDisabled();
    expect(screen.getByLabelText('Device ID')).toHaveValue('device123');
    
    expect(screen.getByAltText('Profile')).toHaveAttribute('src', 'https://example.com/image.jpg');
    
    expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
    
    expect(screen.queryByRole('button', { name: /save changes/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });

  it('enables editing when Edit Profile button is clicked', async () => {
    render(<ProfileForm {...defaultProps} />);
    
    const editBtn = screen.getByRole('button', { name: /edit profile/i });
    await userEvent.click(editBtn);
    
    expect(screen.getByLabelText('First Name')).not.toBeDisabled();
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('handles input changes correctly', async () => {
    render(<ProfileForm {...defaultProps} />);
    
    await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    
    const firstNameInput = screen.getByLabelText('First Name');
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'Jane');
    
    expect(firstNameInput).toHaveValue('Jane');
  });

  it('handles image upload', async () => {
    render(<ProfileForm {...defaultProps} />);
    
    const imageContainer = screen.getByAltText('Profile').closest('div');
    await userEvent.click(imageContainer!);
    
    const file = new File(['(⌐□_□)'], 'profile.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByAltText('Profile').closest('form')?.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(fileInput, file);
    
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
    expect(screen.getByAltText('Profile')).toHaveAttribute('src', 'mock-preview-url');
  });

  it('submits form with correct data', async () => {
    render(<ProfileForm {...defaultProps} />);
    
    await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    await userEvent.clear(screen.getByLabelText('First Name'));
    await userEvent.type(screen.getByLabelText('First Name'), 'Jerry');
    
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
    
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'Jerry',
        lastName: 'Misgina',
        email: 'meaza@example.com',
        phoneNumber: '1234567890',
        username: 'meazi',
        deviceId: 'device123',
        profileImage: 'https://example.com/image.jpg',
      }),
      null 
    );
  });

  it('shows error message when provided', () => {
    render(<ProfileForm {...defaultProps} error="Update failed" />);
    
    expect(screen.getByText('Update failed')).toBeInTheDocument();
  });

  it('shows saving state', () => {
    render(<ProfileForm {...defaultProps} saving={true} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
  });

  it('hides Device ID for non-Farmer users', () => {
    const nonFarmerUser = { ...mockUser, user_type: 'Buyer' };
    render(<ProfileForm {...defaultProps} user={nonFarmerUser} />);
    
    expect(screen.queryByLabelText('Device ID')).not.toBeInTheDocument();
  });

  it('resets form on cancel', async () => {
    render(<ProfileForm {...defaultProps} />);
    
    await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    await userEvent.clear(screen.getByLabelText('First Name'));
    await userEvent.type(screen.getByLabelText('First Name'), 'Eyeru');
    
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    
    expect(screen.getByLabelText('First Name')).toHaveValue('Meaza');
    expect(screen.getByLabelText('First Name')).toBeDisabled();
  });

  it('handles image click on edit icon', async () => {
    render(<ProfileForm {...defaultProps} />);
    
    const editIcon = screen.getByTestId('edit-icon');
    await userEvent.click(editIcon);
    
    const fileInput = screen.getByAltText('Profile').closest('form')?.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
  });
});