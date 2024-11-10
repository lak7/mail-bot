"use server";

import { auth } from "@clerk/nextjs/server";
import axios from "axios";

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

  const clientId = process.env.AURINKO_CLIENT_ID;
  if (!clientId) {
    console.error("Missing AURINKO_CLIENT_ID environment variable");
    throw new Error("Missing AURINKO_CLIENT_ID configuration");
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL;
  if (!baseUrl) {
    console.error("Missing NEXT_PUBLIC_URL environment variable");
    throw new Error("Missing NEXT_PUBLIC_URL configuration");
  }

  const params = new URLSearchParams({
    clientId,
    serviceType,
    scopes: "Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All",
    responseType: "token",
    returnUrl: `${baseUrl}/api/aurinko/callback`,
  });

  const url = `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`;
  console.log("Generated URL:", url); // Log the final URL

  return url;
};

export const getAccountDetails = async (accessToken: string) => {
  try {
    const response = await axios.get("https://api.aurinko.io/v1/account", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data as {
      id: string;
      email: string;
      name: string;
    };
  } catch (e) {
    console.error("Error getting account details", e);
    throw new Error("Error getting account details");
  }
};
