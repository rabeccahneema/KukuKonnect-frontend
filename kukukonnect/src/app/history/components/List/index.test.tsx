import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import HistoryTable from "./index";
jest.mock('../../../hooks/useFetchHistory', () => ({
  __esModule: true,
  default: jest.fn(),
}));
import useFetchHistory from "../../../hooks/useFetchHistory";
const mockHistory = [
  {
    temperature: "22",
    humidity: "60",
    timestamp: "2025-09-21T10:00:00.000Z"
  },
  {
    temperature: "23",
    humidity: "62",
    timestamp: "2025-09-22T10:00:00.000Z"
  },
  {
    temperature: "24",
    humidity: "63",
    timestamp: "2025-09-22T12:00:00.000Z"
  },
  {
    temperature: "25",
    humidity: "64",
    timestamp: "2025-09-23T10:00:00.000Z"
  },
  {
    temperature: "26",
    humidity: "65",
    timestamp: "2025-09-24T10:00:00.000Z"
  },
  {
    temperature: "27",
    humidity: "66",
    timestamp: "2025-09-25T10:00:00.000Z"
  },
  {
    temperature: "28",
    humidity: "67",
    timestamp: "2025-09-26T10:00:00.000Z"
  },
];
describe("HistoryTable", () => {
  beforeEach(() => {
    (useFetchHistory as jest.Mock).mockReturnValue({
      history: mockHistory,
      loading: false,
      error: null,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("renders table headings", () => {
    render(<HistoryTable />);
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Temperature")).toBeInTheDocument();
    expect(screen.getByText("Humidity")).toBeInTheDocument();
  });
  it("renders the correct table data (averages grouped by date)", () => {
    render(<HistoryTable />);
    expect(screen.getByText("9/21/2025")).toBeInTheDocument();
    expect(screen.getByText("22°C")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
    expect(screen.getByText("9/22/2025")).toBeInTheDocument();
    expect(screen.getByText("23.5°C")).toBeInTheDocument();
    expect(screen.getByText("62.5%")).toBeInTheDocument();
  });
  it("shows loading message", () => {
    (useFetchHistory as jest.Mock).mockReturnValueOnce({
      history: [],
      loading: true,
      error: null,
    });
    render(<HistoryTable />);
    expect(screen.getByText(/Loading history data.../i)).toBeInTheDocument();
  });
  it("shows error message", () => {
    (useFetchHistory as jest.Mock).mockReturnValueOnce({
      history: [],
      loading: false,
      error: "Something went wrong",
    });
    render(<HistoryTable />);
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });
  it("disables Previous on first page and Next on last page", () => {
    render(<HistoryTable />);
    expect(screen.getByRole("button", { name: /Previous/i })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: /Next/i }));
    fireEvent.click(screen.getByRole("button", { name: /Next/i }));
    expect(screen.getByRole("button", { name: /Next/i })).toBeDisabled();
  });
 });









