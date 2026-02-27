import { NextResponse } from "next/server";

function getTokenForSite(siteId: string | null): string | undefined {
  if (!siteId) return process.env.WF_API_TOKEN; // fallback default
  const key = `SITE_TOKEN_${siteId.toUpperCase().replace(/-/g, "_")}`;
  return process.env[key];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get("siteId"); // opzionale
  const collectionId =
    searchParams.get("collectionId") || process.env.WF_COLLECTION_ID; // fallback default

  if (!collectionId) {
    return NextResponse.json(
      { error: "collectionId obbligatorio" },
      { status: 400 },
    );
  }

  const token = getTokenForSite(siteId);
  if (!token) {
    return NextResponse.json(
      { error: `Nessun token configurato per: ${siteId}` },
      { status: 403 },
    );
  }

  try {
    const res = await fetch(
      `https://api.webflow.com/v2/collections/${collectionId}/items/live`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "accept-version": "2.0.0",
        },
        next: { revalidate: 60 },
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Webflow API error: ${res.status} ${res.statusText}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    const items = data.items || [];

    return NextResponse.json(
      { items: items },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    );
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// ### Per ogni nuovo cliente

// Su Vercel aggiungi una variabile:

// SITE_TOKEN_UNDERDOGS = token_underdogs;
// SITE_TOKEN_CLIENTE1 = token_cliente1;
// SITE_TOKEN_CLIENTEABC = token_clienteabc;
