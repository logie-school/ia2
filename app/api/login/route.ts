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

    // Check if the user exists
    const user = await prisma.users.findUnique({
      where: { user_email: email },
      include: { auth: true },
    });

    if (!user) {
      // Return a specific message if the account doesn't exist
      return NextResponse.json(
        { message: "Account does not exist." },
        { status: 404 }
      );
    }

    // Check if the user has authentication data
    if (!user.auth) {
      return NextResponse.json(
        { message: "Account does not have authentication data." },
        { status: 401 }
      );
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.auth.pwd_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password." },
        { status: 401 }
      );
    }

    // Generate a new token
    const newToken = jwt.sign(
      { userId: user.user_id, email: user.user_email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Update the database with the new token
    await prisma.auth.update({
      where: { user_id: user.user_id },
      data: { refresh_token: newToken, token_expiry: new Date(Date.now() + 60 * 60 * 1000) },
    });

    return NextResponse.json(
      { message: "Login successful.", token: newToken, email: user.user_email },
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