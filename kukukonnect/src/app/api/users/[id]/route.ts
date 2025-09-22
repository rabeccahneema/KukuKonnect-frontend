const baseurl = process.env.BASE_URL;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {

  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const response = await fetch(`${baseurl}/users/${id}/`, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
    });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { id } = await params;

    const response = await fetch(`${baseurl}/users/${id}/`, {
      method: "PUT",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
    });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const response = await fetch(`${baseurl}/users/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    return new Response("User deleted successfully", {
      status: 200,
    });
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
    });
  }
}