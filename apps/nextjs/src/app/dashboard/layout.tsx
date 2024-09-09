import Image from "next/image";
import Link from "next/link";

import HotKeyEventListeners from "../_components/navbar/HotKeyEventListeners";
import NavProjectDropdown from "../_components/navbar/NavProjectDropdown";
import NavUserDropdown from "../_components/navbar/NavUserDropdown";

export default function GlobalNavbarLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <>
    <div className="min-h-screen bg-custom-bg bg-cover bg-center">
      <div className="flex flex-row justify-between gap-4 px-12 py-8">
        {/* This is the Pump Logo */}
        <div className="flex flex-row items-center justify-center gap-8">
          <div className="flex flex-row gap-4 text-xl">
            <Image
              src="/PumpLogo.png"
              alt="Chevron Down"
              width={26}
              height={18}
              className="h-auto w-auto"
            />
            <h1 className="text-2xl font-bold">pump.task</h1>
          </div>
          <h5 className="h-fit rounded-md bg-zinc-800 px-2 py-1 text-xs text-lime-500">
            Web3 Project Tracker
          </h5>
        </div>

        <div className="flex gap-10 hover:cursor-pointer">
          {/* This is the Project dropdown Menu. Quick note will probably make this conditional rendered in the future so if users don't have any projects it just renders a button to create a new project. */}
          <NavProjectDropdown />
          {/* This is the users Drop down Menu with profile, setting and logout buttons*/}
          <NavUserDropdown />
        </div>
      </div>

      {/* This is the navigation bar at the bottom of the display it just creates links to each page */}
      <div className="flex flex-wrap border-b-2">
        <Link
          href="/dashboard/projects"
          className="flex h-8 w-32 items-center justify-center text-center text-lg text-slate-500 hover:border-b-2 hover:border-white hover:text-slate-50"
        >
          Projects
        </Link>
        <Link
          href="/dashboard/tasks"
          className="flex h-8 w-32 items-center justify-center text-center text-lg text-slate-500 hover:border-b-2 hover:border-white hover:text-slate-50"
        >
          Tasks
        </Link>
        <Link
          href="/dashboard/profile"
          className="flex h-8 w-32 items-center justify-center text-center text-lg text-slate-500 hover:border-b-2 hover:border-white hover:text-slate-50"
        >
          My Profile
        </Link>
        <Link
          href="/dashboard/users"
          className="flex h-8 w-32 items-center justify-center text-center text-lg text-slate-500 hover:border-b-2 hover:border-white hover:text-slate-50"
        >
          Users
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex h-8 w-32 items-center justify-center text-center text-lg text-slate-500 hover:border-b-2 hover:border-white hover:text-slate-50"
        >
          Settings
        </Link>
      </div>

      {/* This is the event listener for hotkeys profile, setting, logout */}
      <HotKeyEventListeners />

      {/* This just specifies where the children components will be rendered in application */}
      {props.children}
    </div>
    </>
  );
}
