import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TemperatureModal from ".";

describe("TemperatureModal", () => {
  const mockCloseModal = jest.fn();
  const mockOnConfirm = jest.fn();
  const setMinTemp = jest.fn();
  const setMaxTemp = jest.fn();
  const setOptimumRange = jest.fn();

  const defaultProps = {
    minTemp: 10,
    maxTemp: 30,
    setMinTemp,
    setMaxTemp,
    setOptimumRange,
    optimumRange: [32, 35] as [number, number],
    closeModal: mockCloseModal,
    deviceId: "device123",
    onConfirm: mockOnConfirm,
    minAllowed: 5,
    maxAllowed: 40,
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders modal with dialog role", () => {
    render(<TemperatureModal {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("submits form successfully, shows success message, then closes modal", async () => {
    mockOnConfirm.mockResolvedValueOnce(undefined);

    render(<TemperatureModal {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => expect(mockOnConfirm).toHaveBeenCalledWith("device123", 10, 30));
    expect(await screen.findByText(/Successfully changed optimum temperature!/i)).toBeInTheDocument();

    jest.advanceTimersByTime(2000);

    await waitFor(() => expect(mockCloseModal).toHaveBeenCalled());
  });

  it("alerts on submission failure and does not show success message", async () => {
    const errorMessage = "Network error";
    mockOnConfirm.mockRejectedValueOnce(new Error(errorMessage));
    window.alert = jest.fn();

    render(<TemperatureModal {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => expect(mockOnConfirm).toHaveBeenCalled());
    expect(window.alert).toHaveBeenCalledWith(`Failed to update temperature thresholds: ${errorMessage}`);
    expect(screen.queryByText(/Successfully changed optimum temperature!/i)).not.toBeInTheDocument();
  });

  it("calls closeModal when Cancel button is clicked", () => {
    render(<TemperatureModal {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockCloseModal).toHaveBeenCalled();
  });
});
