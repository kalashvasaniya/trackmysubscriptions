import { Resend } from "resend"

let resendInstance: Resend | null = null

function getResend(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY environment variable is not set")
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

export interface SubscriptionAlertData {
  subscriptionName: string
  amount: number
  currency: string
  billingDate: Date
  daysUntil: number
  userName?: string
}

export interface WelcomeEmailData {
  userName: string
  email: string
}

export async function sendSubscriptionAlert(
  to: string,
  data: SubscriptionAlertData,
) {
  const formattedDate = data.billingDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: data.currency,
  }).format(data.amount)

  try {
    const { data: result, error } = await getResend().emails.send({
      from: "SubTracker <notifications@subtracker.app>",
      to: [to],
      subject: `Upcoming Payment: ${data.subscriptionName} - ${formattedAmount}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Upcoming Payment Reminder</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center;">
                      <div style="display: inline-block; width: 60px; height: 60px; background-color: #3b82f6; border-radius: 12px; line-height: 60px; color: white; font-size: 24px; font-weight: bold;">
                        ST
                      </div>
                      <h1 style="margin: 20px 0 0; color: #111827; font-size: 24px; font-weight: 700;">
                        Upcoming Payment Reminder
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 20px 40px;">
                      <p style="margin: 0 0 20px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                        Hi${data.userName ? ` ${data.userName}` : ""},
                      </p>
                      <p style="margin: 0 0 30px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                        This is a friendly reminder that your subscription payment is coming up.
                      </p>
                      
                      <!-- Subscription Card -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                        <tr>
                          <td style="padding: 24px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td>
                                  <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px; font-weight: 600;">
                                    ${data.subscriptionName}
                                  </h2>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                      <td style="padding-right: 20px;">
                                        <p style="margin: 0; color: #6b7280; font-size: 14px;">Amount</p>
                                        <p style="margin: 4px 0 0; color: #111827; font-size: 18px; font-weight: 600;">
                                          ${formattedAmount}
                                        </p>
                                      </td>
                                      <td>
                                        <p style="margin: 0; color: #6b7280; font-size: 14px;">Due Date</p>
                                        <p style="margin: 4px 0 0; color: #111827; font-size: 18px; font-weight: 600;">
                                          ${formattedDate}
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding-top: 16px;">
                                  <span style="display: inline-block; padding: 6px 12px; background-color: ${data.daysUntil <= 1 ? "#fef2f2" : data.daysUntil <= 3 ? "#fef3c7" : "#dbeafe"}; color: ${data.daysUntil <= 1 ? "#dc2626" : data.daysUntil <= 3 ? "#d97706" : "#2563eb"}; font-size: 14px; font-weight: 500; border-radius: 9999px;">
                                    ${data.daysUntil === 0 ? "Due today" : data.daysUntil === 1 ? "Due tomorrow" : `Due in ${data.daysUntil} days`}
                                  </span>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- CTA Button -->
                  <tr>
                    <td style="padding: 20px 40px;">
                      <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/subscriptions" style="display: inline-block; padding: 14px 28px; background-color: #3b82f6; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                        View Subscription
                      </a>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #9ca3af; font-size: 14px; text-align: center;">
                        You received this email because you have payment alerts enabled for this subscription.
                        <br>
                        <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/settings" style="color: #3b82f6; text-decoration: none;">Manage notification settings</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error("Error sending subscription alert:", error)
      return { success: false, error }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error("Error sending subscription alert:", error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(to: string, data: WelcomeEmailData) {
  try {
    const { data: result, error } = await getResend().emails.send({
      from: "SubTracker <welcome@subtracker.app>",
      to: [to],
      subject: "Welcome to SubTracker - Start Managing Your Subscriptions",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to SubTracker</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center;">
                      <div style="display: inline-block; width: 60px; height: 60px; background-color: #3b82f6; border-radius: 12px; line-height: 60px; color: white; font-size: 24px; font-weight: bold;">
                        ST
                      </div>
                      <h1 style="margin: 20px 0 0; color: #111827; font-size: 28px; font-weight: 700;">
                        Welcome to SubTracker!
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 20px 40px;">
                      <p style="margin: 0 0 20px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                        Hi ${data.userName || "there"},
                      </p>
                      <p style="margin: 0 0 30px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                        Thanks for signing up! SubTracker helps you track and manage all your subscriptions in one place. No more surprise charges or forgotten renewals.
                      </p>
                      
                      <!-- Features -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="padding: 16px 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                              <tr>
                                <td style="vertical-align: top; padding-right: 16px;">
                                  <div style="width: 40px; height: 40px; background-color: #dbeafe; border-radius: 8px; text-align: center; line-height: 40px;">
                                    📊
                                  </div>
                                </td>
                                <td style="vertical-align: top;">
                                  <h3 style="margin: 0 0 4px; color: #111827; font-size: 16px; font-weight: 600;">Track Spending</h3>
                                  <p style="margin: 0; color: #6b7280; font-size: 14px;">See where your money goes with detailed analytics</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 16px 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                              <tr>
                                <td style="vertical-align: top; padding-right: 16px;">
                                  <div style="width: 40px; height: 40px; background-color: #dcfce7; border-radius: 8px; text-align: center; line-height: 40px;">
                                    🔔
                                  </div>
                                </td>
                                <td style="vertical-align: top;">
                                  <h3 style="margin: 0 0 4px; color: #111827; font-size: 16px; font-weight: 600;">Payment Reminders</h3>
                                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Get notified before payments are due</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 16px 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                              <tr>
                                <td style="vertical-align: top; padding-right: 16px;">
                                  <div style="width: 40px; height: 40px; background-color: #fef3c7; border-radius: 8px; text-align: center; line-height: 40px;">
                                    📁
                                  </div>
                                </td>
                                <td style="vertical-align: top;">
                                  <h3 style="margin: 0 0 4px; color: #111827; font-size: 16px; font-weight: 600;">Stay Organized</h3>
                                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Use folders and tags to organize your subscriptions</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- CTA Button -->
                  <tr>
                    <td style="padding: 20px 40px; text-align: center;">
                      <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard" style="display: inline-block; padding: 14px 28px; background-color: #3b82f6; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                        Get Started
                      </a>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #9ca3af; font-size: 14px; text-align: center;">
                        Questions? Just reply to this email - we're here to help!
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error("Error sending welcome email:", error)
      return { success: false, error }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return { success: false, error }
  }
}

export async function sendWeeklySummary(
  to: string,
  data: {
    userName?: string
    totalSubscriptions: number
    activeSubscriptions: number
    monthlySpending: number
    currency: string
    upcomingPayments: Array<{
      name: string
      amount: number
      dueDate: Date
    }>
  },
) {
  const formattedMonthly = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: data.currency,
  }).format(data.monthlySpending)

  try {
    const { data: result, error } = await getResend().emails.send({
      from: "SubTracker <weekly@subtracker.app>",
      to: [to],
      subject: `Your Weekly Subscription Summary - ${formattedMonthly}/month`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Weekly Summary</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center;">
                      <div style="display: inline-block; width: 60px; height: 60px; background-color: #3b82f6; border-radius: 12px; line-height: 60px; color: white; font-size: 24px; font-weight: bold;">
                        ST
                      </div>
                      <h1 style="margin: 20px 0 0; color: #111827; font-size: 24px; font-weight: 700;">
                        Your Weekly Summary
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Stats -->
                  <tr>
                    <td style="padding: 20px 40px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center; padding: 16px; background-color: #f9fafb; border-radius: 8px;">
                            <p style="margin: 0; color: #6b7280; font-size: 14px;">Monthly Spending</p>
                            <p style="margin: 8px 0 0; color: #111827; font-size: 28px; font-weight: 700;">${formattedMonthly}</p>
                          </td>
                        </tr>
                      </table>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 16px;">
                        <tr>
                          <td style="text-align: center; padding: 16px; background-color: #f9fafb; border-radius: 8px; width: 50%;">
                            <p style="margin: 0; color: #6b7280; font-size: 14px;">Total Subscriptions</p>
                            <p style="margin: 8px 0 0; color: #111827; font-size: 24px; font-weight: 700;">${data.totalSubscriptions}</p>
                          </td>
                          <td style="width: 16px;"></td>
                          <td style="text-align: center; padding: 16px; background-color: #f9fafb; border-radius: 8px; width: 50%;">
                            <p style="margin: 0; color: #6b7280; font-size: 14px;">Active</p>
                            <p style="margin: 8px 0 0; color: #10b981; font-size: 24px; font-weight: 700;">${data.activeSubscriptions}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Upcoming Payments -->
                  ${
                    data.upcomingPayments.length > 0
                      ? `
                  <tr>
                    <td style="padding: 20px 40px;">
                      <h2 style="margin: 0 0 16px; color: #111827; font-size: 18px; font-weight: 600;">Upcoming This Week</h2>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid #e5e7eb; border-radius: 8px;">
                        ${data.upcomingPayments
                          .map(
                            (payment, index) => `
                        <tr>
                          <td style="padding: 16px; ${index > 0 ? "border-top: 1px solid #e5e7eb;" : ""}">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td>
                                  <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 500;">${payment.name}</p>
                                  <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">${payment.dueDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
                                </td>
                                <td style="text-align: right;">
                                  <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 600;">${new Intl.NumberFormat("en-US", { style: "currency", currency: data.currency }).format(payment.amount)}</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        `,
                          )
                          .join("")}
                      </table>
                    </td>
                  </tr>
                  `
                      : ""
                  }
                  
                  <!-- CTA Button -->
                  <tr>
                    <td style="padding: 20px 40px; text-align: center;">
                      <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard" style="display: inline-block; padding: 14px 28px; background-color: #3b82f6; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                        View Dashboard
                      </a>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #9ca3af; font-size: 14px; text-align: center;">
                        <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/settings" style="color: #3b82f6; text-decoration: none;">Manage email preferences</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error("Error sending weekly summary:", error)
      return { success: false, error }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error("Error sending weekly summary:", error)
    return { success: false, error }
  }
}
