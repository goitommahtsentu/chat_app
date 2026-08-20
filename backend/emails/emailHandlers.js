import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailsTemplet.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to Messenger",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    throw new Error(error.message);
  }

  console.log("Welcome email sent successfully", data);
};
