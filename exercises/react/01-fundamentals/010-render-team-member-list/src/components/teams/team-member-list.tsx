import type { TeamMember } from "../../types/team-member";

export type TeamMemberListProps = {
  readonly members: readonly TeamMember[];
};

export function TeamMemberList({ members }: TeamMemberListProps) {
  return (
    <section>
      <h2>Team members</h2>
      <ul>
        {members.map((member) => {
          return <li key={member.id}>{member.displayName}: {member.role}</li>
        })}
      </ul>
    </section>
  )
}
