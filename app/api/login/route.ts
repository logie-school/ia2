import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "dev";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.users.findUnique({
      where: { user_email: email },
      include: { auth: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Account does not exist." },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.auth?.pwd_hash || "");

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password." },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user.user_id, email: user.user_email, role: user.role_id },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      { message: "Login successful.", token, email: user.user_email },
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