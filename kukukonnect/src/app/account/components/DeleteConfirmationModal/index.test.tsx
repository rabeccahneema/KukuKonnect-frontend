import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteConfirmationModal from '.';

describe('DeleteConfirmationModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when show is false', () => {
    render(
      <DeleteConfirmationModal
        show={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        loading={false}
        error={null}
        success={false}
      />
    );

    expect(screen.queryByText(/Are you sure/i)).not.toBeInTheDocument();
  });

  it('should render modal content when show is true', () => {
    render(
      <DeleteConfirmationModal
        show={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        loading={false}
        error={null}
        success={false}
      />
    );

    expect(screen.getByText(/Are you sure you want to delete your account?/i)).toBeInTheDocument();
    expect(screen.getByText(/This action cannot be undone\./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Yes, Delete/i })).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(
      <DeleteConfirmationModal
        show={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        loading={false}
        error={null}
        success={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when Confirm button is clicked', () => {
    render(
      <DeleteConfirmationModal
        show={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        loading={false}
        error={null}
        success={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Yes, Delete/i }));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('disables Confirm button when loading is true', () => {
    render(
      <DeleteConfirmationModal
        show={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        loading={true}
        error={null}
        success={false}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /Deleting\.\.\./i });
    expect(confirmButton).toBeDisabled();
  });

  it('shows error message when error is provided', () => {
    render(
      <DeleteConfirmationModal
        show={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        loading={false}
        error="Failed to delete account"
        success={false}
      />
    );

    expect(screen.getByText(/Failed to delete account/i)).toBeInTheDocument();
    expect(screen.getByText(/Failed to delete account/i)).toHaveClass('text-red-600');
  });

  it('shows success message when success is true', () => {
    render(
      <DeleteConfirmationModal
        show={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        loading={false}
        error={null}
        success={true}
      />
    );

    expect(screen.getByText(/Account deleted successfully!/i)).toBeInTheDocument();
    expect(screen.getByText(/Account deleted successfully!/i)).toHaveClass('text-green-600');
  });

  it('does not show message when neither error nor success is present', () => {
    render(
      <DeleteConfirmationModal
        show={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        loading={false}
        error={null}
        success={false}
      />
    );

    expect(screen.queryByText(/Account deleted successfully!/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Failed to delete account/i)).not.toBeInTheDocument();
  });
});