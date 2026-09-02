import { useState, useRef, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { forgotPassword, verifyOtp, resetPassword } from "../lib/api.js"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"

export default function ForgotPassword() {
  const navigate = useNavigate()
  const location = useLocation()

  // Support initial email and step passed via route state
  const initialEmail = location.state?.email || ""
  const [email, setEmail] = useState(initialEmail)
  const [step, setStep] = useState(location.state?.step || "email") // "email" | "otp" | "password"
  const [otp, setOtp] = useState(["", "", "", ""])
  const [resetToken, setResetToken] = useState("")
  
  // Password change fields
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState(null)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  // Refs for the 4 OTP input boxes
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer
    if (step === "otp" && countdown > 0) {
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
  }, [step, countdown])

  // Focus first OTP box when entering OTP step
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        inputRefs[0].current?.focus()
      }, 100)
    }
  }, [step])

  // Handle Step 1: Send Email for OTP
  async function handleSendEmail(e) {
    if (e) e.preventDefault()
    setError(null)
    
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError("Please enter your email address")
      return
    }

    setLoading(true)
    try {
      const res = await forgotPassword({ email: trimmedEmail })
      toast.success(res.message || "4-digit verification code sent to your email!")
      setStep("otp")
      setCountdown(60)
      setCanResend(false)
      setOtp(["", "", "", ""])
    } catch (err) {
      setError(err.message || "Failed to send verification code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle Resend OTP
  async function handleResendCode() {
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

  // Handle OTP digit changes with auto-advance
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

    // Move to next input box if available
    if (index < 3 && digit) {
      inputRefs[index + 1].current?.focus()
    }

    // Auto-verify if all 4 digits are entered
    const completeCode = newOtp.join("")
    if (completeCode.length === 4 && newOtp.every((d) => d !== "")) {
      executeVerify(completeCode)
    }
  }

  // Handle backspace navigation in OTP boxes
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

  // Handle paste for full 4-digit code
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

  // Execute OTP verification against backend
  async function executeVerify(codeToVerify) {
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

      if (res.resetToken) {
        setResetToken(res.resetToken)
        toast.success("Code verified! Please set your new password.")
        setStep("password")
      } else {
        toast.success("Verification successful!")
        setStep("password")
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

  // Handle Step 3: Set New Password
  async function handleResetPassword(e) {
    e.preventDefault()
    setError(null)

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const res = await resetPassword({
        resetToken,
        newPassword,
      })

      toast.success(res.message || "Password reset successful! Please sign in.")
      setTimeout(() => {
        navigate("/signin")
      }, 600)
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Helper to mask email display for privacy
  function getMaskedEmail(str) {
    if (!str || !str.includes("@")) return str
    const [name, domain] = str.split("@")
    if (name.length <= 2) return `${name[0]}***@${domain}`
    return `${name.slice(0, 2)}***${name.slice(-1)}@${domain}`
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-[420px]">
          {/* White Card Container with Border */}
          <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-sm sm:p-10">
            <AnimatePresence mode="wait">
              {step === "email" && (
                /* ================= STEP 1: FORGOT PASSWORD ================= */
                <motion.div
                  key="step-email"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Header */}
                  <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl font-sans text-center">
                    Forgot Password?
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed text-navy/60 font-sans text-center">
                    Don&apos;t worry! It occurs. Please enter the email address linked with your account.
                  </p>

                  {/* Form */}
                  <form onSubmit={handleSendEmail} className="mt-8 space-y-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-navy mb-2"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        autoFocus
                        autoComplete="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/35 outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
                      />
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg bg-rust/10 p-3 text-xs font-medium text-rust"
                      >
                        {error}
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-2xl bg-[#5C72EA] hover:bg-[#4B60D8] active:scale-[0.99] py-3.5 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition duration-150 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
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
                          <span>Sending code...</span>
                        </>
                      ) : (
                        "Send Code"
                      )}
                    </button>
                  </form>

                  <div className="mt-8 border-t border-navy/5 pt-6 text-center">
                    <Link
                      to="/signin"
                      className="text-xs font-medium text-navy/60 transition hover:text-navy"
                    >
                      Remember password?{" "}
                      <span className="font-semibold text-ochre-ink">Sign in</span>
                    </Link>
                  </div>
                </motion.div>
              )}

              {step === "otp" && (
                /* ================= STEP 2: OTP VERIFICATION ================= */
                <motion.div
                  key="step-otp"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="text-center"
                >
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
                      <button
                        type="button"
                        onClick={() => {
                          setStep("email")
                          setError(null)
                        }}
                        className="text-navy/50 hover:text-navy transition font-medium cursor-pointer"
                      >
                        &larr; Change email address
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === "password" && (
                /* ================= STEP 3: CREATE NEW PASSWORD ================= */
                <motion.div
                  key="step-password"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl font-sans">
                      Create New Password
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-navy/60">
                      Your new password must be at least 6 characters.
                    </p>
                  </div>

                  <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
                    <div>
                      <label
                        htmlFor="new-password"
                        className="block text-sm font-semibold text-navy mb-2"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          required
                          autoFocus
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/35 outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20 pr-11"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy transition"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="block text-sm font-semibold text-navy mb-2"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          placeholder="Re-enter new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/35 outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20 pr-11"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy transition"
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg bg-rust/10 p-3 text-xs font-medium text-rust"
                      >
                        {error}
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !newPassword || !confirmPassword}
                      className="w-full rounded-2xl bg-[#5C72EA] hover:bg-[#4B60D8] active:scale-[0.99] py-3.5 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition duration-150 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
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
                          <span>Resetting Password...</span>
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  </form>

                  <div className="mt-8 border-t border-navy/5 pt-6 text-center">
                    <Link
                      to="/signin"
                      className="text-xs font-medium text-navy/60 transition hover:text-navy"
                    >
                      Back to{" "}
                      <span className="font-semibold text-ochre-ink">Sign in</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
