import { ChevronRight } from "lucide-react";

interface ProfileRowProps {
  initials: string;
  name: string;
  role: string;
}

export function ProfileRow({ initials, name, role }: Readonly<ProfileRowProps>) {
  return (
    <div className="profile-row">
      <span className="profile-avatar" aria-hidden="true">
        {initials}
      </span>
      <span className="profile-copy">
        <strong>{name}</strong>
        <span>{role}</span>
      </span>
      <ChevronRight className="profile-chevron" size={17} aria-hidden="true" />
    </div>
  );
}
