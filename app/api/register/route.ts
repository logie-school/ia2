import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password, fn, mn, sn } = await req.json();

    if (!email || !password || !fn || !sn) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.users.findUnique({
      where: { user_email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists." },
        { status: 400 }
      );
    }

    const passwordRequirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasNumber: /\d/.test(password),
    };

    if (!Object.values(passwordRequirements).every(Boolean)) {
      return NextResponse.json(
        { message: "Password does not meet the requirements." },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.users.create({
      data: {
        user_id: crypto.randomUUID(),
        user_email: email,
        created: new Date(),
        fn,
        mn,
        sn,
        role_id: 5, // Enforce role_id = 5 (user)
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
      { message: "User registered successfully.", user: newUser },
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