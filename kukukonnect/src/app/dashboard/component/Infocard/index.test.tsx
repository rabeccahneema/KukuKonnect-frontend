import { render, screen } from '@testing-library/react';
import InfoCard from '.';

describe('InfoCard', () => {
  it('renders label, value, and unit correctly', () => {
    render(<InfoCard label="Temperature" value={25} unit="°C" />);
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByText('25°C')).toBeInTheDocument();
  });

  it('renders fallback when value is null', () => {
    render(<InfoCard label="Humidity" value={null} unit="%" />);
    expect(screen.getByText('Humidity')).toBeInTheDocument();
    expect(screen.getByText('--%')).toBeInTheDocument();
  });

  it('renders fallback when value is undefined', () => {
    render(<InfoCard label="Humidity" value={undefined as any} unit="%" />);
    expect(screen.getByText('Humidity')).toBeInTheDocument();
    expect(screen.getByText('--%')).toBeInTheDocument();
  });
});