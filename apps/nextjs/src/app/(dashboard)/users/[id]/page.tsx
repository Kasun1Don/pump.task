import type { ProjectClass } from "@acme/db";

import { AddMember } from "~/app/_components/_users/addMember";
import { EditMember } from "~/app/_components/_users/editMember";
import { api } from "~/trpc/server";

export default async function UsersPage({
  params,
}: {
  params: { id: string };
}) {
  const response = await api.project.byId({ id: params.id });
  // Destructure user data from response
  const projectData: ProjectClass | null = response as ProjectClass;

  return (
    <div className="mx-20 mt-3 flex flex-col gap-3">
      <AddMember projectId={params.id} />
      <div className="grid grid-cols-6 gap-3 rounded border-2 p-5">
        <div className="col-span-6 grid grid-cols-6 border-b-2 font-bold">
          <span>Name</span>
          <span>Email</span>
          <span>Wallet</span>
          <span>Role</span>
          <span></span>
        </div>
        {projectData.members.map((member, index) => (
          <>
            <span>{member.name ? member.name : "not available"}</span>
            <span>{member.email ? member.email : "not available"}</span>
            <span className="col-span-2">
              {member.walletId ? member.walletId : "not available"}
            </span>
            <span>{member.role}</span>
            {index ? (
              <EditMember
                walletId={member.walletId ?? ""}
                projectId={params.id}
              />
            ) : (
              <span></span>
            )}
          </>
        ))}
      </div>
    </div>
  );
}
