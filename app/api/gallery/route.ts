import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      `https://api.webflow.com/v2/collections/${process.env.WF_COLLECTION_ID}/items`,
      {
        headers: {
          Authorization: `Bearer ${process.env.WF_API_TOKEN}`,
        },
        next: { revalidate: 60 }, // cache 60 sec
      },
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Webflow error" }, { status: 500 });
    }

    const data = await res.json();

    // // 🔥 estrai tutte le immagini (multi-image field chiamato "gallery")
    // const images = data.items.flatMap((item: any) =>
    //   (item.fieldData.gallery || []).map((img: any) => img.url),
    // );
    // // 🔥 restituisci solo le URL delle immagini
    // const uniqueImages = Array.from(new Set(images)); // rimuovi duplicati
    console.log("Fetched gallery items:", data.items);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
