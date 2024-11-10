import { getAccountDetails } from "@/lib/aurinko";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const params = req.nextUrl.searchParams;
  const status = params.get("status");
  if (status != "success")
    return NextResponse.json(
      { message: "Failed to link to account" },
      { status: 400 },
    );

  const token = params.get("token");
  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 400 });
  }

  const accountDetails = await getAccountDetails(token);
  console.log("Account details:", accountDetails);

  await db.user.upsert;
  ({
    where: { id: accountDetails.id.toString() },
    update: {
      accessToken: token,
    },
    create: {
      id: accountDetails.id.toString(),
      userId,
      aurinkoToken: token,
      emailAddress: accountDetails.email,
      name: accountDetails.name,
    },
  });

  return NextResponse.json({ message: "YOOO Bitch!" });
};
