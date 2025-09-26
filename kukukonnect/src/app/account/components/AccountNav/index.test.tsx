import { render, screen, fireEvent } from '@testing-library/react';
import AccountNav from '.';

describe('AccountNav', () => {
  const mockSetActiveTab = jest.fn();
  const mockSetShowDeleteConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <AccountNav
        activeTab="edit-profile"
        setActiveTab={mockSetActiveTab}
        setShowDeleteConfirm={mockSetShowDeleteConfirm}
        showPasswordTab={true}
        {...props}
      />
    );
  };

  it('renders all three tabs when showPasswordTab is true', () => {
    renderComponent();

    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.getByText('Change Password')).toBeInTheDocument();
    expect(screen.getByText('Delete Account')).toBeInTheDocument();
  });

  it('does not render "Change Password" tab when showPasswordTab is false', () => {
    renderComponent({ showPasswordTab: false });

    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.queryByText('Change Password')).not.toBeInTheDocument();
    expect(screen.getByText('Delete Account')).toBeInTheDocument();
  });

  it('applies active styles to the "Edit Profile" tab when active', () => {
    renderComponent({ activeTab: 'edit-profile' });

    const editProfileBtn = screen.getByText('Edit Profile');
    expect(editProfileBtn).toHaveClass('bg-white');
    expect(editProfileBtn).toHaveClass('text-[#0B2C27]');
    expect(editProfileBtn).toHaveClass('border-[#0B2C27]');
  });

  it('applies active styles to the "Change Password" tab when active', () => {
    renderComponent({ activeTab: 'change-password' });

    const changePasswordBtn = screen.getByText('Change Password');
    expect(changePasswordBtn).toHaveClass('bg-white');
    expect(changePasswordBtn).toHaveClass('text-[#0B2C27]');
  });

  it('applies active styles to the "Delete Account" tab when active', () => {
    renderComponent({ activeTab: 'delete-account' });

    const deleteAccountBtn = screen.getByText('Delete Account');
    expect(deleteAccountBtn).toHaveClass('bg-white');
    expect(deleteAccountBtn).toHaveClass('text-[#0B2C27]');
  });

  it('calls setActiveTab with "edit-profile" when Edit Profile is clicked', () => {
    renderComponent({ activeTab: 'change-password' });

    fireEvent.click(screen.getByText('Edit Profile'));
    expect(mockSetActiveTab).toHaveBeenCalledWith('edit-profile');
  });

  it('calls setActiveTab with "change-password" when Change Password is clicked', () => {
    renderComponent({ activeTab: 'edit-profile' });

    fireEvent.click(screen.getByText('Change Password'));
    expect(mockSetActiveTab).toHaveBeenCalledWith('change-password');
  });

  it('calls setShowDeleteConfirm(true) when Delete Account is clicked', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Delete Account'));
    expect(mockSetShowDeleteConfirm).toHaveBeenCalledWith(true);
  });
});