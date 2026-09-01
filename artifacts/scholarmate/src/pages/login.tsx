import { SignIn } from "@clerk/react"

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "")

export default function Login() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-muted/20 px-4 py-10 flex items-center justify-center">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  )
}