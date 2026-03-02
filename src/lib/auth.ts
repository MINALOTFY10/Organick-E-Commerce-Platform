import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail, sendVerificationOtpEmail } from "@/lib/email";

const socialProviders = {
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {}),
  ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
      }
    : {}),
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER",
      },
    },
  },

  // Email & Password Authentication
  emailAndPassword: {
    enabled: true,
    // Require email verification before the user can sign in
    requireEmailVerification: true,

    // Password reset — better-auth calls this when a user requests a reset link
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ to: user.email, resetUrl: url });
    },
  },

  socialProviders,

  // Trusted origins (important for CORS)
  // Comma-separated list, e.g. TRUSTED_ORIGINS=https://example.com,https://www.example.com
  trustedOrigins: process.env.TRUSTED_ORIGINS
    ? process.env.TRUSTED_ORIGINS.split(",").map((o) => o.trim())
    : process.env.NODE_ENV === "production"
      ? [] // Force explicit configuration in production
      : ["http://localhost:3000"],

  // Next.js specific plugin for handling cookies in server actions
  plugins: [
    // Email OTP — used for code-based email verification on sign-up
    emailOTP({
      // When a user signs up, immediately send a verification code
      sendVerificationOnSignUp: true,
      // Replace the default link-based email verification with OTP codes
      overrideDefaultEmailVerification: true,
      otpLength: 6,
      expiresIn: 600, // 10 minutes
      async sendVerificationOTP({ email, otp }) {
        // Await so any send error appears in the server console
        await sendVerificationOtpEmail({ to: email, otp });
      },
    }),
    nextCookies(), // MUST be last in the plugins array
  ],
});

// Type exports for TypeScript
export type Session = typeof auth.$Infer.Session;

export type UserRole = "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";