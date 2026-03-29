// ─────────────────────────────────────────────────────────────
//  Brevo (formerly Sendinblue) transactional email service
//  Docs: https://developers.brevo.com/reference/sendtransacemail
// ─────────────────────────────────────────────────────────────
const BREVO_API_KEY    = import.meta.env.VITE_BREVO_API_KEY
const SENDER_EMAIL     = import.meta.env.VITE_BREVO_SENDER_EMAIL  || 'noreply@ovpret.edu.ph'
const SENDER_NAME      = import.meta.env.VITE_BREVO_SENDER_NAME   || 'OVPRET Document System'
const VP_EMAIL         = import.meta.env.VITE_VP_EMAIL            || 'vp@ovpret.edu.ph'
const VP_NAME          = import.meta.env.VITE_VP_NAME             || 'OVPRET Vice President'
const BREVO_URL = 'https://api.brevo.com/v3/smtp/email'

// ── Primary send function ────────────────────────────────────
async function sendEmail(payload: {
  toEmail: string
  toName:  string
  subject: string
  html:    string
}): Promise<void> {
  const body = {
    sender:   { email: SENDER_EMAIL, name: SENDER_NAME },
    to:       [{ email: payload.toEmail, name: payload.toName }],
    subject:  payload.subject,
    htmlContent: payload.html,
  }

  const res = await fetch(BREVO_URL, {
    method: 'POST',
    headers: {
      'api-key':       BREVO_API_KEY,
      'Content-Type':  'application/json',
      'Accept':        'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error('[BREVO] Failed to send email:', err)
    // Don't throw — email failure should not block document workflow
  }
}

// ── Email Templates ──────────────────────────────────────────

const BASE_STYLE = `
  font-family: 'Segoe UI', Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  background: #f8f8f8;
`

const HEADER_STYLE = `
  background: #0d1b2a;
  padding: 28px 32px 20px;
  border-bottom: 3px solid #c9952a;
`

const BODY_STYLE = `
  background: #ffffff;
  padding: 28px 32px;
`

const FOOTER_STYLE = `
  background: #f0ece4;
  padding: 14px 32px;
  font-size: 11px;
  color: #888;
  border-top: 1px solid #e0dbd0;
`

const BADGE_STYLE = (color: string, bg: string) =>
  `display:inline-block;padding:4px 12px;border-radius:3px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${color};background:${bg};border:1px solid ${color}30;`

function statusBadge(status: string): string {
  const map: Record<string, [string, string]> = {
    'Approved':             ['#2e7d32', '#e8f5e9'],
    'Rejected':             ['#c62828', '#ffebee'],
    'Request For Revision': ['#0277bd', '#e1f5fe'],
    'Under Review':         ['#6a1b9a', '#f3e5f5'],
    'Pending':              ['#e65100', '#fff3e0'],
  }
  const [c, bg] = map[status] || ['#555', '#eee']
  return `<span style="${BADGE_STYLE(c, bg)}">${status}</span>`
}

function emailWrapper(content: string): string {
  return `
  <div style="${BASE_STYLE}">
    <div style="${HEADER_STYLE}">
      <div style="color:#c9952a;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;">Office of the Vice President</div>
      <div style="color:#ffffff;font-size:17px;font-weight:700;line-height:1.3;">
        OVPRET Web-Based<br/>Document Tracking System
      </div>
    </div>
    <div style="${BODY_STYLE}">
      ${content}
    </div>
    <div style="${FOOTER_STYLE}">
      This is an automated notification from the OVPRET Document Tracking System.
      Please do not reply to this email.
    </div>
  </div>`
}

function infoRow(label: string, value: string): string {
  return `
  <tr>
    <td style="padding:8px 0;color:#888;font-size:11px;letter-spacing:1px;text-transform:uppercase;width:130px;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;color:#1a1a1a;font-size:13px;font-weight:500;">${value}</td>
  </tr>`
}

// ── 1. VP Notification — new document submitted ──────────────
export async function notifyVPNewDocument(params: {
  retId:          string
  docTitle:       string
  docType:        string
  department:     string
  submittedBy:    string
  submittedByEmail: string
  remarks:        string
  appUrl?:        string
}): Promise<void> {
  const html = emailWrapper(`
    <h2 style="margin:0 0 6px;color:#0d1b2a;font-size:18px;">New Document Submitted for Approval</h2>
    <p style="color:#555;font-size:13px;margin:0 0 20px;">
      A new RET document has been submitted and is awaiting your review and decision.
    </p>
    <div style="background:#f8f5ef;border:1px solid #e8d9b8;border-left:3px solid #c9952a;border-radius:4px;padding:16px 20px;margin-bottom:20px;">
      <table style="width:100%;border-collapse:collapse;">
        ${infoRow('RET ID',      `<span style="font-family:monospace;color:#c9952a;font-weight:700;">${params.retId}</span>`)}
        ${infoRow('Title',       params.docTitle)}
        ${infoRow('Type',        params.docType)}
        ${infoRow('Department',  params.department)}
        ${infoRow('Submitted By', `${params.submittedBy} &lt;${params.submittedByEmail}&gt;`)}
        ${params.remarks ? infoRow('Remarks', `<em style="color:#666;">${params.remarks}</em>`) : ''}
        ${infoRow('Status',      statusBadge('Pending'))}
      </table>
    </div>
    <p style="color:#555;font-size:13px;">
      Please log in to the OVPRET Document Tracking System to review this document
      and take action (Approve, Reject, or Request Revision).
    </p>
    ${params.appUrl ? `<div style="margin-top:20px;"><a href="${params.appUrl}" style="display:inline-block;padding:11px 24px;background:#c9952a;color:#0d1b2a;text-decoration:none;border-radius:5px;font-weight:700;font-size:13px;letter-spacing:0.5px;">Review Document</a></div>` : ''}
  `)

  await sendEmail({
    toEmail:  VP_EMAIL,
    toName:   VP_NAME,
    subject:  `[OVPRET DTS] New Document for Review — ${params.retId}: ${params.docTitle}`,
    html,
  })
}

// ── 2. Staff Notification — document decision made ───────────
export async function notifyStaffDecision(params: {
  retId:            string
  docTitle:         string
  status:           string
  feedback:         string
  staffName:        string
  staffEmail:       string
  decidedByName:    string
  appUrl?:          string
}): Promise<void> {
  const isApproved  = params.status === 'Approved'
  const isRejected  = params.status === 'Rejected'
  const isRevision  = params.status === 'Request For Revision'

  const actionLine = isApproved
    ? 'Your document has been <strong style="color:#2e7d32;">approved</strong> by the OVPRET Vice President.'
    : isRejected
    ? 'Your document has been <strong style="color:#c62828;">rejected</strong> by the OVPRET Vice President.'
    : 'The OVPRET Vice President has requested revisions on your document. Please review the feedback and resubmit.'

  const actionColor = isApproved ? '#2e7d32' : isRejected ? '#c62828' : '#0277bd'
  const actionBg    = isApproved ? '#e8f5e9' : isRejected ? '#ffebee' : '#e1f5fe'

  const html = emailWrapper(`
    <h2 style="margin:0 0 6px;color:#0d1b2a;font-size:18px;">Document Decision Notification</h2>
    <p style="color:#555;font-size:13px;margin:0 0 16px;">Dear ${params.staffName},</p>
    <div style="background:${actionBg};border:1px solid ${actionColor}40;border-left:3px solid ${actionColor};border-radius:4px;padding:14px 18px;margin-bottom:20px;">
      <p style="margin:0;font-size:13px;color:#333;">${actionLine}</p>
    </div>
    <div style="background:#f8f5ef;border:1px solid #e8d9b8;border-left:3px solid #c9952a;border-radius:4px;padding:16px 20px;margin-bottom:20px;">
      <table style="width:100%;border-collapse:collapse;">
        ${infoRow('RET ID',     `<span style="font-family:monospace;color:#c9952a;font-weight:700;">${params.retId}</span>`)}
        ${infoRow('Title',      params.docTitle)}
        ${infoRow('Decision',   statusBadge(params.status))}
        ${infoRow('Decided By', params.decidedByName)}
      </table>
    </div>
    ${params.feedback ? `
    <div style="margin-bottom:20px;">
      <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#888;margin-bottom:8px;">VP Feedback / Comments</div>
      <div style="background:#fafafa;border:1px solid #e0e0e0;border-radius:4px;padding:14px 16px;font-size:13px;color:#333;line-height:1.6;font-style:italic;">
        "${params.feedback}"
      </div>
    </div>` : ''}
    ${isRevision ? `<p style="color:#555;font-size:13px;">Please log in to the system, review the feedback above, and resubmit your revised document at the earliest opportunity.</p>` : ''}
    ${params.appUrl ? `<div style="margin-top:20px;"><a href="${params.appUrl}" style="display:inline-block;padding:11px 24px;background:#c9952a;color:#0d1b2a;text-decoration:none;border-radius:5px;font-weight:700;font-size:13px;letter-spacing:0.5px;">View Document Status</a></div>` : ''}
  `)

  await sendEmail({
    toEmail:  params.staffEmail,
    toName:   params.staffName,
    subject:  `[OVPRET DTS] Document ${params.status} — ${params.retId}: ${params.docTitle}`,
    html,
  })
}
