import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.users.findUnique({
      where: { user_email: email },
      include: { auth: true },
    });

    if (!user || !user.auth) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.auth.pwd_hash);

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    // If login is successful, return a success response
    return NextResponse.json({ message: "Login successful." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}