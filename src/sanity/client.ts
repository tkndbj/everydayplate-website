import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId: projectId || "missing",
  dataset,
  apiVersion,
  // The CDN is free, fast and globally cached — perfect for published content.
  useCdn: true,
  perspective: "published",
});
