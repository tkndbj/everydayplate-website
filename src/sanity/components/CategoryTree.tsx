"use client";

import { ChevronDownIcon } from "@sanity/icons/ChevronDown";
import { ChevronRightIcon } from "@sanity/icons/ChevronRight";
import { TagIcon } from "@sanity/icons/Tag";
import { Box, Button, Card, Flex, Spinner, Stack, Text } from "@sanity/ui";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";
import { usePaneRouter } from "sanity/structure";
import { apiVersion } from "../env";

type Row = { _id: string; title?: string; parent?: string; thumb?: string };

// "drafts" shows unpublished changes and brand-new categories too, under their normal ids.
const query = `*[_type == "category"] | order(coalesce(order, 999) asc, lower(title) asc){
  _id, title, "parent": parent._ref, "thumb": image.asset->url
}`;

/**
 * The Categories pane: main categories with an arrow to show or hide their
 * sub-categories underneath. Clicking a name opens it for editing on the right.
 */
export function CategoryTree() {
  const baseClient = useClient({ apiVersion });
  const client = useMemo(() => baseClient.withConfig({ perspective: "drafts" }), [baseClient]);
  const { ChildLink, routerPanesState, groupIndex } = usePaneRouter();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [open, setOpen] = useState<Set<string>>(new Set());

  const load = useCallback(() => {
    client.fetch<Row[]>(query).then(setRows, () => setRows([]));
  }, [client]);

  // Reload whenever a category is created, renamed, moved or deleted.
  useEffect(() => {
    load();
    const subscription = client
      .listen(`*[_type == "category"]`, {}, { visibility: "query", events: ["mutation"] })
      .subscribe(load);
    return () => subscription.unsubscribe();
  }, [client, load]);

  const openId = routerPanesState[groupIndex + 1]?.[0]?.id;
  const { mains, subsOf } = useMemo(() => {
    const all = rows ?? [];
    const ids = new Set(all.map((r) => r._id));
    const subsOf = new Map<string, Row[]>();
    for (const r of all) {
      if (r.parent && ids.has(r.parent)) subsOf.set(r.parent, [...(subsOf.get(r.parent) ?? []), r]);
    }
    // A sub-category whose main category was deleted is listed as a main one, so it can still be found.
    return { mains: all.filter((r) => !r.parent || !ids.has(r.parent)), subsOf };
  }, [rows]);

  // Keep the main category open while one of its sub-categories is being edited.
  // (Adjusted while rendering, as React recommends, rather than in an effect.)
  const openParent = rows?.find((r) => r._id === openId)?.parent;
  const [shownParent, setShownParent] = useState<string>();
  if (openParent !== shownParent) {
    setShownParent(openParent);
    if (openParent && !open.has(openParent)) setOpen(new Set(open).add(openParent));
  }

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (!rows) {
    return (
      <Flex justify="center" padding={5}>
        <Spinner muted />
      </Flex>
    );
  }

  if (!rows.length) {
    return (
      <Box padding={4}>
        <Text muted size={1}>
          No categories yet. Use the + button above to add your first one.
        </Text>
      </Box>
    );
  }

  const item = (row: Row, depth: number) => {
    const subs = subsOf.get(row._id) ?? [];
    const expanded = open.has(row._id);
    return (
      <Stack key={row._id} gap={1}>
        <Flex align="center" gap={1} style={{ paddingLeft: depth * 28 }}>
          {subs.length > 0 ? (
            <Button
              mode="bleed"
              padding={2}
              icon={expanded ? ChevronDownIcon : ChevronRightIcon}
              onClick={() => toggle(row._id)}
              aria-label={expanded ? `Hide sub-categories of ${row.title}` : `Show sub-categories of ${row.title}`}
              aria-expanded={expanded}
            />
          ) : (
            <Box style={{ width: 33, flex: "none" }} />
          )}
          <Card
            as={ChildLink}
            childId={row._id}
            flex={1}
            padding={2}
            radius={2}
            pressed={row._id === openId}
            selected={row._id === openId}
          >
            <Flex align="center" gap={3}>
              <Thumb src={row.thumb} />
              <Stack gap={2} flex={1}>
                <Text size={1} weight="medium" textOverflow="ellipsis">
                  {row.title?.trim() || "Untitled"}
                </Text>
                {subs.length > 0 && (
                  <Text size={0} muted>
                    {subs.length} {subs.length === 1 ? "sub-category" : "sub-categories"}
                  </Text>
                )}
              </Stack>
            </Flex>
          </Card>
        </Flex>
        {expanded && subs.map((sub) => item(sub, depth + 1))}
      </Stack>
    );
  };

  return (
    <Stack gap={1} padding={2}>
      {mains.map((row) => item(row, 0))}
    </Stack>
  );
}

function Thumb({ src }: { src?: string }) {
  return (
    <Card radius={2} tone="transparent" style={{ width: 33, height: 33, flex: "none", overflow: "hidden" }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- tiny admin thumbnail from Sanity's CDN
        <img src={`${src}?w=66&h=66&fit=crop&auto=format`} alt="" width={33} height={33} style={{ display: "block" }} />
      ) : (
        <Flex align="center" justify="center" style={{ height: "100%" }}>
          <Text muted>
            <TagIcon />
          </Text>
        </Flex>
      )}
    </Card>
  );
}
