import Image from "next/image";
import { UtensilsCrossed } from "lucide-react";
import type { SiteImage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ImgProps {
  image?: SiteImage | null;
  /** Responsive `sizes` hint, e.g. "(min-width: 1024px) 33vw, 100vw". */
  sizes: string;
  className?: string;
  preload?: boolean;
  alt?: string;
}

/** Fills its (relatively positioned) parent and crops around the editor's focal point. */
export function Img({ image, sizes, className, preload, alt }: ImgProps) {
  if (!image) {
    return (
      <div
        className={cn(
          "absolute inset-0 grid place-items-center bg-gradient-to-br from-sand to-sand-deep text-muted/60",
          className,
        )}
      >
        <UtensilsCrossed className="size-10" strokeWidth={1.25} />
      </div>
    );
  }

  return (
    <Image
      src={image.src}
      alt={alt ?? image.alt}
      fill
      sizes={sizes}
      preload={preload}
      fetchPriority={preload ? "high" : undefined}
      placeholder={image.blurDataURL ? "blur" : "empty"}
      blurDataURL={image.blurDataURL}
      className={cn("object-cover", className)}
      style={image.position ? { objectPosition: image.position } : undefined}
    />
  );
}
