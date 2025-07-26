"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { LinkInBioPageConfig } from "@/types/linkinbio";
import { revalidatePath } from "next/cache";

interface SavePageParams {
  slug: string;
  title?: string;
  description?: string;
  config: LinkInBioPageConfig;
}

export async function savePage({ slug, title, description, config }: SavePageParams) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Check if page already exists for this user
    const existingPage = await db.page.findFirst({
      where: {
        userId: session.user.id,
        slug: slug
      }
    });

    if (existingPage) {
      // Update existing page
      const updatedPage = await db.page.update({
        where: { id: existingPage.id },
        data: {
          title,
          description,
          config,
          isPublished: true,
          updatedAt: new Date()
        }
      });

      revalidatePath("/dashboard");
      revalidatePath(`/${slug}`, "page");
      return { success: true, page: updatedPage };
    } else {
      // Create new page
      const newPage = await db.page.create({
        data: {
          slug,
          title,
          description,
          config,
          isPublished: true,
          userId: session.user.id
        }
      });

      revalidatePath("/dashboard");
      revalidatePath(`/${slug}`, "page");
      return { success: true, page: newPage };
    }
  } catch (error) {
    console.error("Error saving page:", error);
    return { success: false, error: "Failed to save page" };
  }
} 