"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { ArrowRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

export default function EnrolPage() {
  const searchParams = useSearchParams();
  const faculty = searchParams.get("faculty");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [potentialStudents, setPotentialStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [enrolLoading, setEnrolLoading] = useState(false);

  // Add this state to track enrolled students for each course
  const [enrolledStudentIds, setEnrolledStudentIds] = useState<Record<string, string[]>>({});

  // Fetch courses
  useEffect(() => {
    if (faculty) {
      setLoading(true);
      fetch(`/api/courses-by-faculty?faculty=${encodeURIComponent(faculty)}`)
        .then((res) => res.json())
        .then((data) => setCourses(data))
        .finally(() => setLoading(false));
    }
  }, [faculty]);

  // Fetch potential students when dialog opens
  useEffect(() => {
    if (dialogOpen) {
      const token = localStorage.getItem("token");
      if (!token) return;
      fetch("/api/potential-students", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setPotentialStudents(data));
      setSelectedStudent("");
      setSelectedStudents([]);
    }
  }, [dialogOpen]);

  // Fetch enrolled students for a course
  const fetchEnrolledStudents = async (course_id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return [];
    const res = await fetch(`/api/enrolments?course_id=${course_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    // Return array of potential_students_id
    return data.map((e: any) => e.potential_students_id);
  };

  // Add student to list
  const handleAddStudent = () => {
    if (!selectedStudent) return;
    const student = potentialStudents.find((s) => s.id === selectedStudent);
    if (student && !selectedStudents.some((s) => s.id === student.id)) {
      setSelectedStudents((prev) => [...prev, student]);
    }
    setSelectedStudent("");
  };

  // Remove student from list
  const handleRemoveStudent = (id: string) => {
    setSelectedStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Enrol selected students
  const handleEnrol = async (course_id: string) => {
    setEnrolLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in.");
      setEnrolLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/enrol", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_id,
          student_ids: selectedStudents.map((s) => s.id),
        }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Enrolment successful!");
        setDialogOpen(null);
      } else {
        toast.error(result.message || "Failed to enrol.");
      }
    } catch {
      toast.error("Failed to enrol.");
    } finally {
      setEnrolLoading(false);
    }
  };

  return (
    <>
      <Navbar bgColor="#fff" />
      <div className="enrol-wrapper p-6 flex flex-col items-center min-h-screen bg-background">
        <div className="w-full max-w-[800px] mx-auto flex flex-col items-center  pt-[89px]">
          <h1 className="text-2xl font-bold mb-4 text-center">Course Enrolment</h1>
          {faculty && (
            <div className="mb-4">
              <span className="font-semibold">Faculty:</span> {faculty}
            </div>
          )}
          {loading && <div>Loading courses...</div>}
          {!loading && faculty && courses.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="text-muted-foreground">No courses found for "{faculty}", you can find one on the map by clicking on the nodes.</div>
              <a href="/map">
                <Button variant="outline">To Map<ArrowRight/></Button>
              </a>
            </div>
          )}
          {!loading && courses.length > 0 && (
            <ul className="space-y-4 w-full">
              {courses.map((course) => (
                <li
                  key={course.course_id}
                  className="border rounded-xl p-4 bg-muted/50 shadow-sm flex flex-col gap-2"
                >
                  <div className="font-semibold text-lg">{course.course_name}</div>
                  <div className="text-sm opacity-70">{course.course_desc}</div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1 rounded-full font-medium"
                      >
                        Year: {course.year_level}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 border-green-200 px-3 py-1 rounded-full font-medium"
                      >
                        Subject: {course.subject?.name}
                      </Badge>
                      {course.host_user && (
                        <Badge
                          variant="outline"
                          className="bg-purple-100 text-purple-800 border-purple-200 px-3 py-1 rounded-full font-medium"
                        >
                          Teacher: {course.host_user.fn} {course.host_user.sn}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={async () => {
                      // Fetch enrolled students for this course
                      const enrolledIds = await fetchEnrolledStudents(course.course_id);
                      setEnrolledStudentIds((prev) => ({
                        ...prev,
                        [course.course_id]: enrolledIds,
                      }));

                      // Check if user has no students
                      if (potentialStudents.length === 0) {
                        setDialogOpen(course.course_id);
                        return;
                      }

                      // Get all your potential student ids
                      const allPotentialIds = potentialStudents.map((s) => s.id);

                      // Check if all are enrolled
                      const allEnrolled = allPotentialIds.length > 0 &&
                        allPotentialIds.every((id) => enrolledIds.includes(id));

                      if (allEnrolled) {
                        toast.error("All students already enrolled");
                        return;
                      }

                      setDialogOpen(course.course_id);
                    }}
                  >
                    Enrol in {course.course_name}
                  </Button>
                  {/* Enrol Dialog */}
                  <Dialog open={dialogOpen === course.course_id} onOpenChange={(open) => setDialogOpen(open ? course.course_id : null)}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Enrol Students</DialogTitle>
                        {/* Hide description if no students */}
                        {potentialStudents.length > 0 && (
                          <DialogDescription>
                            Select and add students to enrol in <b>{course.course_name}</b>.
                          </DialogDescription>
                        )}
                      </DialogHeader>
                      <div className="flex flex-col gap-4">
                        {potentialStudents.length === 0 ? (
                          <div className="flex flex-col items-center gap-4">
                            <div className="text-muted-foreground">
                              You have no students connected to your account, you can add one by clicking the button below.
                            </div>
                            <a href="/students" className="w-full">
                              <Button variant="outline" className="w-full">Go to Students Page</Button>
                            </a>
                          </div>
                        ) : (
                          <>
                            <div>
                              {potentialStudents.filter((s) => !selectedStudents.some((sel) => sel.id === s.id)).length > 0 && (
                                <div>
                                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select a student" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {potentialStudents
                                        .filter((s) => !selectedStudents.some((sel) => sel.id === s.id))
                                        .map((s) => (
                                          <SelectItem key={s.id} value={s.id}>
                                            {s.fn} {s.mn ? s.mn + " " : ""}{s.sn} ({s.email})
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    className="mt-2 w-full"
                                    variant="secondary"
                                    onClick={handleAddStudent}
                                    disabled={!selectedStudent}
                                  >
                                    Add Student
                                  </Button>
                                </div>
                              )}
                              <div>
                                <div className="font-semibold mb-2">Students to Enrol:</div>
                                {selectedStudents.length === 0 ? (
                                  <div className="text-muted-foreground text-sm">No students selected.</div>
                                ) : (
                                  <ul className="space-y-1">
                                    {selectedStudents.map((s) => (
                                      <li key={s.id} className="flex items-center justify-between border rounded pl-3 pr-1 py-1 bg-muted">
                                        <span>
                                          <span className="font-medium">{s.fn} {s.mn ? s.mn + " " : ""}{s.sn}</span>
                                          <span className="opacity-50 text-sm">{" "}({s.email})</span>
                                        </span>
                                        <Button
                                          variant="ghost"
                                          className="hover:bg-red-500 hover:text-white rounded"
                                          size="icon"
                                          onClick={() => handleRemoveStudent(s.id)}
                                        >
                                          <X/>
                                        </Button>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      {/* Hide footer buttons if no students */}
                      {potentialStudents.length > 0 && (
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setDialogOpen(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleEnrol(course.course_id)}
                            disabled={selectedStudents.length === 0 || enrolLoading}
                          >
                            {enrolLoading ? "Enrolling..." : "Enrol"}
                          </Button>
                        </DialogFooter>
                      )}
                    </DialogContent>
                  </Dialog>
                </li>
              ))}
            </ul>
          )}
          {!faculty && (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="text-muted-foreground">No faculty selected, you can find one on the map by clicking on the nodes.</div>
              <a href="/map">
                <Button variant="outline">To Map<ArrowRight/></Button>
              </a>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
}