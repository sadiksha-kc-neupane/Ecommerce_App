import { useState, useRef, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { forgotPassword, verifyOtp } from "../lib/api.js"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"

export default function Otp() {
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState(location.state?.email || "")
  const [otp, setOtp] = useState(["", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState(null)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [countdown])

  useEffect(() => {
    inputRefs[0].current?.focus()
  }, [])

  // Handle Resend OTP
  async function handleResendCode() {
    if (!email.trim()) {
      setError("Email address is required to resend code.")
      return
    }
    if (!canResend || resendLoading) return
    setError(null)
    setResendLoading(true)
    try {
      const res = await forgotPassword({ email: email.trim() })
      toast.success(res.message || "New 4-digit verification code sent!")
      setCountdown(60)
      setCanResend(false)
      setOtp(["", "", "", ""])
      inputRefs[0].current?.focus()
    } catch (err) {
      setError(err.message || "Failed to resend code.")
    } finally {
      setResendLoading(false)
    }
  }

  // Handle OTP digit changes
  function handleOtpChange(index, value) {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length === 0) {
      const newOtp = [...otp]
      newOtp[index] = ""
      setOtp(newOtp)
      return
    }

    const digit = cleaned.slice(-1)
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)
    setError(null)

    if (index < 3 && digit) {
      inputRefs[index + 1].current?.focus()
    }

    const completeCode = newOtp.join("")
    if (completeCode.length === 4 && newOtp.every((d) => d !== "")) {
      executeVerify(completeCode)
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs[index - 1].current?.focus()
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs[index - 1].current?.focus()
    } else if (e.key === "ArrowRight" && index < 3) {
      inputRefs[index + 1].current?.focus()
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").trim().replace(/\D/g, "").slice(0, 4)
    if (!pastedData) return

    const newOtp = ["", "", "", ""]
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)

    if (pastedData.length === 4) {
      inputRefs[3].current?.focus()
      executeVerify(pastedData)
    } else {
      const nextIndex = Math.min(pastedData.length, 3)
      inputRefs[nextIndex].current?.focus()
    }
  }

  async function executeVerify(codeToVerify) {
    if (!email.trim()) {
      setError("Please provide your email address")
      return
    }

    const fullCode = codeToVerify || otp.join("")
    if (fullCode.length !== 4) {
      setError("Please enter the complete 4-digit code")
      return
    }

    setError(null)
    setLoading(true)
    try {
      const res = await verifyOtp({
        email: email.trim(),
        otp: fullCode,
      })

      if (res.token) {
        localStorage.setItem("token", res.token)
        toast.success("Verification successful! Welcome back.")
        setTimeout(() => {
          navigate("/dashboard", { replace: true })
        }, 500)
      } else {
        toast.success(res.message || "OTP verified successfully!")
        navigate("/signin")
      }
    } catch (err) {
      setError(err.message || "Invalid or expired verification code")
    } finally {
      setLoading(false)
    }
  }

  function handleVerifySubmit(e) {
    e.preventDefault()
    executeVerify()
  }

  function getMaskedEmail(str) {
    if (!str || !str.includes("@")) return str || "your email"
    const [name, domain] = str.split("@")
    if (name.length <= 2) return `${name[0]}***@${domain}`
    return `${name.slice(0, 2)}***${name.slice(-1)}@${domain}`
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-[420px]">
          <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-sm sm:p-10 text-center">
            {/* Header */}
            <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl font-sans">
              OTP Verification
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-navy/60">
              Please check your email{" "}
              <span className="font-medium text-navy">
                {getMaskedEmail(email)}
              </span>{" "}
              for verification code.
            </p>

            {!email && (
              <div className="mt-4 text-left">
                <label className="block text-xs font-semibold text-navy mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full rounded-xl border border-navy/15 bg-white px-3.5 py-2 text-sm text-navy outline-none focus:border-ochre"
                />
              </div>
            )}

            {/* 4 Digit Input Boxes Form */}
            <form onSubmit={handleVerifySubmit} className="mt-8 space-y-6">
              <div
                className="flex items-center justify-center gap-3 sm:gap-4"
                onPaste={handlePaste}
              >
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={`h-14 w-14 sm:h-16 sm:w-16 rounded-xl text-center font-mono text-2xl font-bold transition outline-none ${
                      digit
                        ? "bg-paper/80 border-2 border-ochre text-navy shadow-sm"
                        : "bg-[#f5f5f5] border border-transparent text-navy hover:bg-[#eaeaea] focus:bg-white focus:border-ochre focus:ring-2 focus:ring-ochre/20"
                    }`}
                  />
                ))}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-rust/10 p-3 text-xs font-medium text-rust text-left"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading || otp.join("").length !== 4}
                className="w-full rounded-2xl bg-[#5C72EA] hover:bg-[#4B60D8] active:scale-[0.99] py-3.5 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition duration-150 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    <span>Verifying...</span>
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </button>
            </form>

            {/* Resend & Actions */}
            <div className="mt-8 space-y-3 text-center text-xs">
              <p className="text-navy/60">
                Didn&apos;t receive code?{" "}
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendLoading}
                    className="font-semibold text-ochre-ink hover:underline cursor-pointer"
                  >
                    {resendLoading ? "Resending..." : "Resend Code"}
                  </button>
                ) : (
                  <span className="font-medium text-navy/40">
                    Resend in {countdown}s
                  </span>
                )}
              </p>

              <div>
                <Link
                  to="/forgotPassword"
                  className="text-navy/50 hover:text-navy transition font-medium"
                >
                  &larr; Request new code
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
