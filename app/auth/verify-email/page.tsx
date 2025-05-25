"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, MailCheck, AlertCircle } from "lucide-react"
import Link from "next/link"
import { AuthService } from "@/lib/supabase/auth"

type Status = "loading" | "success" | "error" | "idle"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<Status>("loading")
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const type = searchParams.get("type")
  const email = searchParams.get("email")

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (type === "signup" && email) {
          // Para el flujo de registro, ya manejamos la verificación en el registro
          setStatus("success")
          return
        }

        if (token) {
          // Para el flujo de verificación de correo estándar
          await AuthService.verifyEmail(token)
          setStatus("success")
        } else {
          setStatus("idle")
        }
      } catch (err: any) {
        console.error("Email verification error:", err)
        setError(err.message || "Failed to verify email. Please try again.")
        setStatus("error")
      }
    }

    verifyEmail()
  }, [token, type, email])

  const resendVerification = async () => {
    if (!email) return
    
    try {
      setIsSending(true)
      await AuthService.resendVerificationEmail(email)
      setStatus("success")
    } catch (err: any) {
      console.error("Failed to resend verification email:", err)
      setError(err.message || "Failed to resend verification email. Please try again.")
      setStatus("error")
    } finally {
      setIsSending(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Verifying your email</CardTitle>
            <CardDescription className="text-center">
              Please wait while we verify your email address...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <MailCheck className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="mt-4">Email Verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified. You can now sign in to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="mt-4 text-center">Verification Failed</CardTitle>
            <CardDescription className="text-center">
              {error || "There was an error verifying your email address."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {email && (
              <Button 
                onClick={resendVerification}
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend Verification Email"
                )}
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/auth/login">Back to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Estado idle - sin token
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            Please check your email for a verification link. If you didn't receive an email, click the button below to resend.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {email && (
            <Button 
              onClick={resendVerification}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend Verification Email"
              )}
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href="/auth/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
