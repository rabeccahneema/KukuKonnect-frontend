export interface UserType {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  user_type: string;
  image: string | null;
  mcu_device_id: string;
}