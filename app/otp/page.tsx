import { OTPForm } from "@/components/otp-form"
import { Suspense } from "react"

export default function OTPPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xs">
        <Suspense fallback={<div className="text-center">Chargement...</div>}>
          <OTPForm />
        </Suspense>
      </div>
    </div>
  )
}
