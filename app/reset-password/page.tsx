import { GalleryVerticalEnd } from "lucide-react"
import { ResetPasswordForm } from "@/components/reset-password-form"
import { Navbar } from "@/components/nav-bar"
export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <Navbar bgColor="#fff" />
      <div className="flex w-full max-w-sm flex-col gap-6 pt-[89px]">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          Sunshine Beach State High School
        </a>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
