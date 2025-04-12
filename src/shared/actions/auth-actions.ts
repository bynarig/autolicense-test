"use server";

import { signIn, signOut } from "@/app/auth";

export async function googleSignIn(callbackUrl: string = "/") {
  await signIn("google", { redirectTo: callbackUrl });
}

export async function userSignOut(callbackUrl: string = "/") {
  await signOut({ redirectTo: callbackUrl });
}
