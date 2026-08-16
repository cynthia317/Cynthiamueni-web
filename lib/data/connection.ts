import { Search, PenTool, Wrench, Radio, RefreshCw } from "lucide-react";
import type { ConnectionStep } from "@/types";

export const CONNECTION_STEPS: ConnectionStep[] = [
  {
    id: "identify",
    label: "Identify",
    icon: Search,
    description: "Occupational safety practice surfaces the real risks and operational gaps in a workplace.",
  },
  {
    id: "design",
    label: "Design",
    icon: PenTool,
    description: "Systems thinking turns those findings into a clear plan for a tool, process, or safety system.",
  },
  {
    id: "implement",
    label: "Implement",
    icon: Wrench,
    description: "Software and digital tools bring the plan to life as something people can actually use.",
  },
  {
    id: "communicate",
    label: "Communicate",
    icon: Radio,
    description: "Digital communication helps organisations educate teams and reach the right audience.",
  },
  {
    id: "improve",
    label: "Improve",
    icon: RefreshCw,
    description: "Data and feedback are used to refine the system and keep it aligned with real conditions.",
  },
];
