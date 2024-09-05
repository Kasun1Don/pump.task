import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

export default function GlobalNavbarLayout(props: {
  children: React.ReactNode;
}) {
  /**
   * This is a mockup of the data that would be passed to the Navbar component just so that we can see how it would look.
   */
  const username = "Ben Davies";
  const currentProject = "Project 1";
  const project1 = "Project 1";
  const project2 = "Project 2";
  const project3 = "Project 3";

  return (
    <div>
      <h1>Navbar</h1>
      <div className="flex flex-row justify-between gap-4">
        <div className="flex flex-row gap-12">
          <div className="logo">Logo</div>
          <h5>Web3 Project Tracker</h5>
        </div>
        <div className="flex gap-12">
          <DropdownMenu>
            <DropdownMenuTrigger>{currentProject}</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>{project1}</DropdownMenuItem>
              <DropdownMenuItem>{project2}</DropdownMenuItem>
              <DropdownMenuItem>{project3}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Create new project</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span
                className={`inline-block h-6 w-6 rounded-full bg-lime-800`}
              ></span>
              {username}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {props.children}
    </div>
  );
}
