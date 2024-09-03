import { HydrateClient } from "~/trpc/server";
import { CreatePostForm } from "./_components/posts";

export default function HomePage() {
  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-primary">T3</span> Turbo
          </h1>
          ENVIRONMENT: {process.env.NEXT_PUBLIC_DEPLOYMENT_ENVIRONMENT}
          <CreatePostForm />
        </div>
      </main>
    </HydrateClient>
  );
}
