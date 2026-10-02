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
    <header className="mb-10 border-b pb-7">
      <p className="mb-2.5 text-xs font-semibold tracking-wider text-brand uppercase">
        {eyebrow}
      </p>
      <h1 className="text-[1.7rem] font-semibold tracking-tight text-balance sm:text-[2rem]">
        {title}
      </h1>
      <p className="mt-4 text-base text-foreground/75">{lead}</p>
    </header>
  );
}

/** Anchor id from a Vietnamese heading: strip diacritics, keep letters and digits. */
function slug(title: string) {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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
    <section className="mb-14">
      <h2
        id={slug(title)}
        data-toc
        className="mb-4 scroll-mt-20 text-[1.3rem] font-semibold tracking-tight text-balance"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
