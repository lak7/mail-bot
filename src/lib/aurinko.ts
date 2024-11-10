"use server";

import { auth } from "@clerk/nextjs/server";

export const getAurinkoAuthRUrl = async (
  serviceType: "Google" | "Office365" = "Google",
) => {
  const session = await auth();

  // Add more detailed logging
  console.log("Auth session:", {
    userId: session.userId,
    sessionId: session.sessionId,
    session: !!session,
  });

  if (!session || !session.userId) {
    console.error("Auth failed: No valid session");
    throw new Error("Session not found");
  }

  const params = new URLSearchParams({
    clientId: process.env.AURINKO_CLIENT_ID as string,
    serviceType,
    scopes:
      "Calendar.Read Calendar.ReadWrite Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All",
    responseType: "token",
    returnUrl: `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`,
  });

  return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`;
};
