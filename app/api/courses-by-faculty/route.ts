import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const faculty = searchParams.get("faculty");

  if (!faculty) {
    return NextResponse.json({ message: "Faculty is required." }, { status: 400 });
  }

  // Remove mode: "insensitive" for SQLite/MySQL compatibility
  const courses = await prisma.courses.findMany({
    where: {
      subject: {
        faculty: {
          equals: faculty, // SQLite string comparison is case-insensitive by default
        },
      },
    },
    include: {
      subject: true,
      host_user: { select: { fn: true, sn: true } },
    },
  });

  console.log("Courses for faculty:", faculty, courses);

  return NextResponse.json(courses, { status: 200 });
}