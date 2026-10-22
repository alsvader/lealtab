import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { TERMS } from "@/content/legal/terms";
import { LINKS } from "@/content/landing";
import { OG_BASE } from "@/lib/site";

// Twitter e íconos se heredan del layout raíz; OG se repite con título y URL propios.
export const metadata: Metadata = {
  title: `${TERMS.title} · LealTab`,
  description: TERMS.description,
  alternates: { canonical: LINKS.terms },
  openGraph: { ...OG_BASE, title: `${TERMS.title} · LealTab`, description: TERMS.description, url: LINKS.terms },
};

export default function Page() {
  return <LegalPage doc={TERMS} />;
}
