import { Mail } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";
import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon } from "./icons";

export function SocialLinks({ social, className }: { social: SiteSettings["social"]; className?: string }) {
  const links = [
    social.youtube && { href: social.youtube, label: "YouTube", Icon: YouTubeIcon },
    social.instagram && { href: social.instagram, label: "Instagram", Icon: InstagramIcon },
    social.tiktok && { href: social.tiktok, label: "TikTok", Icon: TikTokIcon },
    social.facebook && { href: social.facebook, label: "Facebook", Icon: FacebookIcon },
    social.email && { href: `mailto:${social.email}`, label: "Email", Icon: Mail },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof Mail }[];

  if (!links.length) return null;

  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={label}
            className="grid size-10 place-items-center rounded-full text-current ring-1 ring-current/20 transition hover:bg-current/10 hover:ring-current/40"
          >
            <Icon className="size-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
