"use client";

import { Card, Flex, Stack, Text } from "@sanity/ui";
import type { StringInputProps } from "sanity";
import { getYouTubeId, isYouTubeShort, youTubeThumbnail } from "@/lib/youtube";

/** URL input that shows the video's thumbnail as soon as a valid YouTube link is pasted. */
export function YouTubeInput(props: StringInputProps) {
  const id = getYouTubeId(props.value);
  const short = isYouTubeShort(props.value);

  return (
    <Stack gap={3}>
      {props.renderDefault(props)}

      {props.value && !id && (
        <Card tone="caution" padding={3} radius={2} border>
          <Text size={1}>We couldn’t find a video in this link. On YouTube, press Share → Copy link and paste it here.</Text>
        </Card>
      )}

      {id && (
        <Card radius={2} border overflow="hidden" style={{ maxWidth: short ? 200 : 360 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={youTubeThumbnail(id)}
            alt="Video preview"
            style={{
              display: "block",
              width: "100%",
              aspectRatio: short ? "9 / 16" : "16 / 9",
              objectFit: "cover",
            }}
          />
          <Flex padding={3} gap={2} align="center">
            <Text size={1} weight="semibold">
              ✓ Video found{short ? " · YouTube Short" : ""}
            </Text>
          </Flex>
        </Card>
      )}
    </Stack>
  );
}
