"use client";

/**
 * Admin panel (Sanity Studio) configuration. It's served by this website at /studio.
 */
import { buildLegacyTheme, defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { viewOnSiteAction } from "./src/sanity/actions";
import { dataset, projectId } from "./src/sanity/env";
import { schemaTypes, singletonTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const theme = buildLegacyTheme({
  "--black": "#2b211c",
  "--white": "#fffdf9",
  "--gray": "#7a6c63",
  "--gray-base": "#7a6c63",
  "--component-bg": "#fffdf9",
  "--component-text-color": "#2b211c",
  "--brand-primary": "#b5532f",
  "--default-button-color": "#7a6c63",
  "--default-button-primary-color": "#b5532f",
  "--default-button-success-color": "#5c6b34",
  "--default-button-warning-color": "#c08a2b",
  "--default-button-danger-color": "#a33b2b",
  "--state-info-color": "#b5532f",
  "--state-success-color": "#5c6b34",
  "--state-warning-color": "#c08a2b",
  "--state-danger-color": "#a33b2b",
  "--main-navigation-color": "#2b211c",
  "--main-navigation-color--inverted": "#fffdf9",
  "--focus-color": "#b5532f",
});

export default defineConfig({
  name: "everyday-plate",
  title: "Everyday Plate · Kitchen",
  basePath: "/studio",
  projectId: projectId || "missing",
  dataset,
  theme,
  schema: {
    types: schemaTypes,
    // Hide "Site settings" from the "Create new" menu — there is only one.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  plugins: [structureTool({ structure, title: "Content" })],
  document: {
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : [...actions, viewOnSiteAction],
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((item) => !singletonTypes.has(item.templateId))
        : prev,
  },
});
