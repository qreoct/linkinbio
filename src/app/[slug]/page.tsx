import LinkInBioPage from "@/components/linkinbio/Page";
import { getPageBySlug } from "@/data/page";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PublicPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Fetch the page data from the database
  const page = await getPageBySlug(slug);
  
  // If page doesn't exist or isn't published, show 404
  if (!page) {
    notFound();
  }
  
  // Render the page using the LinkInBioPage component
  return <LinkInBioPage config={page.config} />;
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  
  if (!page) {
    return {
      title: "Page Not Found",
    };
  }
  
  return {
    title: page.title || `${page.user.name}'s Page`,
    description: page.description || `Visit ${page.user.name}'s link in bio page`,
    openGraph: {
      title: page.title || `${page.user.name}'s Page`,
      description: page.description || `Visit ${page.user.name}'s link in bio page`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title || `${page.user.name}'s Page`,
      description: page.description || `Visit ${page.user.name}'s link in bio page`,
    },
  };
} 