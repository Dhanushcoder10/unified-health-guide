import { createFileRoute } from "@tanstack/react-router";
import { HealthPilotApp } from "@/components/healthpilot/healthpilot-app";

export const Route = createFileRoute("/exercises")({
  head: () => ({ meta: [
    { title: "Healthy Exercises — HealthPilot AI" },
    { name: "description", content: "Try three gentle exercises that support relaxation and everyday wellbeing." },
    { property: "og:title", content: "Healthy Exercises — HealthPilot AI" },
    { property: "og:description", content: "Follow simple breathing, stretching and walking guidance safely." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <HealthPilotApp section="exercises" />,
});