import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const BANLIST = [
      "admin", "dashboard", "register", "login", "help", "privacy", "terms", "contact", "about", "support", "faq", "blog", "news", "events", "products", "services", "projects", "portfolio", "gallery", "store", "shop", "cart", "checkout", "search", "404", "500", "403", "401", "400", "408", "409", "410", "411", "412", "413", "414", "415", "416", "417", "418", "422", "423", "424", "425", "426", "427", "428", "429", "431", "451", "500", "501", "502", "503", "504", "505", "506", "507", "508", "509", "510", "511"
    ]

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await request.json();

    if (!slug || typeof slug !== "string" || BANLIST.includes(slug.trim().toLowerCase())) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    // Check if slug already exists
    const existingPage = await db.page.findFirst({
      where: {
        slug: slug.trim().toLowerCase()
      }
    });

    return NextResponse.json({ 
      available: !existingPage,
      slug: slug.trim().toLowerCase()
    });

  } catch (error) {
    console.error("Error checking slug availability:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 