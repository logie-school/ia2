"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { ArrowRight } from "lucide-react";

export default function EnrolPage() {
  const searchParams = useSearchParams();
  const faculty = searchParams.get("faculty");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (faculty) {
      setLoading(true);
      fetch(`/api/courses-by-faculty?faculty=${encodeURIComponent(faculty)}`)
        .then((res) => res.json())
        .then((data) => setCourses(data))
        .finally(() => setLoading(false));
    }
  }, [faculty]);

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
                  <Button variant="outline" className="mt-2">Enrol in {course.course_name}</Button>
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