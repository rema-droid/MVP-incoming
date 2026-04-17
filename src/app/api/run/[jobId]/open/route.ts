import { NextResponse } from "next/server";
import { getRunJobTarget } from "../../store";
import { proxyRequest } from "@/lib/proxy";

async function handleProxy(request: Request, context: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await context.params;
  const target = await getRunJobTarget(jobId);
  if (!target) {
    return NextResponse.json({ error: "Runtime not ready" }, { status: 409 });
  }

  return proxyRequest(request, target.targetOrigin);
}

export async function GET(request: Request, context: { params: Promise<{ jobId: string }> }) {
  return handleProxy(request, context);
}

export async function POST(request: Request, context: { params: Promise<{ jobId: string }> }) {
  return handleProxy(request, context);
}

export async function PUT(request: Request, context: { params: Promise<{ jobId: string }> }) {
  return handleProxy(request, context);
}

export async function PATCH(request: Request, context: { params: Promise<{ jobId: string }> }) {
  return handleProxy(request, context);
}

export async function DELETE(request: Request, context: { params: Promise<{ jobId: string }> }) {
  return handleProxy(request, context);
}

export async function OPTIONS(request: Request, context: { params: Promise<{ jobId: string }> }) {
  return handleProxy(request, context);
}
