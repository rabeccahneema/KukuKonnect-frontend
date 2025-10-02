import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import Dashboard from './page';

jest.mock('../hooks/useMqttSensors', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../hooks/usefetchThreshholds', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../utils/fetchThresholds', () => ({
  updateThresholds: jest.fn(),
}));

jest.mock('./component/Graphs', () => {
  return (props: { title: string; data: any[] }) => (
    <div data-testid={`chart-${props.title.toLowerCase().replace(/\s+/g, '-')}`}>
      {props.title} ({props.data.length} points)
    </div>
  );
});


jest.mock('./component/Infocard', () => {
  return ({ label, value, unit }: { label: string; value: number | null; unit: string }) => (
    <div data-testid={`infocard-${label.toLowerCase()}`}>
      {label}: {value !== null ? `${value}${unit}` : '—'}
    </div>
  );
});

jest.mock('./component/Temperature-modal', () => {
  return ({ minTemp, maxTemp, closeModal, onConfirm, deviceId }: any) => (
    <div data-testid="temperature-modal">
      <button onClick={() => onConfirm(deviceId, minTemp, maxTemp)}>Confirm</button>
      <button onClick={closeModal}>Close</button>
    </div>
  );
});

jest.mock('../shared-components/FarmerLayout', () => {
  return ({ children }: { children: React.ReactNode }) => (
    <div data-testid="farmer-layout">{children}</div>
  );
});


const useMqttSensors = require('../hooks/useMqttSensors').default;
const useFetchThresholds = require('../hooks/usefetchThreshholds').default;
const { updateThresholds } = require('../utils/fetchThresholds');

describe('Dashboard', () => {
  const mockSensor = {
    sensor_data_id: 'sensor-1',
    timestamp: '2023-01-01T12:00:00Z',
    temperature: 22.5,
    humidity: 60.0,
    device_id: 'device-123',
  };

  const mockThreshold = {
    id: '1',
    device_id: 'device-123',
    temp_threshold_min: '18.00',
    temp_threshold_max: '28.00',
    humidity_threshold_min: '40.00',
    humidity_threshold_max: '70.00',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useMqttSensors as jest.Mock).mockReturnValue({ sensors: [], loading: true, error: null });
    (useFetchThresholds as jest.Mock).mockReturnValue({ thresholds: [], loading: true, error: null });
    (updateThresholds as jest.Mock).mockResolvedValue(undefined);
  });

  it('shows loading message', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Connecting to real-time data stream.../)).toBeInTheDocument();
  });

  it('shows MQTT error', () => {
    (useMqttSensors as jest.Mock).mockReturnValue({
      sensors: [],
      loading: false,
      error: 'Connection failed',
    });
    render(<Dashboard />);
    expect(screen.getByText(/Error: Connection failed/)).toBeInTheDocument();
  });

  it('displays sensor data and thresholds when loaded', async () => {
    (useMqttSensors as jest.Mock).mockReturnValue({
      sensors: [mockSensor],
      loading: false,
      error: null,
    });
    (useFetchThresholds as jest.Mock).mockReturnValue({
      thresholds: [mockThreshold],
      loading: false,
      error: null,
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('infocard-temperature')).toHaveTextContent('Temperature: 22.5°C');
      expect(screen.getByTestId('infocard-humidity')).toHaveTextContent('Humidity: 60%');
    });

    const optimumElement = screen.getByText(/Optimum temp:/);
    expect(optimumElement).toBeInTheDocument();
    expect(optimumElement.textContent).toContain('18°C - 28°C');
  });

  it('enables "Change Temperature" when thresholds load', async () => {
    (useMqttSensors as jest.Mock).mockReturnValue({ sensors: [mockSensor], loading: false, error: null });
    (useFetchThresholds as jest.Mock).mockReturnValue({ thresholds: [mockThreshold], loading: false, error: null });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Change Temperature/i })).toBeEnabled();
    });
  });

  it('opens modal on button click', async () => {
    (useMqttSensors as jest.Mock).mockReturnValue({ sensors: [mockSensor], loading: false, error: null });
    (useFetchThresholds as jest.Mock).mockReturnValue({ thresholds: [mockThreshold], loading: false, error: null });

    render(<Dashboard />);

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /Change Temperature/i }));
    });

    expect(screen.getByTestId('temperature-modal')).toBeInTheDocument();
  });

  it('calls updateThresholds on confirm', async () => {
    (useMqttSensors as jest.Mock).mockReturnValue({ sensors: [mockSensor], loading: false, error: null });
    (useFetchThresholds as jest.Mock).mockReturnValue({ thresholds: [mockThreshold], loading: false, error: null });

    render(<Dashboard />);

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /Change Temperature/i }));
    });

    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(updateThresholds).toHaveBeenCalledWith({
        device_id: 'device-123',
        temp_threshold_min: '18.00',
        temp_threshold_max: '28.00',
        humidity_threshold_min: '40.00',
        humidity_threshold_max: '70.00',
      });
    });
  });

  it('renders charts with data', async () => {
    (useMqttSensors as jest.Mock).mockReturnValue({ sensors: [mockSensor], loading: false, error: null });
    (useFetchThresholds as jest.Mock).mockReturnValue({ thresholds: [mockThreshold], loading: false, error: null });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('chart-recent-temperature')).toHaveTextContent('Recent Temperature (1 points)');
      expect(screen.getByTestId('chart-recent-humidity')).toHaveTextContent('Recent Humidity (1 points)');
    });
  });
});