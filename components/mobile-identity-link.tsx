"use client"

import { FormEvent, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { normalizeIndianPhone } from "@/lib/phone"

export function MobileIdentityLink({ currentPhone }: { currentPhone?: string | null }) {
  const [phone, setPhone] = useState(currentPhone ?? "")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function requestVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setMessage("")
    const normalized = normalizeIndianPhone(phone)
    if (!normalized) {
      setError("Enter a valid 10-digit Indian mobile number.")
      return
    }

    setBusy(true)
    const { error: updateError } = await createClient().auth.updateUser({ phone: normalized })
    setBusy(false)
    if (updateError) {
      setError(
        updateError.message.toLowerCase().includes("already")
          ? "That mobile number is already linked to another account."
          : "Supabase could not start mobile verification. Confirm that phone auth and an SMS provider are enabled.",
      )
      return
    }
    setStep("otp")
    setMessage("Verification code sent. Enter the code from the SMS to finish linking this account.")
  }

  async function verifyPhone(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setMessage("")
    const normalized = normalizeIndianPhone(phone)
    if (!normalized || !/^\d{6}$/.test(otp.trim())) {
      setError("Enter the 6-digit verification code from the SMS.")
      return
    }

    setBusy(true)
    const { error: verifyError } = await createClient().auth.verifyOtp({
      phone: normalized,
      token: otp.trim(),
      type: "phone_change",
    })
    setBusy(false)
    if (verifyError) {
      setError("The verification code was not accepted. Request a new code and try again.")
      return
    }
    setMessage("Mobile number verified and linked to this existing BBBT account.")
    setStep("phone")
    setOtp("")
  }

  return (
    <section className="auth-card" aria-labelledby="mobile-link-title">
      <span className="eyebrow">ACCOUNT SECURITY / MOBILE</span>
      <h1 id="mobile-link-title">Link a verified mobile</h1>
      <p className="auth-lede">
        Add a mobile number to this account. Supabase will verify ownership by SMS; an unverified BBBT identity record cannot authenticate you.
      </p>
      <form onSubmit={step === "phone" ? requestVerification : verifyPhone} className="auth-form">
        <label htmlFor="mobile-link-phone">Indian mobile number</label>
        <input
          id="mobile-link-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+91 99909 61022"
          disabled={busy || step === "otp"}
        />
        {step === "otp" && (
          <>
            <label htmlFor="mobile-link-otp">SMS verification code</label>
            <input
              id="mobile-link-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              disabled={busy}
            />
          </>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
        {message && <p className="form-success" role="status">{message}</p>}
        <button className="btn btn-cyan" type="submit" disabled={busy}>
          {busy ? "PLEASE WAIT" : step === "phone" ? "SEND VERIFICATION CODE" : "VERIFY MOBILE"}
        </button>
        {step === "otp" && (
          <button className="btn btn-outline" type="button" onClick={() => { setStep("phone"); setError(""); setMessage("") }} disabled={busy}>
            USE A DIFFERENT NUMBER
          </button>
        )}
      </form>
    </section>
  )
}
