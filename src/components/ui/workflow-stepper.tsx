import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepStatus = "completed" | "in-progress" | "pending";

export interface WorkflowStep {
  label: string;
  status: StepStatus;
}

interface WorkflowStepperProps {
  steps: WorkflowStep[];
  className?: string;
}

function StepIcon({ status }: { status: StepStatus }) {
  if (status === "completed") {
    return (
      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#22c55e] shrink-0">
        <Check className="w-3 h-3 text-white" strokeWidth={3} />
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(0,176,240,0.12)] shrink-0">
        <span className="flex gap-0.5 items-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1 h-1 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }}
            />
          ))}
        </span>
      </span>
    );
  }
  return (
    <span className="flex items-center justify-center w-5 h-5 rounded-full border border-[rgba(0,0,0,0.15)] bg-white shrink-0" />
  );
}

export function WorkflowStepper({ steps, className }: WorkflowStepperProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-1">
          {/* Step */}
          <div className="flex items-center gap-1.5">
            <StepIcon status={step.status} />
            <span
              className={cn(
                "text-[13px] whitespace-nowrap",
                step.status === "pending"
                  ? "text-muted-foreground"
                  : "text-foreground font-medium"
              )}
            >
              {step.label}
            </span>
          </div>
          {/* Arrow separator */}
          {i < steps.length - 1 && (
            <span className="text-[#9ca3af] text-xs mx-1">›</span>
          )}
        </div>
      ))}
    </div>
  );
}
