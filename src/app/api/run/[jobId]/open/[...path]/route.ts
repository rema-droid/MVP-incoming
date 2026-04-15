import { NextResponse } from "next/server";

import { getRunJobTarget } from "../../../store";

async function proxy(request: Request, context: { params: Promise<{ jobId: string; path: string[] }> }) {
  const { jobId, path } = await context.params;
  const target = await getRunJobTarget(jobId);
  if (!target) {
    return NextResponse.json({ error: "Runtime not ready" }, { status: 409 });
  }

  const incoming = new URL(request.url);
  const upstreamPath = `/${(path || []).join("/")}`;
  const upstream = new URL(upstreamPath, target.targetOrigin);
  upstream.search = incoming.search;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  // Security: Strip sensitive headers from incoming request
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
  // Security: Prevent proxied app from setting cookies on our domain
  outHeaders.delete("set-cookie");
  outHeaders.set("x-os-layer-proxy", "run-cloud");
  return new NextResponse(response.body, { status: response.status, headers: outHeaders });
}

export async function GET(request: Request, context: { params: Promise<{ jobId: string; path: string[] }> }) {
  return proxy(request, context);
}

export async function POST(request: Request, context: { params: Promise<{ jobId: string; path: string[] }> }) {
  return proxy(request, context);
}

export async function PUT(request: Request, context: { params: Promise<{ jobId: string; path: string[] }> }) {
  return proxy(request, context);
}

export async function PATCH(request: Request, context: { params: Promise<{ jobId: string; path: string[] }> }) {
  return proxy(request, context);
}

export async function DELETE(request: Request, context: { params: Promise<{ jobId: string; path: string[] }> }) {
  return proxy(request, context);
}

export async function OPTIONS(request: Request, context: { params: Promise<{ jobId: string; path: string[] }> }) {
  return proxy(request, context);
}
