import { NextResponse } from "next/server";

export async function proxyRequest(
  request: Request,
  targetOrigin: string,
  extraPath = ""
) {
  const incoming = new URL(request.url);
  const upstream = new URL(extraPath || "/", targetOrigin);
  upstream.search = incoming.search;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  // Security: Do not forward sensitive client credentials to the untrusted sandbox
  headers.delete("cookie");
  headers.delete("authorization");
  headers.delete("proxy-authorization");

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  const response = await fetch(upstream, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });

  const outHeaders = new Headers(response.headers);
  outHeaders.delete("content-encoding");
  outHeaders.delete("content-length");
  // Security: Prevent the untrusted sandbox from setting cookies on our domain
  outHeaders.delete("set-cookie");
  outHeaders.set("x-os-layer-proxy", "run-cloud");

  return new NextResponse(response.body, {
    status: response.status,
    headers: outHeaders,
  });
}
