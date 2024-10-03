import Image from "next/image";

import { HydrateClient } from "~/trpc/server";
import { Login } from "./_components/HomePage";

export default function HomePage() {
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
          <div className="mb-8 flex items-center gap-3 rounded-full bg-black p-4">
            4 Networks{" "}
            <Image
              src="/networks.png"
              alt="networks logos"
              width={100}
              height={50}
            />
          </div>

          <Login />

          <p className="mt-8">Trusted by industry leaders.</p>
          <div className="flex gap-7">
            <Image
              src="/leaders1.png"
              alt="leaders logos"
              width={60}
              height={60}
            />
            <Image
              src="/leaders2.png"
              alt="leaders logos"
              width={60}
              height={60}
            />
            <Image
              src="/leaders3.png"
              alt="leaders logos"
              width={60}
              height={60}
            />
            <Image
              src="/leaders4.png"
              alt="leaders logos"
              width={60}
              height={60}
            />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
