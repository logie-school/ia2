import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "dev";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { message: "Token is required." },
        { status: 400 }
      );
    }

    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { message: "Invalid token." },
        { status: 401 }
      );
    }

    // Fetch the user's role
    const user = await prisma.staff.findFirst({
      where: { user_id: decoded.userId },
      select: { role_id: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ role_id: user.role_id }, { status: 200 });
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}