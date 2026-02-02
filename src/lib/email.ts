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

// Email configuration
const EMAIL_CONFIG = {
  from: `TrackMySubscriptions <${process.env.RESEND_EMAIL_FROM || "hello@trackmysubscriptions.com"}>`,
  replyTo: process.env.RESEND_EMAIL_REPLY_TO || "support@trackmysubscriptions.com",
  baseUrl: process.env.NEXTAUTH_URL || "https://trackmysubscriptions.com",
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

// Helper to generate unsubscribe URL
function getUnsubscribeUrl(email: string): string {
  const encoded = Buffer.from(email).toString("base64")
  return `${EMAIL_CONFIG.baseUrl}/settings?unsubscribe=${encoded}`
}

// Helper to generate plain text from subscription alert
function getAlertPlainText(data: SubscriptionAlertData, formattedAmount: string, formattedDate: string): string {
  const dueText = data.daysUntil === 0 ? "today" : data.daysUntil === 1 ? "tomorrow" : `in ${data.daysUntil} days`
  return `Hi${data.userName ? ` ${data.userName}` : ""},

This is a reminder about your upcoming subscription payment.

${data.subscriptionName}
Amount: ${formattedAmount}
Due Date: ${formattedDate}
Status: Due ${dueText}

View your subscription: ${EMAIL_CONFIG.baseUrl}/subscriptions

---
You received this email because you enabled payment alerts.
Manage your notification settings: ${EMAIL_CONFIG.baseUrl}/settings

TrackMySubscriptions
`
}

// Helper to generate welcome email plain text
function getWelcomePlainText(userName: string): string {
  return `Hi ${userName || "there"},

Welcome to TrackMySubscriptions!

You can now track and manage all your subscriptions in one place. Here's what you can do:

- Track Spending: See where your money goes with detailed analytics
- Payment Reminders: Get notified before payments are due  
- Stay Organized: Use folders and tags to organize your subscriptions

Get started: ${EMAIL_CONFIG.baseUrl}/dashboard

If you have any questions, just reply to this email.

---
TrackMySubscriptions
`
}

// Helper to generate weekly summary plain text
function getWeeklySummaryPlainText(
  data: {
    userName?: string
    totalSubscriptions: number
    activeSubscriptions: number
    monthlySpending: number
    currency: string
    upcomingPayments: Array<{ name: string; amount: number; dueDate: Date }>
  },
  formattedMonthly: string
): string {
  let text = `Hi ${data.userName || "there"},

Here's your weekly subscription summary:

Monthly Spending: ${formattedMonthly}
Total Subscriptions: ${data.totalSubscriptions}
Active: ${data.activeSubscriptions}
`

  if (data.upcomingPayments.length > 0) {
    text += `
Upcoming This Week:
`
    for (const payment of data.upcomingPayments) {
      const amount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: data.currency,
      }).format(payment.amount)
      const date = payment.dueDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
      text += `- ${payment.name}: ${amount} (${date})\n`
    }
  }

  text += `
View your dashboard: ${EMAIL_CONFIG.baseUrl}/dashboard

---
Manage email preferences: ${EMAIL_CONFIG.baseUrl}/settings

TrackMySubscriptions
`
  return text
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

  const dueText = data.daysUntil === 0 ? "today" : data.daysUntil === 1 ? "tomorrow" : `in ${data.daysUntil} days`
  const preheader = `${data.subscriptionName} payment of ${formattedAmount} is due ${dueText}`

  try {
    const { data: result, error } = await getResend().emails.send({
      from: EMAIL_CONFIG.from,
      replyTo: EMAIL_CONFIG.replyTo,
      to: [to],
      subject: `Payment Reminder: ${data.subscriptionName} - ${formattedAmount}`,
      text: getAlertPlainText(data, formattedAmount, formattedDate),
      headers: {
        "List-Unsubscribe": `<${getUnsubscribeUrl(to)}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        "X-Entity-Ref-ID": `alert-${Date.now()}`,
      },
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>Payment Reminder</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- Preheader text (hidden) -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
    ${preheader}
    ${"&nbsp;".repeat(100)}
  </div>
  
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb;">
    <tr>
      <td style="padding: 32px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #f3f4f6;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <span style="font-size: 18px; font-weight: 600; color: #111827;">TrackMySubscriptions</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 16px; color: #111827; font-size: 20px; font-weight: 600; line-height: 1.4;">
                Payment Reminder
              </h1>
              <p style="margin: 0 0 24px; color: #4b5563; font-size: 15px; line-height: 1.6;">
                Hi${data.userName ? ` ${data.userName}` : ""}, this is a reminder about your upcoming subscription payment.
              </p>
              
              <!-- Subscription Details -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; border-radius: 6px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 4px; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Subscription</p>
                    <p style="margin: 0 0 16px; color: #111827; font-size: 17px; font-weight: 600;">${data.subscriptionName}</p>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="width: 50%; vertical-align: top;">
                          <p style="margin: 0 0 4px; color: #6b7280; font-size: 13px;">Amount</p>
                          <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 600;">${formattedAmount}</p>
                        </td>
                        <td style="width: 50%; vertical-align: top;">
                          <p style="margin: 0 0 4px; color: #6b7280; font-size: 13px;">Due Date</p>
                          <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 600;">${formattedDate}</p>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 16px 0 0; padding: 8px 12px; background-color: ${data.daysUntil <= 1 ? "#fef2f2" : data.daysUntil <= 3 ? "#fffbeb" : "#eff6ff"}; color: ${data.daysUntil <= 1 ? "#b91c1c" : data.daysUntil <= 3 ? "#b45309" : "#1d4ed8"}; font-size: 13px; font-weight: 500; border-radius: 4px; display: inline-block;">
                      Due ${dueText}
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="border-radius: 6px; background-color: #111827;">
                    <a href="${EMAIL_CONFIG.baseUrl}/subscriptions" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 500;">
                      View Subscription
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #f3f4f6;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; line-height: 1.5;">
                You received this because you enabled payment alerts for this subscription.
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.5;">
                <a href="${EMAIL_CONFIG.baseUrl}/settings" style="color: #4b5563; text-decoration: underline;">Manage notification settings</a>
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
  const preheader = "Start tracking your subscriptions and never miss a payment again"

  try {
    const { data: result, error } = await getResend().emails.send({
      from: EMAIL_CONFIG.from,
      replyTo: EMAIL_CONFIG.replyTo,
      to: [to],
      subject: "Welcome to TrackMySubscriptions",
      text: getWelcomePlainText(data.userName),
      headers: {
        "List-Unsubscribe": `<${getUnsubscribeUrl(to)}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        "X-Entity-Ref-ID": `welcome-${Date.now()}`,
      },
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>Welcome</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- Preheader text (hidden) -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
    ${preheader}
    ${"&nbsp;".repeat(100)}
  </div>
  
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb;">
    <tr>
      <td style="padding: 32px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #f3f4f6;">
              <span style="font-size: 18px; font-weight: 600; color: #111827;">TrackMySubscriptions</span>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 16px; color: #111827; font-size: 22px; font-weight: 600; line-height: 1.4;">
                Welcome, ${data.userName || "there"}!
              </h1>
              <p style="margin: 0 0 24px; color: #4b5563; font-size: 15px; line-height: 1.6;">
                Thanks for joining TrackMySubscriptions. You can now track and manage all your subscriptions in one place.
              </p>
              
              <!-- Features -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                    <p style="margin: 0 0 4px; color: #111827; font-size: 14px; font-weight: 600;">Track Spending</p>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">See where your money goes with detailed analytics</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                    <p style="margin: 0 0 4px; color: #111827; font-size: 14px; font-weight: 600;">Payment Reminders</p>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Get notified before payments are due</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <p style="margin: 0 0 4px; color: #111827; font-size: 14px; font-weight: 600;">Stay Organized</p>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Use folders and tags to organize your subscriptions</p>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="border-radius: 6px; background-color: #111827;">
                    <a href="${EMAIL_CONFIG.baseUrl}/dashboard" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 500;">
                      Go to Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #f3f4f6;">
              <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.5;">
                Questions? Just reply to this email and we'll help you out.
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

  const preheader = `Your subscriptions: ${formattedMonthly}/month across ${data.totalSubscriptions} services`

  try {
    const { data: result, error } = await getResend().emails.send({
      from: EMAIL_CONFIG.from,
      replyTo: EMAIL_CONFIG.replyTo,
      to: [to],
      subject: `Your Weekly Summary: ${formattedMonthly}/month`,
      text: getWeeklySummaryPlainText(data, formattedMonthly),
      headers: {
        "List-Unsubscribe": `<${getUnsubscribeUrl(to)}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        "X-Entity-Ref-ID": `weekly-${Date.now()}`,
      },
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>Weekly Summary</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- Preheader text (hidden) -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
    ${preheader}
    ${"&nbsp;".repeat(100)}
  </div>
  
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb;">
    <tr>
      <td style="padding: 32px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #f3f4f6;">
              <span style="font-size: 18px; font-weight: 600; color: #111827;">TrackMySubscriptions</span>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 16px; color: #111827; font-size: 20px; font-weight: 600; line-height: 1.4;">
                Your Weekly Summary
              </h1>
              <p style="margin: 0 0 24px; color: #4b5563; font-size: 15px; line-height: 1.6;">
                Hi ${data.userName || "there"}, here's an overview of your subscriptions this week.
              </p>
              
              <!-- Stats -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #f9fafb; border-radius: 6px; text-align: center;">
                    <p style="margin: 0 0 4px; color: #6b7280; font-size: 13px;">Monthly Spending</p>
                    <p style="margin: 0; color: #111827; font-size: 24px; font-weight: 700;">${formattedMonthly}</p>
                  </td>
                </tr>
              </table>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="width: 48%; padding: 16px; background-color: #f9fafb; border-radius: 6px; text-align: center;">
                    <p style="margin: 0 0 4px; color: #6b7280; font-size: 13px;">Total</p>
                    <p style="margin: 0; color: #111827; font-size: 20px; font-weight: 700;">${data.totalSubscriptions}</p>
                  </td>
                  <td style="width: 4%;"></td>
                  <td style="width: 48%; padding: 16px; background-color: #f9fafb; border-radius: 6px; text-align: center;">
                    <p style="margin: 0 0 4px; color: #6b7280; font-size: 13px;">Active</p>
                    <p style="margin: 0; color: #059669; font-size: 20px; font-weight: 700;">${data.activeSubscriptions}</p>
                  </td>
                </tr>
              </table>
              
              ${data.upcomingPayments.length > 0 ? `
              <!-- Upcoming Payments -->
              <p style="margin: 0 0 12px; color: #111827; font-size: 14px; font-weight: 600;">Upcoming This Week</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 24px;">
                ${data.upcomingPayments.map((payment, index) => `
                <tr>
                  <td style="padding: 12px 16px; ${index > 0 ? "border-top: 1px solid #f3f4f6;" : ""}">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td>
                          <p style="margin: 0; color: #111827; font-size: 14px; font-weight: 500;">${payment.name}</p>
                          <p style="margin: 2px 0 0; color: #6b7280; font-size: 13px;">${payment.dueDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
                        </td>
                        <td style="text-align: right;">
                          <p style="margin: 0; color: #111827; font-size: 14px; font-weight: 600;">${new Intl.NumberFormat("en-US", { style: "currency", currency: data.currency }).format(payment.amount)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                `).join("")}
              </table>
              ` : ""}
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="border-radius: 6px; background-color: #111827;">
                    <a href="${EMAIL_CONFIG.baseUrl}/dashboard" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 500;">
                      View Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #f3f4f6;">
              <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.5;">
                <a href="${EMAIL_CONFIG.baseUrl}/settings" style="color: #4b5563; text-decoration: underline;">Manage email preferences</a>
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
