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
  if (data?.email) userType = await getUserType(data.email);

  if (userType) {
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      return error.message;
    }
    revalidatePath("/", "layout");
    redirect(`/${userType}`);
  } else {
    return "User not found";
  }
}

export async function SignOut() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/auth/login");
}
