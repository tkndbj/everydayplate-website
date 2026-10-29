"use client";

import { AddIcon } from "@sanity/icons/Add";
import { Button, Card, Flex, Select, Stack } from "@sanity/ui";
import { useCallback, useEffect, useState } from "react";
import { insert, setIfMissing, useClient, type ArrayOfObjectsInputProps } from "sanity";
import { apiVersion } from "../env";

type Option = { _id: string; title: string; parent?: string };

const key = () => Math.random().toString(36).slice(2, 12);

// Published categories only: a draft category can't be linked until it's published.
const query = `*[_type == "category" && !(_id in path("drafts.**"))]
  | order(coalesce(order, 999) asc, title asc){ _id, title, "parent": parent._ref }`;

/**
 * The Categories field: pick a main category, then (if it has any) one of its
 * sub-categories from a second menu, instead of one long list of everything.
 */
export function CategoryPicker(props: ArrayOfObjectsInputProps) {
  const client = useClient({ apiVersion });
  const [options, setOptions] = useState<Option[]>([]);
  const [main, setMain] = useState("");
  const [sub, setSub] = useState("");

  // Also re-run when the menu is opened, so categories added in another tab show up.
  const load = useCallback(() => {
    client.fetch<Option[]>(query).then(setOptions, () => {});
  }, [client]);
  useEffect(load, [load]);

  const picked = new Set((props.value ?? []).map((item) => (item as { _ref?: string })._ref));
  const mains = options.filter((o) => !o.parent);
  const subs = options.filter((o) => o.parent && o.parent === main);
  const chosen = subs.length ? sub : main;
  const mainTitle = mains.find((o) => o._id === main)?.title;

  const add = () => {
    if (!chosen || picked.has(chosen)) return;
    props.onChange([
      setIfMissing([]),
      insert([{ _type: "reference", _ref: chosen, _key: key() }], "after", [-1]),
    ]);
    setMain("");
    setSub("");
  };

  return (
    <Stack gap={3}>
      {props.renderDefault(props)}

      {!props.readOnly && (
        <Card padding={3} radius={2} border tone="transparent">
          <Flex gap={2} wrap="wrap" align="center">
            <Card flex={1} style={{ minWidth: 180 }}>
              <Select
                value={main}
                onFocus={load}
                onChange={(e) => {
                  setMain(e.currentTarget.value);
                  setSub("");
                }}
              >
                <option value="">Choose a category…</option>
                {mains.map((o) => {
                  const hasSubs = options.some((s) => s.parent === o._id);
                  return (
                    <option key={o._id} value={o._id} disabled={picked.has(o._id) && !hasSubs}>
                      {o.title}
                      {hasSubs ? " ›" : ""}
                    </option>
                  );
                })}
              </Select>
            </Card>

            {subs.length > 0 && (
              <Card flex={1} style={{ minWidth: 180 }}>
                <Select value={sub} onChange={(e) => setSub(e.currentTarget.value)}>
                  <option value="">Choose a sub-category…</option>
                  {subs.map((o) => (
                    <option key={o._id} value={o._id} disabled={picked.has(o._id)}>
                      {o.title}
                    </option>
                  ))}
                  <option value={main} disabled={picked.has(main)}>
                    None, just “{mainTitle}”
                  </option>
                </Select>
              </Card>
            )}

            <Button
              icon={AddIcon}
              text="Add"
              tone="primary"
              mode="ghost"
              disabled={!chosen || picked.has(chosen)}
              onClick={add}
            />
          </Flex>
        </Card>
      )}
    </Stack>
  );
}
