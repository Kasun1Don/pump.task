import { signOut } from "@acme/auth";
import { Button } from "@acme/ui/button";

export function AuthShowcase() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await signOut();
          }}
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
