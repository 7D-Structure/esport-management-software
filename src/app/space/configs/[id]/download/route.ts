import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const config = await prisma.configFile.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!config) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Build a safe .cfg filename from the config name.
  const base = config.name.replace(/[^a-zA-Z0-9._-]/g, "_") || "config";
  const filename = base.toLowerCase().endsWith(".cfg") ? base : `${base}.cfg`;

  return new NextResponse(config.content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
