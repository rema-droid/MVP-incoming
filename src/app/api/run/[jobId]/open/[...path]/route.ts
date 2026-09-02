import { NextResponse } from "next/server";

import { getRunJobTarget } from "../../../store";

async function proxy(request: Request, context: { params: Promise<{ jobId: string; path: string[] }> }) {
  const { jobId, path } = await context.params;
  const target = await getRunJobTarget(jobId);
  if (!target) {
    return NextResponse.json({ error: "Runtime not ready" }, { status: 409 });
  }

  const rawSegments = path || [];
  const isValidPath = rawSegments.every((segment) => {
    if (!segment || segment === "." || segment === "..") return false;
    if (segment.includes("\\") || segment.includes("\0")) return false;
    try {
      const decoded = decodeURIComponent(segment);
      if (decoded === "." || decoded === ".." || decoded.includes("/") || decoded.includes("\\") || decoded.includes("\0")) {
        return false;
      }
    } catch {
      return false;
    }
    return true;
  });

  if (!isValidPath) {
    return NextResponse.json({ error: "Invalid path parameter" }, { status: 400 });
  }

  const incoming = new URL(request.url);
  const upstreamPath = `/${rawSegments.join("/")}`;
  const upstream = new URL(upstreamPath, target.targetOrigin);
  upstream.search = incoming.search;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");

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
