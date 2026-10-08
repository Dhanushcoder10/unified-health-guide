import { createFileRoute } from "@tanstack/react-router";
import { HealthPilotApp } from "@/components/healthpilot/healthpilot-app";

export const Route = createFileRoute("/emergency")({
  head: () => ({ meta: [
    { title: "Emergency Services — HealthPilot AI" },
    { name: "description", content: "Recognize when to call 108 and review immediate emergency guidance." },
    { property: "og:title", content: "Emergency Services — HealthPilot AI" },
    { property: "og:description", content: "Find clear emergency warning signs and one-tap access to call 108." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <HealthPilotApp section="emergency" />,
});