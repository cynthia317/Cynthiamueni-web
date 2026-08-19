import type { Insight } from "@/types";

export const INSIGHTS: Insight[] = [
  {
    id: "risk-assessment-basics",
    title: "Getting Risk Assessments Right in Small Teams",
    category: "Risk Assessment",
    excerpt:
      "Why lightweight, consistently-applied risk assessments protect people better than a thick policy document nobody reads.",
    date: "2026-06-12",
    readTime: "8 min read",
    href: "/insights/risk-assessment-basics",
    image: "/images/home/expertise-osh-safety-inspection.webp",
    imageAlt: "Safety professional in a hard hat reviewing a tablet while walking an industrial facility floor",
    featured: true,
    content: [
      {
        type: "paragraph",
        text: "Most risk assessment templates are built for organisations with dedicated safety departments, multiple sign-off layers and time to run a full review cycle. Small teams rarely have any of that — and when a heavy template lands on a supervisor who is also running the shift, it usually gets filled in once, filed away, and never looked at again.",
      },
      { type: "heading", text: "The Real Cost of a Risk Assessment Nobody Uses" },
      {
        type: "paragraph",
        text: "When a risk assessment exists only to satisfy an audit, the real cost isn't the paperwork — it's the false sense of security it creates. A binder full of documented hazards can make an organisation feel covered while the actual conditions on site have moved on. The document says one thing; the workplace says another. That gap is where incidents happen, and it's rarely visible until something goes wrong and someone asks why the paperwork didn't match reality.",
      },
      { type: "heading", text: "Why Comprehensive Isn't the Same as Effective" },
      {
        type: "paragraph",
        text: "A thorough risk assessment on paper means nothing if it doesn't change what happens on the floor. Well-written documents can accurately describe every hazard in a workspace and still sit in a folder nobody has opened since the audit that required them. The gap usually isn't knowledge — it's whether the assessment is actually usable by the people doing the work.",
      },
      { type: "heading", text: "What a Lightweight Risk Assessment Actually Needs" },
      {
        type: "paragraph",
        text: "Stripped back to the essentials, a risk assessment only needs to answer four questions clearly enough that someone can act on them:",
      },
      {
        type: "list",
        items: [
          "What could go wrong, described in plain terms rather than technical hazard categories",
          "How likely it is and how serious the outcome would be, using a simple scale the team already understands",
          "What control reduces that risk, and who is responsible for putting it in place",
          "When it gets checked again — tied to a real trigger, not just an annual date",
        ],
      },
      { type: "heading", text: "A Simple Likelihood and Severity Scale That Works" },
      {
        type: "paragraph",
        text: "Most small teams don't need a five-point risk matrix with weighted scoring — they need something fast enough to use in the moment. A basic three-level scale for likelihood (rare, possible, likely) crossed with a three-level scale for severity (minor, serious, severe) is usually enough to sort hazards into 'deal with now', 'plan a fix', and 'monitor'. The value of a scale isn't precision — it's giving everyone on the team the same shorthand for talking about risk, so a conversation about a loose guardrail and a conversation about a chemical spill both land in the same, understood framework.",
      },
      { type: "heading", text: "Making It a Habit, Not a Document" },
      {
        type: "paragraph",
        text: "The teams that get the most value from risk assessment treat it as an ongoing conversation rather than a compliance exercise. A five-minute review before a new task starts, or a quick update after a near-miss, does more for safety than a comprehensive annual review that happens once and is forgotten. Consistency matters more than completeness.",
      },
      { type: "heading", text: "Common Mistakes That Undermine Small-Team Risk Assessments" },
      {
        type: "paragraph",
        text: "A few patterns show up repeatedly in teams that struggle to make risk assessment stick:",
      },
      {
        type: "list",
        items: [
          "Borrowing a template built for a different industry or a much larger operation, then never adapting it to how the team actually works",
          "Writing the assessment only after an incident, rather than before the task that caused it",
          "Leaving the 'responsible person' field blank, or filling it with a job title instead of a name",
          "Setting a review date a year out instead of tying the review to a real trigger — new equipment, a layout change, a near-miss",
          "Treating sign-off as the finish line, when sign-off should really be the start of the control being put into practice",
        ],
      },
      { type: "heading", text: "Where to Start If You're Rebuilding From Scratch" },
      {
        type: "paragraph",
        text: "For teams starting from a blank page, the temptation is to build the full system first and populate it later. It usually works better in reverse: pick the two or three highest-risk tasks in the operation, write a simple assessment for those, put the controls in place, and use that as the working template for everything else. A working example beats an empty framework every time.",
      },
      { type: "heading", text: "How Often Should a Risk Assessment Be Reviewed?" },
      {
        type: "paragraph",
        text: "Calendar-based reviews — once a year, regardless of what's changed — are the most common reason risk assessments quietly go out of date. A better approach is trigger-based review: revisit the assessment when the task, the equipment, the people, or the environment changes, or after any near-miss connected to it. A small operation might genuinely go eight months without a meaningful change to a task, or it might change three times in a month during a busy season. The review schedule should follow the work, not the calendar.",
      },
      { type: "heading", text: "Getting the Team to Actually Use It" },
      {
        type: "paragraph",
        text: "Even a well-designed assessment fails if it feels like it was handed down rather than built with the people who use it. Involving the team in identifying hazards — rather than presenting them with a finished document — tends to produce assessments that are both more accurate and more likely to be followed, because the people who flagged the hazard have a stake in the control actually working.",
      },
      { type: "heading", text: "A Structure That Holds Up Under Real Conditions" },
      {
        type: "paragraph",
        text: "The best test of a risk assessment isn't whether it satisfies an auditor — it's whether the person doing the work could explain it back to you in their own words. If they can't, the document has failed regardless of how thorough it looks. Building assessments around that standard, rather than around template completeness, is what actually keeps small teams safer.",
      },
      { type: "heading", text: "Key Takeaways" },
      {
        type: "list",
        items: [
          "A risk assessment only works if the person doing the task can explain it back in their own words",
          "Four questions are usually enough: what could go wrong, how likely and severe it is, what control is in place, and when it gets reviewed",
          "Trigger-based reviews catch real change; calendar-based reviews mostly just catch the date",
          "Start with your two or three highest-risk tasks and build outward from a working example",
        ],
      },
      {
        type: "linkParagraph",
        text: "This structure closely mirrors the approach behind my",
        linkLabel: "Workplace Risk Assessment Framework, built for a small operations team",
        linkHref: "/projects/workplace-risk-assessment",
      },
    ],
  },
  {
    id: "digital-tools-for-safety-teams",
    title: "Where Digital Tools Actually Help Safety Teams",
    category: "EHS Systems",
    excerpt:
      "A practical look at which parts of workplace safety benefit from digitisation — and which don't.",
    date: "2026-05-28",
    readTime: "9 min read",
    href: "/insights/digital-tools-for-safety-teams",
    image: "/images/projects/software-dashboard-review.webp",
    imageAlt: "Dark-themed analytics dashboard displaying monitoring charts, representing a digital EHS interface",
    content: [
      {
        type: "paragraph",
        text: "There's a pattern that shows up often in organisations moving safety processes online: they digitise everything at once, hoping the software fixes problems that were never really about paper in the first place. Some parts of safety work genuinely benefit from digital tools. Others don't — and pretending otherwise just adds friction to work that used to be simple.",
      },
      { type: "heading", text: "Where Digital Tools Genuinely Help" },
      {
        type: "paragraph",
        text: "The clearest wins are in the parts of safety work that involve tracking something over time or across people:",
      },
      {
        type: "list",
        items: [
          "Hazard and incident reporting, where a quick digital form removes the delay of finding a paper log and gets issues to the right person faster",
          "Trend visibility, since a system that stores every report makes recurring problems visible that would otherwise stay hidden in a filing cabinet",
          "Corrective action tracking, where an assigned owner and a due date create accountability a handwritten note rarely does",
          "Audit readiness, because records that already exist in one place are far easier to produce than reconstructing a history from scattered paperwork",
        ],
      },
      { type: "heading", text: "Where Paper — or Simplicity — Still Wins" },
      {
        type: "paragraph",
        text: "Not every part of a safety process improves by moving online. A quick pre-task check on a noisy shop floor is often faster with a laminated card and a pen than with an app that needs a login, a signal, and a few taps to open. When a digital tool adds friction to something that used to take ten seconds, people stop using it properly — and a system nobody uses honestly is worse than the paper it replaced.",
      },
      { type: "heading", text: "Signs Your Team Is Ready for a Digital System" },
      {
        type: "paragraph",
        text: "A few practical signals tend to show up before a team is genuinely ready to move a process online:",
      },
      {
        type: "list",
        items: [
          "Paper reports are getting lost or delayed often enough that it's affecting how quickly hazards get addressed",
          "Nobody can easily answer 'how many incidents did we have last quarter, and what caused them?' without digging through files",
          "Corrective actions are being agreed verbally and then forgotten, because nothing is tracking who owns them",
          "The team is already comfortable using basic digital tools day to day, since a system that fights existing habits rarely gets adopted",
        ],
      },
      { type: "heading", text: "Signs You're Not Ready Yet" },
      {
        type: "paragraph",
        text: "Just as important are the signs that a digital rollout is likely to struggle:",
      },
      {
        type: "list",
        items: [
          "The underlying process itself is unclear or inconsistent, since digitising a broken workflow just makes the mess move faster",
          "There's no one accountable for maintaining the system once it's live, from adding new hazards to reviewing reports",
          "Connectivity or device access on site is unreliable enough that a digital tool would be slower than paper in practice",
          "Leadership sees the system as a box to tick rather than a tool the team will actually be expected to use",
        ],
      },
      { type: "heading", text: "Choosing the Right Level of System" },
      {
        type: "paragraph",
        text: "The organisations that get the most value from EHS technology don't start by asking what software is available. They start by asking which specific process is genuinely struggling without it, and build from there. A five-person team rarely needs the same system as a two-hundred-person operation, and forcing a small team into an enterprise-grade platform usually just means most of the features sit unused while the team quietly reverts to spreadsheets.",
      },
      { type: "heading", text: "Common EHS Digitisation Mistakes" },
      {
        type: "paragraph",
        text: "A handful of mistakes show up repeatedly when organisations move safety processes online:",
      },
      {
        type: "list",
        items: [
          "Buying a platform sized for a much larger operation and using only a fraction of what it offers",
          "Migrating every historical paper record at once instead of starting the digital system from the next new report forward",
          "Skipping training on the assumption that a simple interface means no one needs guidance",
          "Measuring success by whether the system was launched, rather than whether people are still using it three months later",
        ],
      },
      { type: "heading", text: "A Practical Way to Decide" },
      {
        type: "paragraph",
        text: "Before introducing a new tool, it's worth asking whether the underlying problem is really about information, or about behaviour. Reporting delays, lost paperwork and invisible trends are information problems that technology solves well. A team that doesn't report hazards because they don't trust what happens next needs a change in culture first — no dashboard will fix that on its own.",
      },
      { type: "heading", text: "What a Good Rollout Actually Looks Like" },
      {
        type: "paragraph",
        text: "The rollouts that stick tend to follow a similar pattern: one process moves online at a time, someone is clearly responsible for the system day to day, the team is shown exactly how it makes their specific job easier rather than just the organisation's reporting, and there's a plan to review what's working after the first few weeks rather than treating the launch as the finish line.",
      },
      { type: "heading", text: "Starting Small on Purpose" },
      {
        type: "paragraph",
        text: "The most successful digital EHS rollouts start with one process — usually hazard or incident reporting — done well, before anything else moves online. Getting that single workflow trusted and genuinely used builds the habit and the credibility a wider system will eventually depend on.",
      },
      { type: "heading", text: "Key Takeaways" },
      {
        type: "list",
        items: [
          "Digitise the parts of safety work that involve tracking information over time, not every step by default",
          "A system that adds friction to a ten-second task will quietly get abandoned",
          "Readiness is about the process and the team, not just the size of the budget",
          "Start with one trusted workflow — usually reporting — before expanding further",
        ],
      },
      {
        type: "linkParagraph",
        text: "This is close to the thinking behind my",
        linkLabel: "Safety Management System project, an EHS platform built around this kind of selective digitisation",
        linkHref: "/projects/safety-management-system",
      },
    ],
  },
  {
    id: "communicating-safety-online",
    title: "Communicating Safety Culture Beyond the Noticeboard",
    category: "Digital Communication",
    excerpt:
      "How organisations can use simple digital channels to reinforce safety habits, not just announce policy.",
    date: "2026-05-09",
    readTime: "7 min read",
    href: "/insights/communicating-safety-online",
    image: "/images/home/expertise-digital-communication-workspace.webp",
    imageAlt: "Professional workspace set up for planning safety content and digital communication",
    content: [
      {
        type: "paragraph",
        text: "A noticeboard is a one-way, one-time message. Someone posts a notice, a handful of people read it in the first week, and after that it becomes part of the wallpaper. If the goal is genuine safety culture — habits people carry into daily decisions — a static notice was never going to be enough on its own.",
      },
      { type: "heading", text: "The Problem With Announce-Only Communication" },
      {
        type: "paragraph",
        text: "Most workplace safety communication is built around announcing policy: a new procedure goes up, an incident summary gets circulated, a reminder gets pinned somewhere visible. That's necessary, but it's also passive. It assumes people will seek out and absorb information rather than needing it reinforced in the flow of their actual work.",
      },
      { type: "heading", text: "What Reinforcement Looks Like Digitally" },
      {
        type: "paragraph",
        text: "Digital channels are well suited to reinforcement precisely because they can be short, repeated and timed around real moments rather than a single announcement date:",
      },
      {
        type: "list",
        items: [
          "Short, recurring reminders tied to a specific task or season, rather than one long policy document",
          "Real photos of good practice from the actual site, which people recognise and relate to far more than generic stock imagery",
          "A simple way for people to ask questions or flag concerns, so communication becomes two-way rather than a broadcast",
          "A consistent, predictable rhythm, so safety content becomes a familiar part of the channel rather than an occasional interruption",
        ],
      },
      { type: "heading", text: "Choosing the Right Channel for Your Team" },
      {
        type: "paragraph",
        text: "Not every organisation needs a polished content calendar or a dedicated social media presence. The right channel depends entirely on where the team already pays attention. A closed messaging group works well for fast-moving field teams who check their phones constantly. An internal noticeboard paired with a simple digital screen suits a fixed site with shared spaces. A public-facing page or social profile makes more sense when the audience extends beyond the immediate team — clients, regulators, or the wider industry watching how an organisation talks about safety.",
      },
      { type: "heading", text: "Keeping the Message Practical, Not Just Compliant" },
      {
        type: "paragraph",
        text: "The content that actually changes behaviour tends to be specific and relevant rather than generic. A reminder about a hazard that appeared on-site last week lands differently than a stock safety slogan. Writing for the people actually doing the work — in their language, about their conditions — does more for safety culture than restating the policy manual in shorter sentences.",
      },
      { type: "heading", text: "Measuring Whether It's Actually Working" },
      {
        type: "paragraph",
        text: "The clearest signal that safety communication is landing isn't a vanity number — it's whether people start bringing things up on their own. More questions being asked, more hazards being flagged before they're prompted, and fewer 'I didn't know that' moments after an incident all suggest the message is reaching people. A channel that only ever sees management posting, with no response from the team, usually means the communication is being broadcast rather than absorbed.",
      },
      { type: "heading", text: "A Simple Weekly Rhythm That Works" },
      {
        type: "paragraph",
        text: "Consistency tends to matter more than volume. A short, predictable weekly post — a real photo from the site, a quick reminder tied to whatever work is happening that week, or a two-line recap of something the team handled well — builds a habit of attention that a large, infrequent campaign rarely achieves. The goal isn't to produce more content; it's to make safety a small, expected part of a channel people already check.",
      },
      { type: "heading", text: "Where This Fits Alongside Formal Communication" },
      {
        type: "paragraph",
        text: "None of this replaces formal safety documentation or required notices — it sits alongside them. The noticeboard and the official procedure still need to exist. What digital communication adds is the reinforcement layer in between: the steady, low-effort presence that keeps safety top of mind on the days nothing has gone wrong yet.",
      },
      { type: "heading", text: "Key Takeaways" },
      {
        type: "list",
        items: [
          "A noticeboard announces once; digital channels can reinforce continuously",
          "The right channel is the one your team already checks, not the most sophisticated option available",
          "Engagement — questions, flagged hazards, replies — is a better signal than reach",
          "A short, consistent weekly rhythm beats an occasional large campaign",
        ],
      },
      {
        type: "linkParagraph",
        text: "This approach reflects the ongoing",
        linkLabel: "digital presence and social media management work I do for Safetec Solutions Ltd",
        linkHref: "/projects/safetec-digital-presence",
      },
    ],
  },
];
