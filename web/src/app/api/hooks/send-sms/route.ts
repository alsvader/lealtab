import { recibirHook } from "@/lib/auth/hook-sms";

export async function POST(request: Request) {
  const cuerpo = await request.text();
  try {
    return await recibirHook(cuerpo, request.headers);
  } catch {
    return new Response(null, { status: 500 });
  }
}
