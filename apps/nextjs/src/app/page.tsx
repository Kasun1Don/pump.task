import { HydrateClient } from "~/trpc/server";
import { Login } from "./_components/Login";

// import { CreatePostForm } from "./_components/posts";

export default function HomePage() {
  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            pump.task
          </h1>
          {/* <CreatePostForm /> */}
          <Login />
        </div>
      </main>
    </HydrateClient>
  );
}
