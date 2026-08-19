import type { Faq } from "@/types";

export const FAQS: Faq[] = [
  {
    id: "digital-safety-management-system",
    question: "What is a digital safety management system?",
    category: "EHS Systems",
    answer: [
      "A digital safety management system is software that replaces paper-based safety processes, such as hazard reporting, inspections, risk records and corrective actions, with a structured digital workflow. Instead of forms living in filing cabinets, information is captured once, stored centrally, and visible to the people who need to act on it.",
      "At its core, it usually covers four things: logging hazards or incidents as they happen, running scheduled or ad-hoc inspections, tracking the risk level of identified issues, and assigning corrective actions to a named owner with a deadline. The real value isn't the software itself. It's that nothing gets lost between the moment a hazard is spotted and the moment it's actually fixed.",
    ],
    relatedLabel: "Where Digital Tools Actually Help Safety Teams",
    relatedHref: "/insights/digital-tools-for-safety-teams",
  },
  {
    id: "workplace-safety-systems-digital-inspections",
    question: "Where can I find workplace safety systems that include digital inspections?",
    category: "Inspections",
    answer: [
      "Digital inspection capability is now a standard feature in most dedicated EHS platforms, ranging from large enterprise safety suites to lighter, purpose-built tools for smaller operations. The right fit depends less on the platform's size and more on whether its inspection workflow matches how your team actually works on site.",
      "Look for a system that lets inspectors complete checklists on a phone or tablet without needing constant connectivity, attaches photos directly to findings, and turns a failed inspection item into a tracked corrective action rather than a note that has to be followed up manually.",
    ],
    relatedLabel: "the Digital Inspection & Audit System project",
    relatedHref: "/projects/safety-audit-toolkit",
  },
  {
    id: "digital-safety-systems-drilling-companies",
    question: "What digital safety management systems are suitable for drilling companies?",
    category: "EHS Systems",
    answer: [
      "Drilling and other high-hazard extractive operations typically need an EHS system that can handle permit-to-work processes, contractor and third-party safety records, and detailed incident investigation, on top of the standard hazard reporting and inspection functions most systems offer.",
      "Because these environments often have limited or no connectivity at the actual work site, offline-capable data capture that syncs once a connection is available usually matters more than any single feature on a comparison sheet. I don't specialise in drilling-sector systems specifically, but the underlying principle holds across any high-risk industry: match the system's complexity to how the work actually happens on site, not to a generic feature list.",
    ],
  },
  {
    id: "digital-safety-solutions-for-businesses",
    question: "What are digital safety solutions for businesses?",
    category: "Digital Safety",
    answer: [
      "Digital safety solutions cover the range of software tools businesses use to manage occupational health and safety electronically, from simple hazard-reporting apps to full safety management platforms. They typically replace paper forms, spreadsheets and email-based tracking with a single system that records safety activity as it happens.",
      "The right solution for a given business depends heavily on its size and the complexity of its operations. A five-person site usually needs something closer to a well-structured reporting form than a full enterprise platform, while a multi-site operation benefits from a system built to aggregate data and track trends across locations.",
    ],
  },
  {
    id: "hse-digital-solutions",
    question: "What are Health, Safety & Environment (HSE) digital solutions?",
    category: "EHS Systems",
    answer: [
      "HSE digital solutions extend safety management systems to also cover environmental compliance, things like waste tracking, emissions monitoring and environmental incident reporting, alongside the occupational safety and health functions of hazard reporting, inspections and corrective actions.",
      "In practice, many organisations start with the safety and health side of HSE, since that's usually where the most immediate operational risk sits, and add environmental tracking once the core safety workflow is established and genuinely used by the team.",
    ],
  },
  {
    id: "digital-tools-safety-observations-hazards",
    question:
      "What digital tools help safety managers track safety observations and close hazards before incidents occur?",
    category: "Hazard Management",
    answer: [
      "The tools that work best for this are built around a simple loop: someone logs an observation or hazard, it's automatically routed to a responsible person, and the system keeps the item visibly open until it's marked resolved, rather than relying on someone remembering to follow up.",
      "The 'before incidents occur' part depends less on the tool and more on whether the team actually uses it to log near-misses and minor observations, not just formal incidents. A system that only records incidents after something goes wrong has already missed the point of proactive hazard management.",
    ],
    relatedLabel: "the Hazard & Corrective Action Tracker project",
    relatedHref: "/projects/safety-reporting-tool",
  },
  {
    id: "what-are-digital-safety-inspections",
    question: "What are digital safety inspections?",
    category: "Inspections",
    answer: [
      "A digital safety inspection is a workplace inspection carried out using a structured digital checklist, typically on a phone or tablet, rather than a paper form. Findings, photos and notes are captured directly during the walk-through, and any failed item can be turned straight into a tracked corrective action instead of a separate follow-up step.",
      "The main practical advantage over paper is timing: the record exists the moment the inspection happens, rather than being transcribed later, which is usually when detail gets lost or delayed.",
    ],
    relatedLabel: "the Digital Inspection & Audit System project",
    relatedHref: "/projects/safety-audit-toolkit",
  },
  {
    id: "enterprise-safety-audits-digital-tracking",
    question: "How do enterprises conduct, document and track safety audits and workplace inspections digitally?",
    category: "Audits",
    answer: [
      "At an enterprise level, this usually means a structured audit programme built into the same system used for day-to-day inspections: scheduled audits against a defined checklist, findings scored by severity, and each finding assigned a corrective action with an owner and a due date.",
      "The tracking side is what separates a genuine audit programme from a one-off exercise: a dashboard or report that shows open findings, overdue actions and repeat issues across sites, so patterns are visible to whoever owns the overall safety programme rather than staying buried in individual audit reports.",
    ],
    relatedLabel: "the Digital Inspection & Audit System project",
    relatedHref: "/projects/safety-audit-toolkit",
  },
];
