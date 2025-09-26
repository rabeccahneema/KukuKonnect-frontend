
export type TempModalProps = {
  minTemp: number;
  maxTemp: number;
  setMinTemp: (val: number) => void;
  setMaxTemp: (val: number) => void;
  optimumRange: [number, number];
  setOptimumRange: (range: [number, number]) => void;
  closeModal: () => void;
  deviceId: string | null;
  onConfirm: (deviceId: string, minTemp: number, maxTemp: number) => Promise<void>;
  minAllowed?: number;
  maxAllowed?: number;
};