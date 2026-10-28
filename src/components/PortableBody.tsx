import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
import type { SiteImage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getYouTubeId, isYouTubeShort } from "@/lib/youtube";
import { Img } from "./Img";
import { YouTubePlayer } from "./YouTubePlayer";

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: { image?: SiteImage } }) => {
      const image = value.image;
      if (!image) return null;
      return (
        <figure className="!my-10">
          <div
            className="relative overflow-hidden rounded-[var(--radius-card)] bg-sand"
            style={{ aspectRatio: `${image.width} / ${image.height}` }}
          >
            <Img image={image} sizes="(min-width: 768px) 720px, 100vw" />
          </div>
          {image.caption && <figcaption className="mt-3 text-center text-sm text-muted">{image.caption}</figcaption>}
        </figure>
      );
    },
    youtube: ({ value }: { value: { url?: string } }) => {
      const id = getYouTubeId(value.url);
      if (!id) return null;
      return (
        <div className="!my-10">
          <YouTubePlayer id={id} title="Video" short={isYouTubeShort(value.url)} />
        </div>
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//.test(href);
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    },
  },
};

export function PortableBody({ value, className }: { value?: PortableTextBlock[]; className?: string }) {
  if (!value?.length) return null;
  return (
    <div className={cn("prose-plate", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
