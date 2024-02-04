import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

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

  const { data: userData } = await supabase.auth.getUser();

  let userType = null;
  if (userData?.user?.email) userType = await getUserType(userData.user.email);

  console.log("userType", userType);

  if (request.nextUrl.pathname === "/" && !userType) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  } else if (request.nextUrl.pathname === "/" && userType) {
    if (userType === "student") {
      return NextResponse.redirect(new URL("/student", request.url));
    } else if (userType === "faculty") {
      return NextResponse.redirect(new URL("/faculty", request.url));
    } else if (userType === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  if (
    request.nextUrl.pathname.startsWith("/student") ||
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/faculty")
  ) {
    if (!userType) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  if (
    userType === "student" &&
    (request.nextUrl.pathname.startsWith("/faculty") ||
      request.nextUrl.pathname.startsWith("/admin"))
  ) {
    return NextResponse.redirect(new URL("/student", request.url));
  } else if (
    userType === "faculty" &&
    (request.nextUrl.pathname.startsWith("/student") ||
      request.nextUrl.pathname.startsWith("/admin"))
  ) {
    return NextResponse.redirect(new URL("/faculty", request.url));
  } else if (
    userType === "admin" &&
    (request.nextUrl.pathname.startsWith("/student") ||
      request.nextUrl.pathname.startsWith("/faculty"))
  ) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
