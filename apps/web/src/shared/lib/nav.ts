import { LandingData } from "@/shared/types/landing";

export function getNavBlock(data: LandingData) {
  return data.blocks.find((block) => block.type === "navbar");
}
