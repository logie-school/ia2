// imports
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "dev";

// handles POST request to /api/admin-login
export async function POST(req: Request) {
  try {
    // parse email and password from request body
    const { email, password } = await req.json();

    // return error if email or password is missing
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    // find user by email and include auth info
    const user = await prisma.users.findUnique({
      where: { user_email: email },
      include: { auth: true },
    });

    // deny if user not found or role is above admin
    if (!user || user.role_id > 3) {
      return NextResponse.json(
        { message: "Insufficient permissions." },
        { status: 403 }
      );
    }

    // check password against stored hash
    const isPasswordValid = await bcrypt.compare(password, user.auth?.pwd_hash || "");

    // deny if password is invalid
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password." },
        { status: 401 }
      );
    }

    // create jwt token
    const token = jwt.sign(
      { userId: user.user_id, email: user.user_email, role: user.role_id },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // return token and email
    return NextResponse.json(
      { message: "Login successful.", token, email: user.user_email },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    // return server error
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
