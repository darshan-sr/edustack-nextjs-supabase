"use client";
import React from "react";
import getUser from "@/utils/supabase/getUser";

import { useRouter } from "next/navigation";
import { SignOut } from "./auth/login/actions";

const page = () => {
  const user = getUser();

  return (
    <>
      {user ? (
        <>
          <p>{`username: ${user?.user_metadata?.full_name}`}</p>
          <p>{`email: ${user?.email}`}</p>
        </>
      ) : (
        <p>Loading ...</p>
      )}

      <br />

      <button
        onClick={() => {
          SignOut();
        }}
      >
        Log out
      </button>
    </>
  );
};

export default page;
