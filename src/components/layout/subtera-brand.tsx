import Link from "next/link";
import { appShellConfig } from "@/data/mock/app-shell";

export function SubteraBrand() {
  return (
    <Link className="subtera-brand" href="/" aria-label={`${appShellConfig.brand.name} overview`}>
      <span className="subtera-brand-mark" aria-hidden="true">
        S
      </span>
      <span>{appShellConfig.brand.name}</span>
    </Link>
  );
}
