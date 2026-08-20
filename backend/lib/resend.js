import "dotenv/config";
import { Resend } from "resend";

export const resendClient = new Resend(process.env.RESEND_API_KEY);

const DEFAULT_FROM = "onboarding@resend.dev";
const fromEnv = process.env.EMAIL_FROM;
const usesUnverifiedDomain = !fromEnv || /@example\.com$/i.test(fromEnv);

export const sender = {
  email: usesUnverifiedDomain ? DEFAULT_FROM : fromEnv,
  name: process.env.EMAIL_FROM_NAME || "Messenger",
};
