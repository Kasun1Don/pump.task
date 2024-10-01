import type { ProjectClass } from "@acme/db";

import { AddMember } from "~/app/_components/_users/addMember";
import { EditMember } from "~/app/_components/_users/editMember";
import { createServerSideFetch } from "~/app/actions/createServerSideFetchHelper";

export default async function UsersPage({
  params,
}: {
  params: { id: string };
}) {
  const caller = await createServerSideFetch();
  const response = await caller.project.byId({ id: params.id });
  // Destructure user data from response
  const projectData: ProjectClass | null = response as ProjectClass;

  return (
    <div className="flex flex-col">
      <AddMember projectId={params.id} />
      <div className="grid grid-cols-6 gap-3">
        <span className="font-bold">Name</span>
        <span className="font-bold">Email</span>
        <span className="col-span-2 font-bold">Wallet</span>
        <span className="font-bold">Role</span>
        <span></span>
        {projectData.members.map((member) => (
          <>
            <span>{member.name ? member.name : "not available"}</span>
            <span>test</span>
            <span className="col-span-2">
              {member.walletId ? member.walletId : "not available"}
            </span>
            <span>{member.role}</span>
            <EditMember
              walletId={member.walletId ?? ""}
              projectId={params.id}
            />
          </>
        ))}
      </div>
    </div>
  );
}
