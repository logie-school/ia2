import { RegisterForm } from "@/components/register-form";
import { Navbar } from "@/components/nav-bar";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Navbar bgColor="#fff" />
      <div className="w-full max-w-sm md:max-w-3xl pt-[89px]">
        <RegisterForm />
      </div>
    </div>
  );
}
