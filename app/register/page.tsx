import { LoginForm } from "@/components/register-form"
import { Navbar } from "@/components/nav-bar"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Navbar bgColor="#fff" />
      <div className="w-full max-w-sm md:max-w-3xl pt-[89px]">
        <LoginForm />
      </div>
    </div>
  )
}
