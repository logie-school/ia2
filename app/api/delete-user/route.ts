import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "dev";

export async function POST(req: Request) {
  try {
    const { token, user_id } = await req.json();

    if (!token || !user_id) {
      return NextResponse.json(
        { message: "Token and user_id are required." },
        { status: 400 }
      );
    }

    // Verify the token
    let decoded: any;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    // Only allow users with role_id <= 3 (principal, admin, hod)
    if (!decoded.role || decoded.role > 3) {
      return NextResponse.json(
        { message: "Insufficient permissions." },
        { status: 403 }
      );
    }

    // Check if the user exists
    const user = await prisma.users.findUnique({
      where: { user_id },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    // Delete related records first (order matters!)
    await prisma.enrol.deleteMany({ where: { user_id } });
    await prisma.courses.deleteMany({ where: { host_user_id: user_id } });
    await prisma.subjects.deleteMany({ where: { hod_user_id: user_id } });
    await prisma.auth.deleteMany({ where: { user_id } });

    // Now delete the user
    await prisma.users.delete({
      where: { user_id },
    });

    return NextResponse.json(
      { message: "User deleted successfully." },
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