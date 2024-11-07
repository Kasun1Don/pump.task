import type { ProjectClass, UserClass } from "@acme/db";

import { AddMember } from "~/app/_components/_users/addMember";
import { EditMember } from "~/app/_components/_users/editMember";
import { api } from "~/trpc/server";

type MembersType = { role: string; userData: UserClass }[];

export default async function UsersPage({
  params,
}: {
  params: { id: string };
}) {
  const response = await api.project.byId({ id: params.id });
  // Destructure user data from response
  const projectData: ProjectClass | null = response as ProjectClass;
  let members: MembersType = [];
  try {
    members = await api.member.byProjectIdProtected({ projectId: params.id });
  } catch (err) {
    console.log(err);
    return <p>You are not authorized to view the members of this project</p>;
  }

  return (
    <div className="mx-4 mt-3 flex flex-col gap-3 sm:mx-20">
      <div className="flex w-full justify-between">
        <h2>{projectData.name}</h2>
        <AddMember projectId={params.id} />
      </div>

      <div className="grid grid-cols-6 gap-3 rounded border-2 p-1">
        <div className="col-span-6 grid grid-cols-6 border-b-2 font-bold">
          <span>Name</span>
          <span>Email</span>
          <span className="col-span-2">Wallet</span>
          <span>Role</span>
          <span></span>
        </div>
        {members.map((member, index) => (
          <>
            {/* break-words allows long text to wrap to the next line*/}
            <span className="break-words">{member.userData.name}</span>
            <span className="break-words">{member.userData.email}</span>
            <span className="col-span-2 break-all">
              {member.userData.walletId}
            </span>
            <span>{member.role}</span>
            <EditMember
              walletId={member.userData.walletId ?? ""}
              projectId={params.id}
              isOwner={!index}
            />
          </>
        ))}
      </div>
    </div>
  );
}
