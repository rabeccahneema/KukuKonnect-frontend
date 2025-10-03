import { renderHook, act } from '@testing-library/react';
import useMqttSensors from './useMqttSensors';
import mqtt from 'mqtt';

jest.mock('mqtt', () => {
  return {
    connect: jest.fn(),
  };
});

describe('useMqttSensors', () => {
  let mockClient: {
    on: jest.Mock;
    subscribe: jest.Mock;
    end: jest.Mock;
  };
  let subscribeCallback: ((error: Error | null) => void) | null = null;

  beforeEach(() => {
    jest.clearAllMocks();
    subscribeCallback = null;

    mockClient = {
      on: jest.fn(),
      subscribe: jest.fn((_topic, callback) => {
        subscribeCallback = callback || null;
        return mockClient;
      }),
      end: jest.fn(),
    };

    (mqtt.connect as jest.Mock).mockReturnValue(mockClient);
  });

  const triggerConnect = () => {
    const connectHandlers = mockClient.on.mock.calls
      .filter(([event]) => event === 'connect')
      .map(([, handler]) => handler);
    act(() => {
      connectHandlers.forEach(handler => handler());
    });
  };

  

  const triggerMessage = (payload: string) => {
    const messageHandlers = mockClient.on.mock.calls
      .filter(([event]) => event === 'message')
      .map(([, handler]) => handler);
    act(() => {
      messageHandlers.forEach(handler =>
        handler('esp32/sensor_data', Buffer.from(payload))
      );
    });
  };

  const triggerError = (err: Error) => {

    const errorHandlers = mockClient.on.mock.calls
      .filter(([event]) => event === 'error')
      .map(([, handler]) => handler);
    act(() => {
      errorHandlers.forEach(handler => handler(err));
    });
  };

  it('should initialize with loading true and empty sensors', () => {
    const { result } = renderHook(() => useMqttSensors());
    expect(result.current.loading).toBe(true);
    expect(result.current.sensors).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should stop loading after successful connection and subscription', () => {
    const { result } = renderHook(() => useMqttSensors());

    triggerConnect();

    act(() => {
      subscribeCallback?.(null); 
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle valid MQTT message and update sensors', () => {
    const { result } = renderHook(() => useMqttSensors());

    triggerConnect();
    act(() => {
      subscribeCallback?.(null);
    });

    const mockPayload = JSON.stringify({
      timestamp: '2023-01-01T12:00:00Z',
      avg_temp: 22.5,
      avg_humidity: 60.0,
      device_id: 'device-123',
    });

    triggerMessage(mockPayload);

    expect(result.current.sensors).toHaveLength(1);
    expect(result.current.sensors[0]).toMatchObject({
      timestamp: '2023-01-01T12:00:00Z',
      temperature: 22.5,
      humidity: 60.0,
      device_id: 'device-123',
    });
    expect(result.current.sensors[0].sensor_data_id).toMatch(/^sensor-\d+$/);
  });

  it('should handle JSON parse error', () => {
    const { result } = renderHook(() => useMqttSensors());

    triggerConnect();
    act(() => {
      subscribeCallback?.(null);
    });

    triggerMessage('invalid json');

    expect(result.current.error).toMatch(/Failed to parse MQTT message JSON/);
  });

  it('should handle MQTT client error', () => {
    const { result } = renderHook(() => useMqttSensors());
    triggerError(new Error('Network unreachable'));
    expect(result.current.error).toBe('MQTT Client Error: Network unreachable');
  });

  it('should clean up on unmount', () => {
    const { unmount } = renderHook(() => useMqttSensors());
    unmount();
    expect(mockClient.end).toHaveBeenCalled();
  });
});