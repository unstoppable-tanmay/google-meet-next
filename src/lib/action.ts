// src/lib/actions.ts
"use server";

import { signIn } from "next-auth/react";

export async function googleAuthenticate() {
  try {
    await signIn("google");
  } catch (error) {
    if (error) {
      return "google log in failed";
    }
    throw error;
  }
}
