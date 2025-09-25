const baseUrl = process.env.BASE_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;
    if (!email || !otp) {
      return new Response("Missing required values: email, otp", {
        status: 400,
      });
    }
    const response = await fetch(`${baseUrl}/verify-otp/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp,
      }),
    });
    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 201,
      statusText: "Otp verified successfully",
    });
  } catch (error) {
    return new Response("Failed to verify otp: " + (error as Error).message, {
      status: 500,
    });
  }
}
