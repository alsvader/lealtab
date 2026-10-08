import type { MetadataRoute } from "next";
import { LINKS } from "@/content/landing";
import { PRIVACY } from "@/content/legal/privacy";
import { TERMS } from "@/content/legal/terms";
import { SITE_URL } from "@/lib/site";

// `lastModified` de cada página legal es la fecha de actualización del propio documento.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}${LINKS.privacy}`, lastModified: PRIVACY.updatedAtIso },
    { url: `${SITE_URL}${LINKS.terms}`, lastModified: TERMS.updatedAtIso },
  ];
}
