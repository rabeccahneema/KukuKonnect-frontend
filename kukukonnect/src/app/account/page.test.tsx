import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AccountSettingsPage from './page';
import useFetchUser from '../hooks/useFetchUser';
import useUpdateUser from '../hooks/useUpdateUser';
import useDeleteUser from '../hooks/useDeleteUser';
import useSetPassword from '../hooks/useSetPassword';

jest.mock('../hooks/useFetchUser');
jest.mock('../hooks/useUpdateUser');
jest.mock('../hooks/useDeleteUser');
jest.mock('../hooks/useSetPassword');

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: jest.fn().mockReturnValue('/'),
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, val: string) => {
      store[key] = val.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('AccountSettingsPage', () => {
  const mockUser = {
    id: '123',
    first_name: 'Selam',
    last_name: 'Meron',
    email: 'selam@example.com',
    phone_number: '1234567890',
    username: 'selam_meron',
    user_type: 'Farmer' as const,
  };

  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();

    (useFetchUser as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      error: null,
    });
    (useUpdateUser as jest.Mock).mockReturnValue({
      update: jest.fn(),
      loading: false,
      error: null,
      success: false,
    });
    (useDeleteUser as jest.Mock).mockReturnValue({
      remove: jest.fn(),
      loading: false,
      error: null,
      success: false,
    });
    (useSetPassword as jest.Mock).mockReturnValue({
      SetPassword: jest.fn(),
      loading: false,
      error: null,
      success: false,
    });
  });

  it('redirects to landing page (/) if no user in localStorage', () => {
    render(<AccountSettingsPage />);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('shows loading while fetching user', () => {
    (useFetchUser as jest.Mock).mockReturnValue({ loading: true, user: null, error: null });
    localStorage.setItem('user', JSON.stringify({ id: '123' }));
    render(<AccountSettingsPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error if useFetchUser fails', () => {
    (useFetchUser as jest.Mock).mockReturnValue({
      loading: false,
      user: null,
      error: 'Failed to load user',
    });
    localStorage.setItem('user', JSON.stringify({ id: '123' }));
    render(<AccountSettingsPage />);
    expect(screen.getByText('Failed to load user')).toBeInTheDocument();
  });

  it('renders ProfileForm when activeTab is edit-profile', () => {
    (useFetchUser as jest.Mock).mockReturnValue({ loading: false, user: mockUser, error: null });
    localStorage.setItem('user', JSON.stringify({ id: '123' }));
    render(<AccountSettingsPage />);
    expect(screen.getByDisplayValue('Selam')).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
  });

  it('shows ChangePasswordForm for Farmer user_type', () => {
    (useFetchUser as jest.Mock).mockReturnValue({ loading: false, user: mockUser, error: null });
    localStorage.setItem('user', JSON.stringify({ id: '123' }));
    render(<AccountSettingsPage />);

    fireEvent.click(screen.getByText(/change password/i));

    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
  });

  it('does not show password tab for non-Farmer users', () => {
    const buyerUser = { ...mockUser, user_type: 'Buyer' as const };
    (useFetchUser as jest.Mock).mockReturnValue({ loading: false, user: buyerUser, error: null });
    localStorage.setItem('user', JSON.stringify({ id: '123' }));
    render(<AccountSettingsPage />);
    expect(screen.queryByText(/change password/i)).not.toBeInTheDocument();
  });

  it('shows profile success popup and auto-hides after ~2 seconds', async () => {
    (useFetchUser as jest.Mock).mockReturnValue({ loading: false, user: mockUser, error: null });
    (useUpdateUser as jest.Mock).mockReturnValue({
      update: jest.fn(),
      loading: false,
      error: null,
      success: true,
    });
    localStorage.setItem('user', JSON.stringify({ id: '123' }));

    render(<AccountSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('Profile updated successfully.')).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(screen.queryByText('Profile updated successfully.')).not.toBeInTheDocument();
      },
      { timeout: 2500 }
    );
  });

  it('shows delete confirmation modal and triggers delete', () => {
    (useFetchUser as jest.Mock).mockReturnValue({ loading: false, user: mockUser, error: null });
    const mockRemove = jest.fn();
    (useDeleteUser as jest.Mock).mockReturnValue({
      remove: mockRemove,
      loading: false,
      error: null,
      success: false,
    });
    localStorage.setItem('user', JSON.stringify({ id: '123' }));

    render(<AccountSettingsPage />);

    fireEvent.click(screen.getByText(/delete account/i));

    expect(
      screen.getByText(/are you sure you want to delete your account/i)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText(/yes, delete/i));

    expect(mockRemove).toHaveBeenCalledWith('123');
  });

  it('redirects to landing page (/) after successful account deletion', async () => {
    (useFetchUser as jest.Mock).mockReturnValue({ loading: false, user: mockUser, error: null });
    (useDeleteUser as jest.Mock).mockReturnValue({
      remove: jest.fn(),
      loading: false,
      error: null,
      success: true,
    });
    localStorage.setItem('user', JSON.stringify({ id: '123' }));

    render(<AccountSettingsPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    }, { timeout: 2000 });
  });
});
