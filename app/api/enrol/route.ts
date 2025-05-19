import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "dev";

// POST: Enrol one or more potential students in a course
export async function POST(req: Request) {
  try {
    const { course_id, student_ids } = await req.json();
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "No token." }, { status: 401 });

    let decoded: any;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch {
      return NextResponse.json({ message: "Invalid token." }, { status: 401 });
    }

    if (!course_id || !Array.isArray(student_ids) || student_ids.length === 0) {
      return NextResponse.json({ message: "Course and students required." }, { status: 400 });
    }

    // Only allow enrolling your own potential students
    const students = await prisma.potential_students.findMany({
      where: {
        id: { in: student_ids },
        guardian_id: decoded.userId,
      },
    });

    if (students.length !== student_ids.length) {
      return NextResponse.json({ message: "Invalid student selection." }, { status: 400 });
    }

    // Check for already enrolled students
    const alreadyEnrolled = await prisma.enrol.findMany({
      where: {
        course_id,
        potential_students_id: { in: student_ids },
      },
      select: { potential_students_id: true },
    });

    if (alreadyEnrolled.length > 0) {
      // Find the names of already enrolled students
      const alreadyIds = alreadyEnrolled.map((e) => e.potential_students_id);
      const alreadyNames = students
        .filter((s) => alreadyIds.includes(s.id))
        .map((s) => s.fn);

      const msg =
        alreadyNames.length === 1
          ? `${alreadyNames[0]} is already enrolled.`
          : `${alreadyNames.map((n) => n).join(", ")} are already enrolled.`;

      return NextResponse.json({ message: msg }, { status: 400 });
    }

    // Enrol each student
    const created = await Promise.all(
      students.map((student) =>
        prisma.enrol.create({
          data: {
            enrol_id: crypto.randomUUID(),
            course_id,
            potential_students_id: student.id,
            user_id: decoded.userId,
            enrolled_at: new Date(),
          },
        })
      )
    );

    return NextResponse.json({ message: "Enrolment successful.", enrolments: created }, { status: 201 });
  } catch (error) {
    console.error("Enrol POST error:", error);
    return NextResponse.json({ message: "Failed to enrol students." }, { status: 500 });
  }
}

// GET: Retrieve enrolments for potential students in a course
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
    const course_id = searchParams.get("course_id");
    if (!course_id) return NextResponse.json([], { status: 200 });

    // Only return enrolments for this user's potential students
    const enrolments = await prisma.enrol.findMany({
      where: {
        course_id,
        potential_student: {
          guardian_id: decoded.userId,
        },
      },
      select: { potential_students_id: true },
    });

    return NextResponse.json(enrolments, { status: 200 });
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}