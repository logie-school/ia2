export const dynamic = "force-static";

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      include: {
        role: true,
      },
    });

    const formattedUsers = users.map((user) => ({
      user_id: user.user_id,
      user_email: user.user_email,
      created: user.created.toISOString(),
      fn: user.fn,
      mn: user.mn,
      sn: user.sn,
      role: user.role.name,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}