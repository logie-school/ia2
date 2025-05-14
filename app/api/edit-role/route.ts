import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "dev";

export async function POST(req: Request) {
  try {
    const { token, user_id, new_role } = await req.json();

    if (!token || !user_id || !new_role) {
      return NextResponse.json(
        { message: "Token, user_id, and new_role are required." },
        { status: 400 }
      );
    }

    // Verify token and permissions
    let decoded: any;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    // Only Principal (1) or Admin (2) can edit roles
    if (!decoded.role || decoded.role > 2) {
      return NextResponse.json(
        { message: "Insufficient permissions." },
        { status: 403 }
      );
    }

    // Prevent self-demotion (optional, but recommended)
    if (decoded.userId === user_id) {
      return NextResponse.json(
        { message: "You cannot change your own role." },
        { status: 400 }
      );
    }

    // Defensive: check new_role is a valid integer
    const roleId = Number(new_role);
    if (isNaN(roleId) || roleId < 1 || roleId > 5) {
      return NextResponse.json(
        { message: "Invalid role id." },
        { status: 400 }
      );
    }

    // Update the user's role using the relation field
    const updated = await prisma.users.update({
      where: { user_id },
      data: {
        role: {
          connect: { id: roleId }
        }
      },
    });

    return NextResponse.json(
      { message: "Role updated successfully.", user: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}