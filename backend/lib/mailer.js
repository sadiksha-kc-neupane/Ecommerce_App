import nodemailer from "nodemailer"

function getTransporter() {
  const user = process.env.EMAIL_USER?.trim()
  // Strip any spaces from the 16-character Google App password (e.g. "abcd efgh ijkl mnop" -> "abcdefghijklmnop")
  const pass = process.env.EMAIL_PASS?.replace(/\s+/g, "")

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  })
}

export async function sendOtpEmail(to, otp) {
  const user = process.env.EMAIL_USER?.trim()
  const pass = process.env.EMAIL_PASS?.replace(/\s+/g, "")

  console.log(`\n========================================\n📩 [OTP CODE SENT] To: ${to} | Code: ${otp}\n========================================\n`)

  if (!user || !pass || user.includes("your-gmail-address") || pass.includes("your-16-character")) {
    console.warn("⚠️ EMAIL_USER or EMAIL_PASS is not configured with real Gmail credentials in backend/.env. Use the logged OTP above for testing.")
    return
  }

  try {
    const transporter = getTransporter()
    const info = await transporter.sendMail({
      from: `"Dipti&Suppliers" <${user}>`,
      to,
      subject: `Your OTP Verification Code: ${otp}`,
      text: `Your Dipti&Suppliers verification code is ${otp}. It expires in 10 minutes. If you didn't request this, ignore this email.`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px 24px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #ffffff; color: #1c1b19;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #d97706; color: #1c1b19; font-weight: bold; font-family: monospace; font-size: 14px; padding: 6px 12px; border-radius: 8px;">D&amp;S</div>
            <h1 style="font-size: 22px; font-weight: 700; margin: 16px 0 6px; color: #1c1b19;">OTP Verification</h1>
            <p style="font-size: 14px; color: #6b7280; margin: 0;">Please use the 4-digit verification code below to verify your account.</p>
          </div>
          
          <div style="background-color: #f7f3ec; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; border: 1px dashed #d97706;">
            <span style="font-size: 38px; font-weight: 800; letter-spacing: 12px; color: #1c1b19; font-family: monospace; padding-left: 12px;">${otp}</span>
          </div>

          <p style="font-size: 13px; color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
            This code will expire in <strong>10 minutes</strong>. If you did not make this request, no further action is required and you can safely disregard this email.
          </p>

          <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0 16px;" />
          <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">
            &copy; ${new Date().getFullYear()} Dipti&amp;Suppliers. All rights reserved.
          </p>
        </div>
      `,
    })
    console.log(`✅ [EMAIL DELIVERED] Successfully sent to: ${to} (Message ID: ${info.messageId})`)
  } catch (err) {
    console.error("❌ Nodemailer sendMail failed:", err.message)
  }
}

// Send email when admin/seller approves the customer's QR payment
export async function sendPaymentApprovedEmail(to, { orderId, totalAmount, address, customerName }) {
  const user = process.env.EMAIL_USER?.trim()
  const pass = process.env.EMAIL_PASS?.replace(/\s+/g, "")

  console.log(`\n========================================\n✅ [PAYMENT APPROVED EMAIL] To: ${to} | Order: #${orderId} | Amount: NPR ${totalAmount}\n========================================\n`)

  if (!user || !pass || user.includes("your-gmail-address") || pass.includes("your-16-character")) {
    console.warn("⚠️ EMAIL_USER or EMAIL_PASS not configured. Skipping SMTP send.")
    return
  }

  try {
    const transporter = getTransporter()
    const info = await transporter.sendMail({
      from: `"Dipti&Suppliers" <${user}>`,
      to,
      subject: `✅ Payment Verified & Order Confirmed! (#${String(orderId).slice(0, 8)})`,
      text: `Hello ${customerName || "Customer"}, your payment of NPR ${totalAmount} for Order #${orderId} has been verified and approved! We are now preparing your items for delivery. Shipping address: ${address}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #ffffff; color: #1c1b19;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #d97706; color: #1c1b19; font-weight: bold; font-family: monospace; font-size: 14px; padding: 6px 12px; border-radius: 8px;">D&amp;S</div>
            <h1 style="font-size: 22px; font-weight: 700; margin: 16px 0 6px; color: #1c1b19;">Payment Verified &amp; Confirmed!</h1>
            <p style="font-size: 14px; color: #16a34a; font-weight: 600; margin: 0;">Your purchase has been approved and is being processed.</p>
          </div>

          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #15803d; font-weight: 600;">Order Summary:</p>
            <table style="width: 100%; font-size: 13px; color: #374151; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Order ID:</td>
                <td style="padding: 6px 0; font-family: monospace; font-weight: 600; text-align: right; color: #111827;">#${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Total Paid:</td>
                <td style="padding: 6px 0; font-weight: 700; text-align: right; color: #b45309; font-size: 15px;">NPR ${totalAmount}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Payment Status:</td>
                <td style="padding: 6px 0; font-weight: 600; text-align: right; color: #16a34a;">PAID / VERIFIED</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Delivery Address:</td>
                <td style="padding: 6px 0; text-align: right; color: #111827;">${address || "Standard Address"}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 13px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Thank you for shopping with <strong>Dipti&amp;Suppliers</strong>. Our team is packaging your order and dispatching it promptly. You can track your order status in your customer dashboard at any time.
          </p>

          <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0 16px;" />
          <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">
            &copy; ${new Date().getFullYear()} Dipti&amp;Suppliers. All rights reserved.
          </p>
        </div>
      `,
    })
    console.log(`✅ [APPROVAL EMAIL SENT] To: ${to} (Message ID: ${info.messageId})`)
  } catch (err) {
    console.error("❌ Approval email failed:", err.message)
  }
}

// Send email when admin/seller rejects the payment screenshot
export async function sendPaymentRejectedEmail(to, { orderId, totalAmount, reason, customerName }) {
  const user = process.env.EMAIL_USER?.trim()
  const pass = process.env.EMAIL_PASS?.replace(/\s+/g, "")

  console.log(`\n========================================\n❌ [PAYMENT REJECTED EMAIL] To: ${to} | Order: #${orderId} | Reason: ${reason}\n========================================\n`)

  if (!user || !pass || user.includes("your-gmail-address") || pass.includes("your-16-character")) {
    console.warn("⚠️ EMAIL_USER or EMAIL_PASS not configured. Skipping SMTP send.")
    return
  }

  try {
    const transporter = getTransporter()
    const info = await transporter.sendMail({
      from: `"Dipti&Suppliers" <${user}>`,
      to,
      subject: `⚠️ Payment Verification Issue for Order #${String(orderId).slice(0, 8)}`,
      text: `Hello ${customerName || "Customer"}, there was an issue verifying your payment for Order #${orderId} (NPR ${totalAmount}). Reason: ${reason || "Invalid screenshot or payment not received"}. Please log in or contact support to resolve this.`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #ffffff; color: #1c1b19;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #c2410c; color: #ffffff; font-weight: bold; font-family: monospace; font-size: 14px; padding: 6px 12px; border-radius: 8px;">D&amp;S</div>
            <h1 style="font-size: 22px; font-weight: 700; margin: 16px 0 6px; color: #c2410c;">Payment Verification Issue</h1>
            <p style="font-size: 14px; color: #6b7280; margin: 0;">We were unable to verify your payment proof for Order #${orderId}.</p>
          </div>

          <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 8px; font-size: 13px; color: #991b1b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Reason provided by verification team:</p>
            <p style="margin: 0; font-size: 14px; color: #b91c1c; font-weight: 600; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px dashed #fca5a5;">
              "${reason || "Payment screenshot unclear, amount mismatch, or transaction could not be located."}"
            </p>
          </div>

          <p style="font-size: 13px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            <strong>What should you do?</strong><br />
            Please review your bank transaction and verify that the payment was transferred to Dipti&amp;Suppliers. You can reply directly to this email or visit your account dashboard to review your order.
          </p>

          <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0 16px;" />
          <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">
            &copy; ${new Date().getFullYear()} Dipti&amp;Suppliers. All rights reserved.
          </p>
        </div>
      `,
    })
    console.log(`✅ [REJECTION EMAIL SENT] To: ${to} (Message ID: ${info.messageId})`)
  } catch (err) {
    console.error("❌ Rejection email failed:", err.message)
  }
}
