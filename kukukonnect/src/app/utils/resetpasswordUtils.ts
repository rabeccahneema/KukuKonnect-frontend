const baseUrl = "/api/reset_password";

export async function resetPassword(email:string,password:string) {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email,password}),
    });
    if (!response.ok) {
      throw new Error("Resetting password failed: " + response.statusText);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Failed to reset password: " + (error as Error).message);
  }
}





