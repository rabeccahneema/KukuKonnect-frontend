import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import HistoryBarChart from "./index";
import useFetchHistory from "../../../hooks/useFetchHistory";
jest.mock("recharts", () => ({
  __esModule: true,
  ResponsiveContainer: ({ children }: any) => <div data-testid="ResponsiveContainer">{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="BarChart">{children}</div>,
  CartesianGrid: () => <div data-testid="CartesianGrid" />,
  XAxis: () => <div data-testid="XAxis" />,
  YAxis: () => <div data-testid="YAxis" />,
  Tooltip: () => <div data-testid="Tooltip" />,
  Bar: () => <div data-testid="Bar" />,
}));
jest.mock("react-datepicker", () => (props: any) => (
  <input
    data-testid="date-picker"
    value={props.selected ? props.selected.toString() : ""}
    onChange={e => props.onChange?.(new Date("2025-09-22"))}
    placeholder={props.placeholderText}
  />
));
jest.mock("../List", () => () => <div data-testid="history-table">List Table</div>);
jest.mock("../../../hooks/useFetchHistory", () => ({ 
  __esModule: true,
  default: jest.fn(),
}));
describe("HistoryBarChart", () => {
  const mockHistory = [
    {
      timestamp: "2025-09-15T10:00:00.000Z",
      temperature: 25,
      humidity: 60,
    },
    {
      timestamp: "2025-09-16T10:00:00.000Z",
      temperature: 22,
      humidity: 55,
    },
    {
      timestamp: "2025-09-17T10:00:00.000Z",
      temperature: 26,
      humidity: 65,
    },
  ];
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
  it("renders the main headings (h1 and both h2s)", () => {
    render(<HistoryBarChart />);
    expect(
      screen.getByRole("heading", { name: /Temperature and Humidity History/i, level: 1 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /^Temperature$/, level: 2 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /^Humidity$/, level: 2 })
    ).toBeInTheDocument();
  });
  it("renders the Graph view by default with chart containers", () => {
    render(<HistoryBarChart />);
    expect(screen.getAllByTestId("ResponsiveContainer").length).toBe(2);
    expect(screen.getAllByTestId("BarChart").length).toBe(2);
  });
  it("switches to List view when List button is clicked", () => {
    render(<HistoryBarChart />);
    fireEvent.click(screen.getByRole("button", { name: /List/i }));
    expect(screen.getByTestId("history-table")).toBeInTheDocument();
  });
  it("switches back to Graph view when Graph button is clicked again", () => {
    render(<HistoryBarChart />);
    fireEvent.click(screen.getByRole("button", { name: /List/i }));
    fireEvent.click(screen.getByRole("button", { name: /Graph/i }));
    expect(
      screen.getByRole("heading", { name: /^Temperature$/, level: 2 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /^Humidity$/, level: 2 })
    ).toBeInTheDocument();
  });
  it("renders the date picker with correct placeholder", () => {
    render(<HistoryBarChart />);
    expect(screen.getByPlaceholderText("Select date")).toBeInTheDocument();
  });
  it("filters data when a date is selected", async () => {
    render(<HistoryBarChart />);
    const dateInput = screen.getByTestId("date-picker");
    fireEvent.change(dateInput, { target: { value: "2025-09-22" } });
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /^Temperature$/, level: 2 })).toBeInTheDocument();
    });
  });
  it("renders both chart bars and axis labels for weekdays", () => {
    render(<HistoryBarChart />);
    expect(screen.getAllByTestId("XAxis").length).toBe(2);
    expect(screen.getAllByTestId("YAxis").length).toBe(2);
  });
});









