import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "dev";

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

    const { searchParams } = new URL(req.url);
    const student_id = searchParams.get("student_id");
    if (!student_id) return NextResponse.json([], { status: 200 });

    // Only allow guardian to see their own student's enrolments
    const student = await prisma.potential_students.findUnique({
      where: { id: student_id },
    });
    if (!student || student.guardian_id !== decoded.userId) {
      return NextResponse.json([], { status: 200 });
    }

    const enrolments = await prisma.enrol.findMany({
      where: { potential_students_id: student_id },
      include: {
        course: { select: { course_id: true, course_name: true } },
      },
      orderBy: { enrolled_at: "desc" },
    });

    const result = enrolments.map((e) => ({
      course_id: e.course.course_id,
      course_name: e.course.course_name,
      enrolled_at: e.enrolled_at,
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

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

    const { student_id, course_id } = await req.json();
    if (!student_id || !course_id) {
      return NextResponse.json({ message: "Student and course required." }, { status: 400 });
    }

    // Only allow the guardian to remove enrolments for their own students
    const student = await prisma.potential_students.findUnique({
      where: { id: student_id },
    });
    if (!student || student.guardian_id !== decoded.userId) {
      return NextResponse.json({ message: "Not allowed." }, { status: 403 });
    }

    await prisma.enrol.deleteMany({
      where: {
        potential_students_id: student_id,
        course_id,
      },
    });

    return NextResponse.json({ message: "Enrolment removed." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to remove enrolment." }, { status: 500 });
  }
}