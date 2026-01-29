"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { LandingRenderer } from "@/widgets/landing-renderer";
import { getPageContent, getPublishedLanding, getTenant } from "@/shared/api/landing-repo";
import { PageLoader } from "@/shared/ui/page-loader";

export default function PublicLandingPage() {
  const params = useParams<{ tenant: string; slug: string }>();
  const searchParams = useSearchParams();
  const slug = params?.slug || "home";
  const tenantSlug = params?.tenant || "default";
  const lang = searchParams?.get("lang") || "en";

  const { data: landing } = useQuery({
    queryKey: ["landing", "published", slug, tenantSlug, lang],
    queryFn: () => getPublishedLanding(slug, lang)
  });

  const { data: tenant } = useQuery({ queryKey: ["tenant", tenantSlug], queryFn: getTenant });
  const { data: loaderPage } = useQuery({
    queryKey: ["page", "loader"],
    queryFn: () => getPageContent("loader")
  });

  if (!landing || !tenant) {
    return <PageLoader page={loaderPage} tenant={tenant} theme={landing?.theme} />;
  }

  return (
    <ThemeProvider theme={landing.theme}>
      <LandingRenderer data={landing} tenant={tenant} slug={slug} />
    </ThemeProvider>
  );
}
