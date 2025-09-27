import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChangePasswordForm from '.';

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

jest.mock('lucide-react', () => ({
  Eye: () => <svg />,
  EyeOff: () => <svg />,
}));

describe('ChangePasswordForm', () => {
  const mockSetPasswordFn = jest.fn();
  const mockOnCancel = jest.fn();
  const mockOnSuccess = jest.fn();

  const defaultProps = {
    email: 'user@example.com',
    onCancel: mockOnCancel,
    setPasswordFn: mockSetPasswordFn,
    loading: false,
    error: null,
    onSuccess: mockOnSuccess,
  };

  const renderForm = (props = {}) => {
    return render(<ChangePasswordForm {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial email', () => {
    renderForm();
    expect(screen.getByLabelText('Email')).toHaveValue('user@example.com');
    expect(screen.getByLabelText('New Password')).toHaveValue('');
    expect(screen.getByLabelText('Confirm New Password')).toHaveValue('');
  });

  it('updates form fields on input change', () => {
    renderForm();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newPass123' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'newPass123' } });

    expect(screen.getByLabelText('Email')).toHaveValue('new@example.com');
    expect(screen.getByLabelText('New Password')).toHaveValue('newPass123');
    expect(screen.getByLabelText('Confirm New Password')).toHaveValue('newPass123');
  });

  it('toggles new password visibility', () => {
    renderForm();
    const toggleBtn = screen.getAllByRole('button', { name: /show password/i })[0];
    const input = screen.getByLabelText('New Password');

    expect(input).toHaveAttribute('type', 'password');
    fireEvent.click(toggleBtn);
    expect(input).toHaveAttribute('type', 'text');
  });

  it('toggles confirm password visibility', () => {
    renderForm();
    const toggleBtn = screen.getAllByRole('button', { name: /show password/i })[1];
    const input = screen.getByLabelText('Confirm New Password');

    expect(input).toHaveAttribute('type', 'password');
    fireEvent.click(toggleBtn);
    expect(input).toHaveAttribute('type', 'text');
  });

  it('shows local error if email is empty', async () => {
    renderForm({ email: '' });
    fireEvent.submit(screen.getByRole('button', { name: 'Change Password' }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(mockSetPasswordFn).not.toHaveBeenCalled();
  });

  it('shows local error if passwords do not match', async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'pass1' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'pass2' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Change Password' }));
    expect(await screen.findByText(/new passwords do not match/i)).toBeInTheDocument();
    expect(mockSetPasswordFn).not.toHaveBeenCalled();
  });

  it('calls setPasswordFn and onSuccess on successful submission', async () => {
    mockSetPasswordFn.mockResolvedValue({ success: true });
    renderForm();
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'SecurePass123!' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'SecurePass123!' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Change Password' }));

    await waitFor(() => {
      expect(mockSetPasswordFn).toHaveBeenCalled();
    });
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('does not call onSuccess if setPasswordFn throws an error', async () => {
    mockSetPasswordFn.mockRejectedValue(new Error('Failed to update password'));
    renderForm();
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'pass' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'pass' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Change Password' }));

    await waitFor(() => {
      expect(mockSetPasswordFn).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  it('displays server error from props', () => {
    renderForm({ error: 'Failed to update password.' });
    expect(screen.getByText(/failed to update password/i)).toBeInTheDocument();
  });

  it('disables submit button when loading', () => {
    renderForm({ loading: true });
    expect(screen.getByRole('button', { name: 'Changing...' })).toBeDisabled();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
