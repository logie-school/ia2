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

    // Check if the user already exists
    const existingUser = await prisma.users.findUnique({
      where: { user_email: email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists." }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    await prisma.users.create({
      data: {
        user_id: crypto.randomUUID(),
        user_email: email,
        created: new Date(),
        auth: {
          create: {
            pwd_hash: hashedPassword,
            pwd_salt: salt,
            last_updated: new Date(),
          },
        },
      },
    });

    return NextResponse.json({ message: "User registered successfully." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}