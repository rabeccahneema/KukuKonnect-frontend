const baseUrl = "/api/reset_password";

export async function resetPassword(email:string,password:string) {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email,password}),
    });
    let result;
    try {
      result = await response.json();
    } catch {
      result = null;
    }
    if (!response.ok) {
      return result || { error: response.statusText };
    }
    return result;
  } catch (error) {
    return { error: (error as Error).message };
  }
}





