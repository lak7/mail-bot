import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { userId } = await auth();
  console.log("User Id IS: ", { userId });
  return NextResponse.json({ "YOOO Bitch!" });
};
