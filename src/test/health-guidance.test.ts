import { describe, expect, it } from "vitest";

import { answerHealthQuestion } from "@/lib/health-data";

describe("HealthPilot safety guidance", () => {
  it("advises calling 108 for emergency warning signs", () => {
    const answer = answerHealthQuestion("Should I call an ambulance in an emergency?", "en");
    expect(answer.text).toContain("108");
  });

  it("gives record-grounded precautions without promising a cure", () => {
    const answer = answerHealthQuestion("What precautions should I take to reduce this problem?", "en");
    expect(answer.text).toContain("Based on your records");
    expect(answer.text.toLowerCase()).toContain("do not add or change supplements");
  });

  it("uses the personalized doctor name in visit questions", () => {
    const answer = answerHealthQuestion("What questions should I ask my doctor?", "en", "Arjun", "Dr. Mehta");
    expect(answer.text).toContain("Questions for Dr. Mehta");
  });
});