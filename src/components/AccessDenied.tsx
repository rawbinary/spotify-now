import { signIn } from "next-auth/react"
import Link from "next/link"

export default function AccessDenied() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-center text-3xl">Access Denied!</h1>
      <p className="text-center mt-5">
        <Link
          href="/api/auth/signin"
          onClick={(e) => {
            e.preventDefault()
            void signIn()
          }}
        >
          You must be signed in to view this page.
        </Link>
      </p>
    </div>
  )
}
