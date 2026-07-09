# SWL Training Hub — User Invitations & Onboarding

This document covers every way to invite users to the platform, what the sign-up flow looks like, and how to manage users and email templates.

---

## How Access Works

The platform is invite-only. A new user cannot reach the training content until two conditions are met:

1. They have a Clerk account (signed up via `/sign-up`)
2. Their account has been **approved** (`publicMetadata.approved = true` in Clerk)

Users who sign up without being pre-approved land on `/pending` and wait until an admin grants access.

---

## Invitation Methods

There are three ways to invite someone.

### 1. Organisation Access Code (recommended for groups)

Use this when onboarding an entire organisation (e.g. a clinic). The organisation receives a 4-digit code by email; every person at that organisation uses the same code to self-register.

**Steps:**

1. Go to **Admin → Organisations**
2. Click **+ Add access code** and fill in the organisation name, contact email, and a 4-digit code
3. Once saved, click **Send invite** on that row — this sends the MailerSend email with the code
4. The recipient shares the code with their team
5. Each team member visits `/sign-up`, enters the code, and completes Clerk sign-up
6. On the `/pending` page, the valid-code cookie is detected and the account is **auto-approved immediately** — no admin action needed

> The code is stored as a `client_access_code` document in Prismic. You can also create codes directly in Prismic if preferred.

---

### 2. Clerk Email Invitation (individual, auto-approved)

Use this when inviting a specific person. Clerk sends them an email with a magic sign-up link; clicking it bypasses the code gate and sets their account as approved automatically.

**Steps:**

1. Go to **Admin → Invite Users**
2. Enter the person's email address and click **Send invitation**
3. Clerk emails them a personalised link to `/sign-up`
4. They click the link, complete sign-up — account is approved on creation, no pending page

---

### 3. Direct Invite Link (individual, no email required)

Use this to share a link manually (e.g. over Slack or WhatsApp). The link contains a signed HMAC token valid for 24 hours.

**Steps:**

1. Go to **Admin → Invite Users**
2. Click **Copy invite link** — a signed URL is copied to your clipboard
3. Share the link with the person directly
4. They visit the link, complete sign-up — account is auto-approved on the `/pending` page (same cookie mechanism as the access code flow)

> The link expires after 24 hours. Generate a new one if it lapses.

---

## Sign-Up Flow (what the user sees)

```
/sign-up
  ├── Arrived via Clerk invitation link (?__clerk_ticket)
  │     └── Clerk SignUp form shown directly → approved on creation
  │
  ├── Arrived via direct invite link (?invite_token)
  │     └── Token verified → approval cookie set → Clerk SignUp form
  │           └── /pending → auto-approved → redirected to /
  │
  └── Arrived directly (no token)
        └── CodeGate: enter 4-digit code
              ├── Invalid code → error shown
              └── Valid code → approval cookie set → Clerk SignUp form
                    └── /pending → auto-approved → redirected to /
```

---

## Admin Pages

### All Users (`/admin`)

Lists every registered Clerk user. From here you can:

- **Approve / revoke access** — toggle the switch in the Access column
- **Change role** — use the Role dropdown (User / Admin)

### Pending Approval (`/admin/pending`)

Lists users whose accounts are not yet approved. Useful for catching anyone who signed up without a valid invite or code.

### Invite Users (`/admin/invite`)

- Send a Clerk invitation email to a specific address
- Generate and copy a 24-hour direct invite link

### Organisations (`/admin/organisations`)

- View all organisations and their access codes
- Send the invitation email (with the code) to the organisation contact
- Add new organisations with the **+ Add access code** sheet

---

## Editing the Invitation Email (MailerSend)

The organisation invitation email is sent using a template stored in your MailerSend account.

**To edit the template:**

1. Log in to [mailersend.com](https://www.mailersend.com)
2. Go to **Email → Templates**
3. Open the template used for SWL Training Hub invitations
4. Edit the content using the drag-and-drop builder or HTML editor

**Variables available in the template:**

| Variable | Value |
|---|---|
| `{{ name }}` | Organisation name |
| `{{ code }}` | The 4-digit access code |
| `{{ sign_up_url }}` | Full URL to the sign-up page |

Use these in your template body wherever needed. Example:

> Hi `{{ name }}`, your access code is **`{{ code }}`**. Register at `{{ sign_up_url }}`.

**To use a different template**, update `MAILERSEND_TEMPLATE_ID` in your `.env` file with the new template's ID (found in MailerSend under the template settings).

---

## Environment Variables Reference

| Variable | Purpose |
|---|---|
| `MAILERSEND_API_KEY` | MailerSend API key |
| `MAILERSEND_DOMAIN` | Sending domain (e.g. `mail.yourdomain.com`) |
| `MAILERSEND_TEMPLATE_ID` | ID of the organisation invitation template |
| `NEXT_PUBLIC_BASE_URL` | Base URL used in email links (e.g. `https://yourdomain.com`) |
| `PRISMIC_WRITE_TOKEN` | Prismic write token for creating access code documents |
| `CLERK_SECRET_KEY` | Clerk secret for server-side API calls |