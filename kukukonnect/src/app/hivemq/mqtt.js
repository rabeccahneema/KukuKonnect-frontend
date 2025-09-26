'use client';
import { useEffect } from 'react';
import mqtt from 'mqtt';
const MqttSubscriber = () => {

  useEffect(() => {
    const broker = process.env.MQTT_BROKER_URL;
    const username = process.env.MQTT_USERNAME;
    const password = process.env.MQTT_PASSWORD;
    const topic = process.env.MQTT_TOPIC || 'esp32/sensor_data';
    const apiEndpoint = process.env.BACKEND_API_ENDPOINT;
    if (!broker || !username || !password || !apiEndpoint) {
      console.error('Missing required environment variables. Please check your configuration.');
      return;
    }
    const options = {
      username,
      password,
    };
    const client = mqtt.connect(broker, options);
    client.on('connect', () => {
      console.log('Connected to HiveMQ over WebSocket');
      client.subscribe(topic, (err) => {
        if (err) {
          console.error('Subscription error:', err);
        } else {
          console.log(`Subscribed to topic ${topic}`);
        }
      });
    });
    client.on('message', (topic, message) => {
      try {
        const mqttData = JSON.parse(message.toString());
        const postData = {
            timestamp: mqttData.timestamp,
            temperature: mqttData.avg_temp,
            humidity: mqttData.avg_humidity,
            device_id: mqttData.device_id,
        };
        fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        })
          .then(res => res.json())
          .then(response => {
            console.log('Backend API response:', response);
          })
          .catch(error => {
            console.error('Error posting to backend:', error);
          });
      } catch (err) {
        console.error('Failed to parse MQTT message JSON', err);
      }
    });
    client.on('error', (err) => {
      console.error('MQTT Client Error:', err);
      client.end();
    });
    client.on('reconnect', () => {
      console.log('MQTT reconnecting...');
    });
    return () => {
      client.end();
    };
  }, []);
  return null;
};
export default MqttSubscriber;