import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "dev";

export async function POST(req: Request) {
  try {
    const { course_id, course_name, course_desc, host_user_id, year_level, subject_id, offering_date, location, cost, prereq, token } = await req.json();
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

    if (!course_id || !course_name || !course_desc || !host_user_id || !year_level) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    // Check uniqueness
    const exists = await prisma.courses.findUnique({ where: { course_id } });
    if (exists) {
      return NextResponse.json({ message: "Course ID already exists." }, { status: 400 });
    }

    const course = await prisma.courses.create({
      data: {
        course_id,
        course_name,
        course_desc,
        host_user_id,
        year_level: Number(year_level),
        subject_id,
        offering_date,
        location,
        cost: cost ? Number(cost) : undefined,
        prereq,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create course." }, { status: 500 });
  }
}