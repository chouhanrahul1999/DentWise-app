"use client"

import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <h1>Home page</h1>
      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
    </div>
  );
}
