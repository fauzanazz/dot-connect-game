import { Poppins } from "next/font/google";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/auth/login-button";
import {RegisterButton} from "@/components/auth/register-button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["700"]
})


export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500 to-blue-800">
      <div className="flex flex-col text-center gap-y-6">
        <h1 className={cn("text-6xl font-semibold text-white drop-shadow-md", font.className,)}>
          Dot Connect Game
        </h1>
        <p className="text-2xl text-white">
          Task IRK
        </p>
        <div className="flex w-full justify-center gap-x-3">
          <LoginButton>
            <Button variant="secondary" size="lg">
              Load Game
            </Button>
          </LoginButton>
          <RegisterButton>
            <Button variant="secondary" size="lg">
              Register
            </Button>
          </RegisterButton>
        </div>
      </div>
    </main>
  )
}
