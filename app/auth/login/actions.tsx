"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/actions";

export async function login(formData: FormData) {
  const cookieStore = cookies();

  const supabase = createClient(cookieStore);

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: adminData } = await supabase
    .from("admin")
    .select("email")
    .eq("email", data.email.toLowerCase());

  if (adminData && adminData.length > 0) {
    console.log("adminData", adminData);
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      return error.message;
    }
    revalidatePath("/", "layout");
    redirect("/admin");
  } else {
    return "User not found";
  }
}

export async function signup(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signInWithGoogle() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  let { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    return error.message;
  }

  if (data) {
    console.log(data);
    redirect(data.url as string);
  }
}

export async function SignOut() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/auth/login");
}
