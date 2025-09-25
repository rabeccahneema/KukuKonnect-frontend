const baseurl = '/api/users';

export async function deleteUser(userId: number) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await fetch(`${baseurl}/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Something went wrong: ' + response.statusText);
    }

    return { message: "User deleted successfully" };
  } catch (error) {
    throw new Error("Failed to delete user: " + (error as Error).message);
  }
}