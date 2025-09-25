const baseurl = '/api/users';

interface UserUpdateData {
  username?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  user_type?: string;
  device_id?: string;
}

export async function updateUser(userId: number, userData: UserUpdateData, file: File | null) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const formData = new FormData();

    if (userData.username) formData.append('username', userData.username);
    if (userData.first_name) formData.append('first_name', userData.first_name);
    if (userData.last_name) formData.append('last_name', userData.last_name);
    if (userData.phone_number) formData.append('phone_number', userData.phone_number);
    if (userData.email) formData.append('email', userData.email);
    if (userData.user_type) formData.append('user_type', userData.user_type);
    if (userData.device_id) formData.append('device_id', userData.device_id);

    if (file) {
      formData.append('image', file);
    }

    const response = await fetch(`${baseurl}/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData, 
    });

    if (!response.ok) {
      throw new Error('Something went wrong: ' + response.statusText);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Failed to update user: " + (error as Error).message);
  }
}
