import { Button, Card, Stack, Text } from "@sanity/ui";
import { set, useFormValue, type ArrayOfObjectsInputProps } from "sanity";

const key = () => Math.random().toString(36).slice(2, 12);

/**
 * The "Short introduction" used to be a plain text box (aboutShort). While the
 * new formatted box is empty, offer to bring the old text across in one click.
 */
export function LegacyTextInput(props: ArrayOfObjectsInputProps) {
  const legacy = useFormValue(["aboutShort"]);
  const old = typeof legacy === "string" ? legacy.trim() : "";

  if (props.value?.length || !old) return props.renderDefault(props);

  const bringAcross = () =>
    props.onChange(
      set(
        old.split(/\n\s*\n/).map((paragraph) => ({
          _type: "block",
          _key: key(),
          style: "normal",
          markDefs: [],
          children: [{ _type: "span", _key: key(), text: paragraph.trim(), marks: [] }],
        })),
      ),
    );

  return (
    <Stack gap={3}>
      <Card padding={3} radius={2} tone="caution" border>
        <Stack gap={3}>
          <Text size={1}>Your current introduction is still showing on the website:</Text>
          <Text size={1} muted>
            “{old.length > 160 ? `${old.slice(0, 160)}…` : old}”
          </Text>
          <Button text="Bring it in here so I can format it" tone="primary" mode="ghost" onClick={bringAcross} />
        </Stack>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  );
}
