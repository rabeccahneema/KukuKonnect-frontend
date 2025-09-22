const baseUrl = process.env.BASE_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return new Response("Missing required values: email, password", {
        status: 400,
      });
    }
    const response = await fetch(`${baseUrl}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 201,
      statusText: "Login successful",
    });
  } catch (error) {
    return new Response("Failed to login: " + (error as Error).message, {
      status: 500,
    });
  }
}
