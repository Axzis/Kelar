// src/app/api/session/logout/route.ts
import { auth } from "firebase-admin";
import { initAdmin } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

initAdmin();

export async function POST(request: NextRequest) {
  const sessionCookie = cookies().get("session")?.value;

  if (!sessionCookie) {
    return NextResponse.json({ status: "success" });
  }

  try {
    const decodedClaims = await auth().verifySessionCookie(sessionCookie);
    await auth().revokeRefreshTokens(decodedClaims.sub);
    
    cookies().delete("session");

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Error logging out:", error);
    // Even if revocation fails, deleting the cookie is the priority
    cookies().delete("session");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
