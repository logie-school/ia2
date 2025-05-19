import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "dev";

// Get all potential students for the logged-in user
export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "No token." }, { status: 401 });

    let decoded: any;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch {
      return NextResponse.json({ message: "Invalid token." }, { status: 401 });
    }

    const students = await prisma.potential_students.findMany({
      where: { guardian_id: decoded.userId },
      orderBy: { created: "desc" },
    });

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch students." }, { status: 500 });
  }
}

// Add a new potential student
export async function POST(req: Request) {
  try {
    const { email, fn, mn, sn, dob, year_level } = await req.json();
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "No token." }, { status: 401 });

    let decoded: any;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch {
      return NextResponse.json({ message: "Invalid token." }, { status: 401 });
    }

    if (!email || !fn || !sn || !dob || !year_level) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // Check if guardian exists
    const guardian = await prisma.users.findUnique({ where: { user_id: decoded.userId } });
    if (!guardian) {
      return NextResponse.json({ message: "Guardian user not found." }, { status: 400 });
    }

    // Check if email is already in users table
    const userExists = await prisma.users.findUnique({ where: { user_email: email } });
    if (userExists) {
      return NextResponse.json({ message: "A user with this email already exists." }, { status: 400 });
    }

    // Check if student already exists by email in potential_students
    const exists = await prisma.potential_students.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ message: "A student with this email already exists." }, { status: 400 });
    }

    const student = await prisma.potential_students.create({
      data: {
        email,
        fn,
        mn,
        sn,
        dob: new Date(dob),
        year_level: Number(year_level),
        guardian_id: decoded.userId,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("Potential student POST error:", error);
    return NextResponse.json({ message: "Failed to add student." }, { status: 500 });
  }
}

// Delete a potential student
export async function DELETE(req: Request) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "No token." }, { status: 401 });

    let decoded: any;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch {
      return NextResponse.json({ message: "Invalid token." }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) return NextResponse.json({ message: "Student ID required." }, { status: 400 });

    // Only allow deleting your own students
    const student = await prisma.potential_students.findUnique({ where: { id } });
    if (!student || student.guardian_id !== decoded.userId) {
      return NextResponse.json({ message: "Not found or not allowed." }, { status: 404 });
    }

    // Delete all enrolments for this student before deleting the student
    await prisma.enrol.deleteMany({ where: { potential_students_id: id } });

    await prisma.potential_students.delete({ where: { id } });
    return NextResponse.json({ message: "Student deleted." }, { status: 200 });
  } catch (error) {
    console.error("Potential student DELETE error:", error);
    return NextResponse.json({ message: "Failed to delete student." }, { status: 500 });
  }
}