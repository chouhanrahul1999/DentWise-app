import Navbar from "@/components/Navbar";
import ProPlanRequired from "@/components/voice/ProPlanRequired";
import { auth } from "@clerk/nextjs/server";
import { LockIcon, MicIcon } from "lucide-react";
import React from "react";

const VoicePage = async () => {
  const { has } = await auth();

  const hasProPlan = has({ plan: "ai_basic" }) || has({ plan: "ai_pro" });

  if (!hasProPlan) return <ProPlanRequired />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        <div className="relative mb-12 overflow-hidden">
          <div className="bg-linear-to-br from-primary/10 via-primary/5 to-background rounded-3xl p-8 border border-primary/20">
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                  <LockIcon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Pro Feature
                  </span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    Voice Assistant Access Required
                  </h1>
                  <p className="text-muted-foreground">
                    Upgrade to AI Pro or AI Basic to unlock unlimited voice
                    consultations with our AI dental assistant.
                  </p>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-linear-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                  <MicIcon className="w-16 h-16 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoicePage;
