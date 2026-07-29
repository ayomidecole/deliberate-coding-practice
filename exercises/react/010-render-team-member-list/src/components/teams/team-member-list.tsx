import type { TeamMember } from "../../types/team-member";

export type TeamMemberListProps = {
  readonly members: readonly TeamMember[];
};

export function TeamMemberList({ members }: TeamMemberListProps) {
  return null;
}
