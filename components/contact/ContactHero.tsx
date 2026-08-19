import { Clock, HardHat, LayoutDashboard, Mail, MapPin, Megaphone, Phone, Users } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import ContactForm from "@/components/contact/ContactForm";
import { BUSINESS_HOURS, CONTACT_EMAIL, CONTACT_LOCATION, CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/lib/constants";

const FOCUS_AREAS = [
  { label: "Occupational Safety & Health", icon: HardHat },
  { label: "EHS Systems", icon: LayoutDashboard },
  { label: "Digital Communication", icon: Megaphone },
  { label: "Professional Collaboration", icon: Users },
];

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(to_right,var(--color-slate-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-200)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_40%,transparent_100%)] dark:opacity-[0.15] dark:[background-image:linear-gradient(to_right,var(--color-slate-700)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-700)_1px,transparent_1px)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl dark:bg-amber-500/10"
      />

      <Container className="relative">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* Left — intro, details, focus */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <Reveal>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
                  Contact
                </span>
              </Reveal>

              <Reveal delay={60}>
                <h1 className="max-w-xl text-4xl font-semibold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
                  Let&apos;s Talk About Safer Workplaces, Better EHS Systems or Stronger
                  Communication.
                </h1>
              </Reveal>

              <Reveal delay={120}>
                <p className="max-w-lg text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                  I&apos;m open to Occupational Safety &amp; Health opportunities, EHS system
                  projects, workplace safety collaboration, digital communication work and
                  professional networking.
                </p>
              </Reveal>
            </div>

            <Reveal delay={160} className="flex flex-col gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 transition-colors duration-200 hover:border-amber-300 hover:bg-amber-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:border-slate-800 dark:hover:border-amber-500/40 dark:hover:bg-amber-500/5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Mail className="h-4 w-4" aria-hidden />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Email
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{CONTACT_EMAIL}</p>
                </div>
              </a>

              <a
                href={`tel:${CONTACT_PHONE_HREF}`}
                className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 transition-colors duration-200 hover:border-amber-300 hover:bg-amber-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:border-slate-800 dark:hover:border-amber-500/40 dark:hover:bg-amber-500/5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Phone className="h-4 w-4" aria-hidden />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Phone
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{CONTACT_PHONE}</p>
                </div>
              </a>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 dark:border-slate-800">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <MapPin className="h-4 w-4" aria-hidden />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Location
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{CONTACT_LOCATION}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-3.5 dark:border-slate-800">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Clock className="h-4 w-4" aria-hidden />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Business Hours
                  </p>
                  {BUSINESS_HOURS.map((entry) => (
                    <p key={entry.days} className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {entry.days}: <span className="font-medium text-slate-600 dark:text-slate-400">{entry.hours}</span>
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal
              delay={200}
              className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-3 dark:border-amber-500/20 dark:bg-amber-500/[0.06]"
            >
              <Clock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-slate-50">Typical response:</span>{" "}
                I aim to respond to professional enquiries within 24 hours.
              </p>
            </Reveal>

            <Reveal delay={240} className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Let&apos;s Connect About
              </span>
              <ul className="flex flex-wrap gap-x-6 gap-y-3">
                {FOCUS_AREAS.map((area) => {
                  const Icon = area.icon;
                  return (
                    <li key={area.label} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <Icon className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
                      {area.label}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>

          {/* Right — form */}
          <Reveal delay={100}>
            <ContactForm />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
