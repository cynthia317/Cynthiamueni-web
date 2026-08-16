interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  id?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  id,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-4 ${alignment} max-w-2xl`}>
      {eyebrow ? (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
          {eyebrow}
        </span>
      ) : null}
      <h2
        id={id}
        className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50"
      >
        {title}
      </h2>
      {description ? (
        <p className="text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}
