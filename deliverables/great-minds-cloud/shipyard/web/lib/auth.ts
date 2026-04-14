/**
 * Authentication configuration for Shipyard
 * Uses NextAuth with email magic link authentication
 */

import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const authConfig: NextAuthConfig = {
  adapter: DrizzleAdapter(db),
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier: email, url }) => {
        const { host } = new URL(url);

        await transporter.sendMail({
          to: email,
          from: process.env.EMAIL_FROM,
          subject: `Sign in to Shipyard`,
          text: `Sign in to Shipyard\n\nClick this link to sign in:\n${url}\n\nIf you didn't request this email, you can safely ignore it.`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <title>Sign in to Shipyard</title>
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; padding: 40px 20px;">
                <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                  <h1 style="color: #0c4a6e; font-size: 24px; margin: 0 0 24px 0;">Shipyard</h1>
                  <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                    Click the button below to sign in to your Shipyard account. This link expires in 24 hours.
                  </p>
                  <a href="${url}" style="display: inline-block; background-color: #0ea5e9; color: white; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 8px; margin-bottom: 24px;">
                    Sign in to Shipyard
                  </a>
                  <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 24px 0 0 0;">
                    If you didn't request this email, you can safely ignore it.
                  </p>
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    This email was sent from ${host}
                  </p>
                </div>
              </body>
            </html>
          `,
        });
      },
    }),
  ],
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle post-login redirect to project page if coming from checkout
      if (url.startsWith('/project/')) {
        return url;
      }
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    },
  },
  events: {
    async createUser({ user }) {
      console.log(`[Auth] New user created: ${user.email}`);
    },
    async signIn({ user }) {
      console.log(`[Auth] User signed in: ${user.email}`);
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Helper to get current session in server components
export async function getSession() {
  return await auth();
}

// Helper to require authentication
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Authentication required');
  }
  return session;
}
