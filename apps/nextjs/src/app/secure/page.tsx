"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActiveWallet, useDisconnect } from "thirdweb/react";

import { isLoggedIn, logout } from "../actions/authFront";

const AuthenticatedPage = () => {
  // redirect back if user is not logged in
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();
  useEffect(() => {
    async function checkLogin() {
      if (!(await isLoggedIn())) {
        router.push("/");
      }
    }
    checkLogin();
  }, []);

  async function handleLogout() {
    await logout();
    if (wallet) {
      disconnect(wallet);
    }
    router.push("/");
  }

  return (
    <div>
      <h1>Logged In Page</h1>
      <p>You are logged in, so you can see this page!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AuthenticatedPage;
