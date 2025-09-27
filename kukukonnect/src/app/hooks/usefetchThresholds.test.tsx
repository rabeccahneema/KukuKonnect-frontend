import { renderHook, waitFor } from '@testing-library/react';
import useFetchThresholds from './usefetchThreshholds';
import { fetchThresholds } from '../utils/fetchThresholds';
import { ThresholdType } from '../utils/types/threshholds';


jest.mock('../utils/fetchThresholds');


const mockThresholds: ThresholdType[] = [
  {
    device_id: 'device-abc-123',
    temp_threshold_min: '20',
    temp_threshold_max: '30',
    humidity_threshold_min: '40',
    humidity_threshold_max: '50',
  },
  {
    device_id: 'device-xyz-456',
    temp_threshold_min: '15',
    temp_threshold_max: '25',
    humidity_threshold_min: '35',
    humidity_threshold_max: '45',
  },
];

describe('useFetchThresholds', () => {
 
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the initial state correctly before fetching', () => {
    const { result } = renderHook(() => useFetchThresholds());
    expect(result.current.thresholds).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });


  it('should fetch and update state correctly with non-empty data', async () => {
  
    (fetchThresholds as jest.Mock).mockResolvedValue(mockThresholds);
    
    const { result } = renderHook(() => useFetchThresholds());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.thresholds).toEqual(mockThresholds);
      expect(result.current.error).toBe(null);
    });
  });

  it('should fetch and update state correctly with empty data', async () => {
   
    (fetchThresholds as jest.Mock).mockResolvedValue([]);
    
    const { result } = renderHook(() => useFetchThresholds());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.thresholds).toEqual([]);
      expect(result.current.error).toBe(null);
    });
  });

  it('should handle errors and update state correctly on failure', async () => {
    const errorMessage = 'Network error occurred';
 
    (fetchThresholds as jest.Mock).mockRejectedValue(new Error(errorMessage));
    
    const { result } = renderHook(() => useFetchThresholds());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.thresholds).toEqual([]);
      expect(result.current.error).toBe(errorMessage);
    });
  });

 
  it('should call fetchThresholds only once', async () => {
    (fetchThresholds as jest.Mock).mockResolvedValue(mockThresholds);
    renderHook(() => useFetchThresholds());
    
    await waitFor(() => expect(fetchThresholds).toHaveBeenCalledTimes(1));
  });

  it('should show loading during the fetch and stop once complete', async () => {

    const promise = Promise.resolve(mockThresholds);
    (fetchThresholds as jest.Mock).mockReturnValue(promise);
    
    const { result } = renderHook(() => useFetchThresholds());
    

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
  });
  
 
});
