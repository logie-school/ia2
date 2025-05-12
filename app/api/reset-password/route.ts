import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, oldPassword, newPassword } = await req.json();

    // Validate input
    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "Email, old password, and new password are required." },
        { status: 400 }
      );
    }

    // Check if the user exists
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

    // Check if the user has authentication data
    if (!user.auth) {
      return NextResponse.json(
        { message: "Account does not have authentication data." },
        { status: 401 }
      );
    }

    // Validate the old password
    const isOldPasswordValid = await bcrypt.compare(
      oldPassword,
      user.auth.pwd_hash
    );

    if (!isOldPasswordValid) {
      return NextResponse.json(
        { message: "Old password is incorrect." },
        { status: 401 }
      );
    }

    // Check if the new password is the same as the old password
    const isSamePassword = await bcrypt.compare(newPassword, user.auth.pwd_hash);

    if (isSamePassword) {
      return NextResponse.json(
        { message: "New password cannot be the same as the old password." },
        { status: 400 }
      );
    }

    // Validate new password requirements
    const passwordRequirements = {
      minLength: newPassword.length >= 8,
      hasUppercase: /[A-Z]/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
    };

    if (!Object.values(passwordRequirements).every(Boolean)) {
      return NextResponse.json(
        { message: "New password does not meet the requirements." },
        { status: 400 }
      );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    await prisma.auth.update({
      where: { user_id: user.user_id },
      data: {
        pwd_hash: hashedPassword,
        pwd_salt: salt,
        last_updated: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Password reset successful." },
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