"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { PageRenderer } from "@/widgets/page-renderer";
import { getPageContent, getPublishedLanding, getTenant } from "@/shared/api/landing-repo";
import { getNavBlock } from "@/shared/lib/nav";
import { PageLoader } from "@/shared/ui/page-loader";

export default function TeamTrainingPage() {
  const params = useParams<{ tenant: string }>();
  const searchParams = useSearchParams();
  const tenantSlug = params?.tenant || "default";
  const slug = "team-training";
  const lang = searchParams?.get("lang") || "en";

  const { data: landing } = useQuery({
    queryKey: ["landing", "published", "home", tenantSlug, lang],
    queryFn: () => getPublishedLanding("home", lang)
  });
  const { data: tenant } = useQuery({ queryKey: ["tenant", tenantSlug], queryFn: getTenant });
  const { data: page } = useQuery({ queryKey: ["page", slug], queryFn: () => getPageContent(slug) });
  const { data: loaderPage } = useQuery({
    queryKey: ["page", "loader"],
    queryFn: () => getPageContent("loader")
  });

  if (!landing || !tenant || !page) {
    return <PageLoader page={loaderPage} tenant={tenant} theme={landing?.theme} />;
  }

  const navBlock = getNavBlock(landing);

  return (
    <ThemeProvider theme={landing.theme}>
      <PageRenderer tenant={tenant} nav={navBlock?.props} page={page} />
    </ThemeProvider>
  );
}
