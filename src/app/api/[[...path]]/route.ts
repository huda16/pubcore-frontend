import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

async function proxyRequest(req: NextRequest) {
  try {
    // Get the path from the URL
    const pathname = req.nextUrl.pathname;
    const searchParams = req.nextUrl.searchParams.toString();

    // Remove /api prefix from the path
    const apiPath = pathname.replace(/^\/api/, "");

    // Construct the backend URL
    const backendUrl = `${BACKEND_URL}${apiPath}${searchParams ? `?${searchParams}` : ""}`;

    // Get the request headers and body
    const headers = new Headers();

    // Copy relevant headers from the original request
    const headersToForward = [
      "authorization",
      "content-type",
      "accept",
      "accept-language",
      "user-agent",
    ];

    for (const header of headersToForward) {
      const value = req.headers.get(header);
      if (value) {
        headers.set(header, value);
      }
    }

    // Prepare the request options
    const requestOptions: RequestInit = {
      method: req.method,
      headers,
    };

    // Add body for non-GET requests
    if (req.method !== "GET" && req.method !== "HEAD") {
      const body = await req.text();
      if (body) {
        requestOptions.body = body;
      }
    }

    // Make the request to the backend
    const response = await fetch(backendUrl, requestOptions);

    // Get the response body
    const responseBody = await response.text();

    // Create the response with CORS headers
    const proxyResponse = new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
    });

    // Copy response headers
    for (const [key, value] of response.headers.entries()) {
      proxyResponse.headers.set(key, value);
    }

    // Add CORS headers to allow requests from the frontend
    proxyResponse.headers.set("Access-Control-Allow-Credentials", "true");
    proxyResponse.headers.set("Access-Control-Allow-Origin", "*");
    proxyResponse.headers.set(
      "Access-Control-Allow-Methods",
      "GET, DELETE, PATCH, POST, PUT, OPTIONS",
    );
    proxyResponse.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );

    return proxyResponse;
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Backend request failed" },
      { status: 500 },
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
export const HEAD = proxyRequest;
export const OPTIONS = proxyRequest;
