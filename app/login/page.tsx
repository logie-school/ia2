import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import { Navbar } from '@/components/nav-bar'

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <Navbar bgColor='#fff'/>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs mt-[89px]">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/heron.jpeg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <a href="/admin-login" className="bottom-1 left-2 absolute opacity-30 text-s">Admin Page</a>
    </div>
  )
}
