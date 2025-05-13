"use client";

import { useUser } from "@clerk/nextjs";

export default function ProtectedPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Not signed in</div>;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>This is a protected page</div>

        <div>
          <h1>Hello, {user.firstName}!</h1>
          <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
        </div>
      </main>
    </div>
  );
}
