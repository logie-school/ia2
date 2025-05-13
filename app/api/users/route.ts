export const dynamic = "force-static";

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role_id = searchParams.get("role_id");

    let users;
    if (role_id) {
      // Only return user_id, fn, sn for HOD dropdowns
      users = await prisma.users.findMany({
        where: { role_id: Number(role_id) },
        select: { user_id: true, fn: true, sn: true },
      });
    } else {
      users = await prisma.users.findMany({
        include: {
          role: true,
        },
      });

      users = users.map((user) => ({
        user_id: user.user_id,
        user_email: user.user_email,
        created: user.created.toISOString(),
        fn: user.fn,
        mn: user.mn,
        sn: user.sn,
        role: user.role.name,
      }));
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}