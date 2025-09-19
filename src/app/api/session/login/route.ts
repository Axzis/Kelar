// src/app/api/session/login/route.ts
import { auth } from "firebase-admin";
import { initAdmin } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Inisialisasi Firebase Admin SDK
initAdmin();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idToken = body.idToken;

    if (!idToken) {
      return NextResponse.json({ error: "ID token is required" }, { status: 400 });
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 hari
    const sessionCookie = await auth().createSessionCookie(idToken, { expiresIn });

    cookies().set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Error creating session cookie:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
