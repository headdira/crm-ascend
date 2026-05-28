import { submitToCrm } from "@/lib/crm-client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await submitToCrm(body);
    return Response.json(result);
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Submit error" },
      { status: 500 },
    );
  }
}
