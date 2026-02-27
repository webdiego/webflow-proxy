import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      `https://api.webflow.com/v2/collections/${process.env.WF_COLLECTION_ID}/items`,
      {
        headers: {
          Authorization: `Bearer ${process.env.WF_API_TOKEN}`,
        },
        next: { revalidate: 60 },
      },
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Webflow error" }, { status: 500 });
    }

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
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
