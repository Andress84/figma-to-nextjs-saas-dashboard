import { ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface ProfileRowProps {
  initials: string;
  name: string;
  role: string;
}

export function ProfileRow({ initials, name, role }: Readonly<ProfileRowProps>) {
  return (
    <div className="profile-row">
      <Avatar className="profile-avatar" name={name} initials={initials} decorative />
      <span className="profile-copy">
        <strong>{name}</strong>
        <span>{role}</span>
      </span>
      <ChevronRight className="profile-chevron" size={17} aria-hidden="true" />
    </div>
  );
}
