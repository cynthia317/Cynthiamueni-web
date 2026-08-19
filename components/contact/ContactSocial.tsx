import { ExternalLink } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import { FacebookIcon, GitHubIcon, LinkedInIcon, WhatsAppIcon } from "@/components/icons/SocialIcons";
import { FACEBOOK_URL, GITHUB_URL, LINKEDIN_URL, WHATSAPP_URL } from "@/lib/constants";

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: LINKEDIN_URL, Icon: LinkedInIcon },
  { label: "WhatsApp", href: WHATSAPP_URL, Icon: WhatsAppIcon },
  { label: "Facebook", href: FACEBOOK_URL, Icon: FacebookIcon },
  { label: "GitHub", href: GITHUB_URL, Icon: GitHubIcon },
];

export default function ContactSocial() {
  return (
    <section aria-labelledby="contact-social-heading" className="border-t border-slate-200 py-12 dark:border-slate-800 sm:py-16">
      <Container>
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1">
            <span
              id="contact-social-heading"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400"
            >
              Connect Professionally
            </span>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Follow along or reach out directly on LinkedIn, WhatsApp, Facebook, or GitHub.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Cynthia Mueni on ${social.label} (opens in a new tab)`}
                className="group inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-amber-300 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:border-slate-800 dark:text-slate-300 dark:hover:border-amber-500/40 dark:hover:text-amber-400"
              >
                <social.Icon className="h-4 w-4 shrink-0" />
                {social.label}
                <ExternalLink
                  className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                  aria-hidden
                />
              </a>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
