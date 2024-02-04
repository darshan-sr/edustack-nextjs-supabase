"use client";
import React from "react";
import { SignOut } from "../auth/logout/actions";
import getUser from "@/utils/supabase/getUser";

const ProtectedPage = () => {
  const user = getUser();
  return (
    <div className="dark:bg-gray-800 dark:text-white flex flex-col">
      {user ? (
        <>
          <p>{`username: ${user?.user_metadata?.full_name}`}</p>
          <p>{`email: ${user?.email}`}</p>
        </>
      ) : (
        <p>Loading ...</p>
      )}
      <button className="" onClick={() => SignOut()}>
        Log out
      </button>
    </div>
  );
};

export default ProtectedPage;
