const baseUrl = process.env.BASE_URL;
export async function GET(){
    try{
        const response = await fetch(`${baseUrl}/users/`);
        const result = await response.json();
        return new Response(JSON.stringify(result), {
            status: 200,
        });
    }
  catch (error) {
  return new Response((error as Error).message, {
    status: 500,
  });
}
}

export async function POST(request: Request) {
  const body = await request.json();
  const { username, first_name, last_name, phone_number, email, device_id,user_type } = body;
  if (!username || !first_name || !last_name || !phone_number || !email || !device_id||!user_type) {
    return new Response("Missing required values: username,first_name,phone_number,email,device_id", {
      status: 400
    });
  }
  try {
    const response = await fetch(`${baseUrl}/users/`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, first_name, last_name, phone_number, email, device_id,user_type }),
    });
    const result = await response.json();
    
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}



