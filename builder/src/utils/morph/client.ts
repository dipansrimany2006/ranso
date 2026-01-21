import { MorphCloudClient } from "morphcloud";

const apiKey = process.env.MORPH_API_KEY;

if (!apiKey) {
  throw new Error("MORPH_API_KEY env var required");
}

export const morphClient = new MorphCloudClient({ apiKey });
