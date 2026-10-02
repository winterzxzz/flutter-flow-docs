import { slug } from "@/lib/slug";

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <header className="mb-10">
      <p className="mb-2.5 text-[0.8125rem] font-semibold tracking-[0.06em] text-brand uppercase">
        {eyebrow}
      </p>
      <h1 className="font-heading text-[2rem] font-medium tracking-[-0.01em] text-balance sm:text-[2.35rem]">
        {title}
      </h1>
      <p className="mt-3.5 text-[1.0938rem] leading-[1.7] text-foreground/70">{lead}</p>
    </header>
  );
}

/** A titled part of a page. The h2 carries the anchor the page outline links to. */
export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2
        id={slug(title)}
        data-toc
        className="mb-4 scroll-mt-28 font-heading text-[1.55rem] font-medium tracking-[-0.005em] text-balance lg:scroll-mt-20"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
