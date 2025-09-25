import React from 'react';
import { render, screen } from '@testing-library/react';
import ChartsSection from '.';

jest.mock('recharts', () => ({
  __esModule: true,
  AreaChart: (props: any) => <div data-testid="areachart">{props.children}</div>,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="xaxis" />,
  YAxis: () => <div data-testid="yaxis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  CartesianGrid: () => <div data-testid="grid" />,
  ResponsiveContainer: (props: any) => <div data-testid="container">{props.children}</div>,
}));

describe('ChartsSection', () => {
  const defaultProps = {
    title: "Hourly Temperature",
    data: [
      { time: "1:00", temp: 20 },
      { time: "2:00", temp: 21 },
      { time: "3:00", temp: 19 },
    ],
    dataKey: "temp",
    yLabel: "Temperature (°C)",
    yDomain: [15, 30] as [number, number], 
    yTicks: [15, 20, 25, 30],
    gradientId: "tempGradient",
    gradientColor: "#D2914A",
    chartHeight: 350,
    chartBoxMinHeight: "min-h-[340px]",
    valueFormatter: (v: number) => `${v}°C`,
  };

  it('renders chart section with title', () => {
    render(<ChartsSection {...defaultProps} />);
    expect(screen.getByText(/Hourly Temperature/)).toBeInTheDocument();
  });

  it('renders chart container and all recharts components', () => {
    render(<ChartsSection {...defaultProps} />);
    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('areachart')).toBeInTheDocument();
    expect(screen.getByTestId('area')).toBeInTheDocument();
    expect(screen.getByTestId('xaxis')).toBeInTheDocument();
    expect(screen.getByTestId('yaxis')).toBeInTheDocument();
    expect(screen.getByTestId('grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('renders correctly with empty data', () => {
    render(<ChartsSection {...defaultProps} data={[]} />);
    expect(screen.getByText(/Hourly Temperature/)).toBeInTheDocument();
    expect(screen.getByTestId('container')).toBeInTheDocument();
  });
});
