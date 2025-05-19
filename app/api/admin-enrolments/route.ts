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

    // Only allow admin, principal, hod
    if (!decoded.role || decoded.role > 3) {
      return NextResponse.json({ message: "Permission denied." }, { status: 403 });
    }

    const enrolments = await prisma.enrol.findMany({
      include: {
        course: {
          select: {
            course_name: true,
          },
        },
        potential_student: {
          select: {
            fn: true,
            sn: true,
            email: true,
            guardian_id: true,
            dob: true, // Ensure dob is fetched
            year_level: true, // Fetch year_level
          },
        },
      },
    });

    // Map enrolments to include guardian email
    const enrichedEnrolments = await Promise.all(
      enrolments.map(async (enrolment) => {
        const guardian = await prisma.users.findUnique({
          where: { user_id: enrolment.potential_student?.guardian_id },
          select: { user_email: true },
        });

        return {
          enrol_id: enrolment.enrol_id,
          course_name: enrolment.course?.course_name,
          student_name: `${enrolment.potential_student?.fn} ${enrolment.potential_student?.sn}`,
          student_email: enrolment.potential_student?.email,
          guardian_email: guardian?.user_email || "N/A",
          year_level: enrolment.potential_student?.year_level || "N/A",
          dob: enrolment.potential_student?.dob
            ? new Date(enrolment.potential_student.dob).toLocaleDateString()
            : "N/A",
          enrolled_at: enrolment.enrolled_at
            ? new Date(enrolment.enrolled_at).toISOString()
            : null,
        };
      })
    );

    return new Response(JSON.stringify(enrichedEnrolments), { status: 200 });
  } catch (error) {
    console.error("Error fetching enrolments:", error);
    return new Response("Failed to fetch enrolments", { status: 500 });
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

    // Only allow admin, principal, hod
    if (!decoded.role || decoded.role > 3) {
      return NextResponse.json({ message: "Permission denied." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const enrolId = searchParams.get("enrol_id");

    if (!enrolId) {
      return NextResponse.json({ message: "Enrolment ID is required" }, { status: 400 });
    }

    await prisma.enrol.delete({
      where: { enrol_id: enrolId },
    });

    return NextResponse.json({ message: "Enrolment deleted successfully" });
  } catch (error) {
    console.error("Error deleting enrolment:", error);
    return NextResponse.json(
      { message: "Failed to delete enrolment" },
      { status: 500 }
    );
  }
}