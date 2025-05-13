import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "dev";

export async function POST(req: Request) {
  try {
    const { subject_id, name, faculty, hod_user_id, token } = await req.json();
    if (!token) return NextResponse.json({ message: "No token." }, { status: 401 });

    let decoded: any;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch {
      return NextResponse.json({ message: "Invalid token." }, { status: 401 });
    }
    if (!decoded.role || decoded.role > 3) {
      return NextResponse.json({ message: "Permission denied." }, { status: 403 });
    }

    if (!subject_id || !name || !hod_user_id) {
      return NextResponse.json({ message: "Subject ID, Name and HOD required." }, { status: 400 });
    }

    if (typeof subject_id !== "string" || subject_id.length !== 3 || !/^[A-Z]{3}$/.test(subject_id)) {
      return NextResponse.json({ message: "Subject ID must be exactly 3 uppercase letters." }, { status: 400 });
    }

    // Check uniqueness
    const exists = await prisma.subjects.findUnique({ where: { subject_id } });
    if (exists) {
      return NextResponse.json({ message: "Subject ID already exists." }, { status: 400 });
    }

    const subject = await prisma.subjects.create({
      data: {
        subject_id,
        name,
        faculty,
        hod_user_id,
      },
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create subject." }, { status: 500 });
  }
}