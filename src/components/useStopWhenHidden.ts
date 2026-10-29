"use client";

import { useLayoutEffect, useRef, type Dispatch, type SetStateAction } from "react";

/**
 * Next.js keeps recently visited pages alive but hidden, so a YouTube player
 * would keep playing after the visitor moves to another page. When the player
 * is hidden (or removed), unload the video straight away and go back to the
 * thumbnail, so returning to the page shows the play button again.
 *
 * Returns a ref for the player's iframe.
 */
export function useStopWhenHidden(setPlaying: Dispatch<SetStateAction<boolean>>) {
  const frame = useRef<HTMLIFrameElement>(null);

  useLayoutEffect(() => {
    const current = frame;
    return () => {
      current.current?.setAttribute("src", "about:blank");
      setPlaying(false);
    };
  }, [setPlaying]);

  return frame;
}
