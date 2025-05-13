import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "dev";

export async function POST(req: Request) {
  try {
    const { course_id, token } = await req.json();
    if (!token) return NextResponse.json({ message: "No token." }, { status: 401 });

    let decoded: any;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch {
      return NextResponse.json({ message: "Invalid token." }, { status: 401 });
    }
    if (!decoded.role || decoded.role > 3) {
      return NextResponse.json({ message: "Permission denied." }, { status:403 });
    }

    if (!course_id) {
      return NextResponse.json({ message: "Course ID required." }, { status: 400 });
    }

    // Delete related enrolments first
    await prisma.enrol.deleteMany({ where: { course_id } });

    await prisma.courses.delete({
      where: { course_id },
    });

    return NextResponse.json({ message: "Course deleted." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete course." }, { status: 500 });
  }
}