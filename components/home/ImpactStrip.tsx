import Container from "@/components/layout/Container";
import Reveal from "@/components/layout/Reveal";
import { IMPACT_ITEMS } from "@/lib/data/impact";

export default function ImpactStrip() {
  return (
    <section aria-label="Areas of impact" className="bg-slate-900 py-16 dark:bg-black sm:py-20">
      <Container>
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {IMPACT_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Reveal delay={index * 100}>
                  <div className="flex flex-col gap-3">
                    <Icon className="h-6 w-6 text-amber-400" aria-hidden />
                    <h3 className="text-base font-semibold text-white">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-400">{item.description}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
