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

    const getUserType = async (email: string) => {
      const checkTable = async (table: string, email: string) => {
        const { data, error } = await supabase
          .from(table)
          .select(`${table}_email`)
          .eq(`${table}_email`, email);

        return data && data.length > 0 && !error;
      };

      const isAdmin = await checkTable("admin", email);
      const isFaculty = await checkTable("faculty", email);
      const isStudent = await checkTable("student", email);

      if (isAdmin) {
        console.log("admin");
        return "admin";
      } else if (isFaculty) {
        console.log("faculty");
        return "faculty";
      } else if (isStudent) {
        console.log("student");
        return "student";
      }

      return null;
    };

    let userType = null;
    if (data?.user?.email) userType = await getUserType(data.user.email);

    if (data && !userType) {
      const { error } = await supabase.auth.signOut();
      console.log("error", error);
      const errorMessage = "user not found";
      return NextResponse.redirect(
        `${origin}/auth/login?error=${errorMessage}`
      );
    }

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // TODO: Create this page
  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/login?error=unknown-error`);
}
