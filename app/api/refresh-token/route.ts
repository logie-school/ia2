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

    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { message: "Invalid token." },
        { status: 401 }
      );
    }

    // Fetch the latest user data from the database
    const user = await prisma.users.findUnique({
      where: { user_id: decoded.userId },
      select: { user_id: true, user_email: true, role_id: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    // Generate a new token with the updated role
    const newToken = jwt.sign(
      { userId: user.user_id, email: user.user_email, role: user.role_id },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      { message: "Token refreshed successfully.", token: newToken },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}