import { NextResponse } from "next/server";

/**
 * Secures requests forwarded to untrusted sandbox runtimes by:
 * 1. Stripping credentials (cookie, authorization, proxy-authorization) to prevent information disclosure.
 * 2. Deleting set-cookie in upstream responses to prevent session hijacking and cookie tossing.
 */
export async function proxyRequest(
  request: Request,
  targetOrigin: string,
  extraPath = ""
): Promise<Response> {
  const incoming = new URL(request.url);
  const upstream = new URL(extraPath || "/", targetOrigin);
  upstream.search = incoming.search;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");

  // Security: Prevent passing credentials to untrusted runtimes
  headers.delete("cookie");
  headers.delete("authorization");
  headers.delete("proxy-authorization");

  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer();

  const response = await fetch(upstream, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });

  const outHeaders = new Headers(response.headers);
  outHeaders.delete("content-encoding");
  outHeaders.delete("content-length");

  // Security: Prevent untrusted runtimes from tossing cookies / hijacking user sessions
  outHeaders.delete("set-cookie");
  outHeaders.set("x-os-layer-proxy", "run-cloud");

  return new NextResponse(response.body, { status: response.status, headers: outHeaders });
}
