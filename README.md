This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Better Auth (Credentials + OAuth)

This project uses Better Auth with email/password and optional social providers.

Set these environment variables to enable social login:

| Variable | Description |
| --- | --- |
| `GOOGLE_CLIENT_ID` | Google OAuth client id (server-side). |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (server-side). |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client id (server-side). |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret (server-side). |
| `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED` | Set to `true` to show the Google button in login/register UI. |
| `NEXT_PUBLIC_AUTH_GITHUB_ENABLED` | Set to `true` to show the GitHub button in login/register UI. |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Base app URL used by Better Auth client (for example `http://localhost:3000`). |
| `TRUSTED_ORIGINS` | Comma-separated origins allowed by Better Auth (for example `http://localhost:3000,https://yourdomain.com`). |

Notes:
- Social provider auth is enabled only when both client id and client secret are present.
- Keep `NEXT_PUBLIC_AUTH_*_ENABLED` aligned with server credentials so only working providers are shown.
- In each provider dashboard, set callback URL to your Better Auth route: `/api/auth/callback/{provider}`.

## Stripe Checkout Setup

Stripe powers the checkout and order finalization flow. Configure the following environment variables before running the app:

| Variable | Description |
| --- | --- |
| `STRIPE_SECRET_KEY` | Required. Create a restricted secret key in the Stripe dashboard and paste it here so server actions can create Checkout Sessions. |
| `NEXT_PUBLIC_APP_URL` | Optional but recommended. The absolute origin (for example `http://localhost:3000` in development or `https://example.com` in production) used to build Stripe success/cancel redirect URLs. |

After setting the variables, restart the dev server. When customers submit the checkout form we create a Stripe Checkout Session, redirect them to the hosted payment page, and then finalize the order on `/checkout/success` once Stripe confirms the payment. Successful payments redirect customers to `/thankyou` where they can review the most recent order.
