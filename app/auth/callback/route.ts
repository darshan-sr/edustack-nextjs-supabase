import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const cookieStore = cookies();

  const code = searchParams.get("code");

  // if "next" is in param, use it in the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    console.log("code", code);
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    console.log("data", data.user.email);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // TODO: Create this page
  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/login?error=unknown-error`);
}
