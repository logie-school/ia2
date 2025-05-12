import { AdminLoginForm } from "@/components/admin-login"
import { Navbar } from "@/components/nav-bar"
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <Navbar/>
      <div className="w-full max-w-sm pt-[89px]">
        <AdminLoginForm />
      </div>
    </div>
  )
}