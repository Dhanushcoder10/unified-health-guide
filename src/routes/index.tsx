import { createFileRoute } from "@tanstack/react-router";
import { HealthPilotApp } from "@/components/healthpilot/healthpilot-app";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Your Health, Connected — HealthPilot AI" },
    { name: "description", content: "See your connected health summary, journey, medical activity and next steps." },
    { property: "og:title", content: "Your Health, Connected — HealthPilot AI" },
    { property: "og:description", content: "Turn scattered medical records into one clear, understandable health journey." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <HealthPilotApp section="dashboard" />,
});