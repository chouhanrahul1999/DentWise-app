import ProPlanRequired from "@/components/voice/ProPlanRequired";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const VoicePage = async () => {
  const { has } = await auth();

  const hasProPlan = has({ plan: "ai_basic" }) || has({ plan: "ai_pro" });

  if (!hasProPlan) return <ProPlanRequired />;

  return <div>VoicePage</div>;
};

export default VoicePage;
