import { bytesDeLogo } from "@/lib/negocio/crear";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const logo = await bytesDeLogo(slug).catch(() => null);
  if (!logo) return new Response(null, { status: 404 });
  return new Response(logo.bytes, {
    headers: {
      "Content-Type": logo.type,
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
