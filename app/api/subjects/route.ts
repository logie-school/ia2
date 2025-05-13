import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all subjects with HOD name
export async function GET() {
  try {
    const subjects = await prisma.subjects.findMany({
      include: {
        hod_user: {
          select: { fn: true, sn: true },
        },
      },
    });
    const result = subjects.map((s) => ({
      subject_id: s.subject_id,
      name: s.name,
      faculty: s.faculty,
      hod_user_id: s.hod_user_id,
      hod_name: s.hod_user ? `${s.hod_user.fn} ${s.hod_user.sn}` : "",
    }));
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch subjects." }, { status: 500 });
  }
}