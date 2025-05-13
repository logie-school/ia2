import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "dev";

export async function POST(req: Request) {
  try {
    const { subject_id, token } = await req.json();
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

    if (!subject_id) {
      return NextResponse.json({ message: "Subject ID required." }, { status: 400 });
    }

    // Delete related courses first if needed
    await prisma.courses.deleteMany({ where: { subject_id } });

    await prisma.subjects.delete({
      where: { subject_id },
    });

    return NextResponse.json({ message: "Subject deleted." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete subject." }, { status: 500 });
  }
}