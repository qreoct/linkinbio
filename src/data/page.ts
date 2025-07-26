import { db } from "@/lib/db";
import { LinkInBioPageConfig } from "@/types/linkinbio";

export async function getPageBySlug(slug: string) {
  try {
    const page = await db.page.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        config: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!page || !page.isPublished) {
      return null;
    }

    return {
      ...page,
      config: page.config as LinkInBioPageConfig,
    };
  } catch (error) {
    console.error("Error fetching page by slug:", error);
    return null;
  }
}

export async function getPagesByUserId(userId: string) {
  try {
    const pages = await db.page.findMany({
      where: { userId },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return pages;
  } catch (error) {
    console.error("Error fetching pages by user ID:", error);
    return [];
  }
}
