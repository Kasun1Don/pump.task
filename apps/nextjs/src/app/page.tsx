import Image from "next/image";
import { redirect } from "next/navigation";

import { HydrateClient } from "~/trpc/server";
import { Login } from "./_components/Login";
import { isLoggedIn } from "./actions/authFront";

export default async function HomePage() {
  if (await isLoggedIn()) {
    redirect("/dashboard");
  }
  return (
    <HydrateClient>
      <main className="bg-custom-bg container flex h-screen items-center justify-center bg-cover bg-center py-16 text-center">
        <div className="flex max-w-5xl flex-col items-center justify-center gap-4">
          <div className="flex gap-3">
            <Image src="/pump.taskLogo.png" alt="Logo" width={50} height={50} />
            <h1 className="text-5xl font-bold tracking-tight">pump.task</h1>
          </div>
          <div className="bg-zesty-green text-zesty-green rounded-full bg-opacity-10 p-3">
            Web3 Project Management Stack
          </div>
          <p className="text-7xl">Keep your project on track & get rewarded</p>
          <p className="text-lg">
            Pump.Task is designed to revolutionise the way teams manage and
            complete their tasks, combining the traditional efficiency of tools
            like Jira and Trello with the rewarding nature of Web3.
          </p>

          <Login />
        </div>
      </main>
    </HydrateClient>
  );
}
