import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all courses with host user and subject info
export async function GET() {
  try {
    const courses = await prisma.courses.findMany({
      include: {
        host_user: { select: { fn: true, sn: true } },
        subject: { select: { name: true } },
      },
    });
    const result = courses.map((c) => ({
      course_id: c.course_id,
      course_name: c.course_name,
      course_desc: c.course_desc,
      host_user_id: c.host_user_id,
      host_user_name: c.host_user ? `${c.host_user.fn} ${c.host_user.sn}` : "",
      year_level: c.year_level,
      subject_id: c.subject_id,
      subject_name: c.subject?.name || "",
      offering_date: c.offering_date,
      location: c.location,
      cost: c.cost,
      prereq: c.prereq,
    }));
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch courses." }, { status: 500 });
  }
}