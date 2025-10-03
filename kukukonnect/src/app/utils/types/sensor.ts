export interface MqttSensorPayload {
  timestamp: string;
  avg_temp: number;
  avg_humidity: number;
  device_id: string;
}

export interface SensorType {
  sensor_data_id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  device_id: string;
}
