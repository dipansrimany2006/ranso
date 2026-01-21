import type { Instance } from "morphcloud";

export async function touchTTL(instance: Instance, seconds = 300) {
  await instance.setTTL(seconds, "pause");
}
