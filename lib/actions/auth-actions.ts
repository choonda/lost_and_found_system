"use server";

import { redirect } from "next/dist/client/components/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";

export const signUp = async (email: string, password: string, name: string) => {
  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      callbackURL: "/home",
    },
  });

  return result;
};

export const signIn = async (email: string, password: string) => {
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
      callbackURL: "/home",
    },
  });

  return result;
};

export const signInSocial = async (provider: "google") => {
  const {url} = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: "/home",
    },
  });

  if (url)  {
    redirect(url)
  }
};

export const signOut = async () => {
  const result = await auth.api.signOut({ headers: await headers() });

  return result;
};

