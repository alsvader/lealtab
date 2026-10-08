import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { PRIVACY } from "@/content/legal/privacy";
import { LINKS } from "@/content/landing";
import { OG_BASE } from "@/lib/site";

// Twitter e íconos se heredan del layout raíz; OG se repite con título y URL propios.
export const metadata: Metadata = {
  title: `${PRIVACY.title} · LealTab`,
  description: PRIVACY.description,
  alternates: { canonical: LINKS.privacy },
  openGraph: { ...OG_BASE, title: `${PRIVACY.title} · LealTab`, description: PRIVACY.description, url: LINKS.privacy },
};

export default function Page() {
  return <LegalPage doc={PRIVACY} />;
}
