// src/app/api/session/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    cookies().delete("session");
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
