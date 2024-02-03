"use client";

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

export default function GoogleSignInButton(props: { nextUrl?: string }) {
  const supabase = createClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${
          props.nextUrl || ""
        }`,
      },
    });
  };

  return (
    <button
      type="button"
      className="flex items-center justify-center w-full h-10 text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
      onClick={handleLogin}
    >
      <Image src="/google.png" alt="google" width={20} height={20} />
      <span className="ml-2 font-medium text-sm">Sign In with Google</span>
    </button>
  );
}
