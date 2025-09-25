import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "./page";
import * as useFetchSensorsHook from "../hooks/usefetchSensors";
import * as useFetchThresholdsHook from "../hooks/usefetchThreshholds";
import * as api from "../utils/fetchThresholds";

jest.mock("../hooks/usefetchSensors");
jest.mock("../hooks/usefetchThreshholds");
jest.mock("../utils/fetchThresholds");

describe("Dashboard component", () => {
  const fakeSensors = [
    { timestamp: new Date().toISOString(), temperature: "25", humidity: "50" },
  ];
  const fakeThresholds = [
    {
      device_id: "device1",
      temp_threshold_min: "20",
      temp_threshold_max: "30",
      humidity_threshold_min: "40",
      humidity_threshold_max: "70",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (useFetchSensorsHook.default as jest.Mock).mockReturnValue({
      sensors: fakeSensors,
      loading: false,
      error: null,
    });
    (useFetchThresholdsHook.default as jest.Mock).mockReturnValue({
      thresholds: fakeThresholds,
      loading: false,
      error: null,
    });
  });

  it("renders temperature and humidity info cards with full text including units", () => {
    render(<Dashboard />);
    expect(screen.getByText(/Current Temperature and Humidity/i)).toBeInTheDocument();
    expect(screen.getByText("Temperature")).toBeInTheDocument();

    expect(
      screen.getByText((content, element) => element?.textContent === "25°C")
    ).toBeInTheDocument();

    expect(screen.getByText("Humidity")).toBeInTheDocument();

    expect(
      screen.getByText((content, element) => element?.textContent === "50%")
    ).toBeInTheDocument();
  });

  it("shows the optimum temperature range and enables the change temperature button", () => {
    render(<Dashboard />);
    expect(screen.getByText(/Optimum temp:/i)).toHaveTextContent("20°C - 30°C");
    const button = screen.getByRole("button", { name: /Change Temperature/i });
    expect(button).toBeEnabled();
  });

  it("opens and closes the TemperatureModal when the change button is clicked", () => {
    render(<Dashboard />);
    const button = screen.getByRole("button", { name: /Change Temperature/i });
    fireEvent.click(button);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls updateThresholds API with correct values when confirming changes", async () => {
    const mockUpdate = api.updateThresholds as jest.Mock;
    mockUpdate.mockResolvedValue({});

    render(<Dashboard />);
    fireEvent.click(screen.getByRole("button", { name: /Change Temperature/i }));

    const confirmButton = screen.getByRole("button", { name: /Confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        device_id: "device1",
        temp_threshold_min: "20.00",
        temp_threshold_max: "30.00",
        humidity_threshold_min: "40",
        humidity_threshold_max: "70",
      });
    });
  });

  it("alerts the user if the updateThresholds API call fails", async () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    const mockUpdate = api.updateThresholds as jest.Mock;
    mockUpdate.mockRejectedValue(new Error("Network error"));

    render(<Dashboard />);
    fireEvent.click(screen.getByRole("button", { name: /Change Temperature/i }));

    const confirmButton = screen.getByRole("button", { name: /Confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(expect.stringContaining("Failed to update temperature thresholds"));
    });

    alertMock.mockRestore();
  });
});
