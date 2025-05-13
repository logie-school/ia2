import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "dev";

export async function POST(req: Request) {
  try {
    const { token, email, password, fn, mn, sn, role_id } = await req.json();

    // Validate input
    if (!token || !email || !password || !fn || !sn || !role_id) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Verify the admin's token
    let decoded: any;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    // Only allow users with role_id <= 3 (hod or higher)
    if (!decoded.role || decoded.role > 3) {
      return NextResponse.json(
        { message: "Insufficient permissions." },
        { status: 403 }
      );
    }

    // Check if the email is already registered
    const existingUser = await prisma.users.findUnique({
      where: { user_email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists." },
        { status: 400 }
      );
    }

    // Validate password requirements
    const passwordRequirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasNumber: /\d/.test(password),
    };

    let passwordWarning = "";
    if (!Object.values(passwordRequirements).every(Boolean)) {
      passwordWarning = "Warning: Password does not meet security requirements.";
      // Continue registration anyway
    }

    // Validate role_id exists in the role table
    const roleExists = await prisma.role.findUnique({
      where: { id: role_id },
    });
    if (!roleExists) {
      return NextResponse.json(
        { message: "Invalid role_id." },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const newUser = await prisma.users.create({
      data: {
        user_id: crypto.randomUUID(),
        user_email: email,
        created: new Date(),
        fn,
        mn,
        sn,
        role_id,
        auth: {
          create: {
            pwd_hash: hashedPassword,
            pwd_salt: salt,
            last_updated: new Date(),
          },
        },
      },
    });

    return NextResponse.json(
      { 
        message: passwordWarning
          ? "User registered, but password is not secure. " + passwordWarning
          : "User registered successfully.",
        user: newUser,
        passwordWarning: passwordWarning || undefined
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}