import { renderHook, waitFor } from "@testing-library/react";
import useFetchSensors from "./usefetchSensors";
import { fetchSensors } from "../utils/fetchSensors";
import { SensorType } from "../utils/types/sensor";

jest.mock("../utils/fetchSensors");

const mockSensors: SensorType[] = [
  {
    sensor_data_id: "data-1",
    temperature: 25.5,
    humidity: 60.2,
    timestamp: "2025-09-25T10:00:00Z",
    device_id: "device-1",
  },
  {
    sensor_data_id: "data-2",
    temperature: 24.8,
    humidity: 59.5,
    timestamp: "2025-09-25T10:05:00Z",
    device_id: "device-2",
  },
];

describe("useFetchSensors", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the initial state correctly before fetching", () => {
    const { result } = renderHook(() => useFetchSensors());
    expect(result.current.sensors).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it("should fetch and update state correctly with non-empty data", async () => {
    (fetchSensors as jest.Mock).mockResolvedValue(mockSensors);

    const { result } = renderHook(() => useFetchSensors());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.sensors).toEqual(mockSensors);
      expect(result.current.error).toBe(null);
    });
  });

  it("should fetch and update state correctly with empty data", async () => {
    (fetchSensors as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useFetchSensors());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.sensors).toEqual([]);
      expect(result.current.error).toBe(null);
    });
  });

  it("should handle errors and update state correctly on failure", async () => {
    const errorMessage = "Network error occurred";
    (fetchSensors as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFetchSensors());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.sensors).toEqual([]);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  it("should show loading during the fetch and stop once complete", async () => {
    const promise = Promise.resolve(mockSensors);
    (fetchSensors as jest.Mock).mockReturnValue(promise);

    const { result } = renderHook(() => useFetchSensors());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});
