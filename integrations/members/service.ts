import type { Member } from ".";

export const getCurrentMember = async (): Promise<Member | null> => {
  try {
    const { members } = await import("@wix/members");
    const member = await members.getCurrentMember({ fieldsets: ["FULL"] });
    if (!member) {
      console.log('==== No member found');
    }
    return member.member;
  } catch (error) {
    // No Wix runtime (standalone) or not signed in — return null.
    console.log(error);
    return null;
  }
};
