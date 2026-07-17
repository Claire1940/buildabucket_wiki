"use client";

import { useState, Suspense, lazy } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  ExternalLink,
  FlaskConical,
  Layers,
  LineChart,
  Newspaper,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Conditionally render text as a link or plain span.
// 当前 moduleLinkMap 为空（content 已清空、nav 已清空），所有模块标题与子项
// 都会降级为纯文本，从而移除首页全部内部 URL 链接。
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined;
  children: React.ReactNode;
  className?: string;
  locale: string;
}) {
  if (linkData) {
    const href = locale === "en" ? linkData.url : `/${locale}${linkData.url}`;
    return (
      <Link
        href={href}
        className={`${className || ""} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.buildabucket.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Build-A-Bucket Wiki",
        description:
          "Build-A-Bucket Wiki covers the player wheel, NBA attribute choices, best builds, overall ratings, sandbox mode, season simulations, updates, and strategies.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Build-A-Bucket - NBA Player Builder & Season Simulator",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Build-A-Bucket Wiki",
        alternateName: "Build-A-Bucket",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Build-A-Bucket Wiki - NBA Player Builder & Season Simulator",
        },
        description:
          "Build-A-Bucket Wiki resource hub for builds, NBA player wheel picks, attributes, ratings, sandbox mode, and season simulations.",
        sameAs: [
          "https://www.build-a-player.com/",
          "https://x.com/Build_A_Player",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Build-A-Bucket",
        gamePlatform: ["Web browser"],
        applicationCategory: "Game",
        genre: ["Sports", "Simulation", "Basketball", "Strategy"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://www.build-a-player.com/bucket",
        },
      },
      {
        "@type": "VideoObject",
        name: "Can I Create a 99 OVR on Build a Bucket?",
        description:
          "Build a Bucket gameplay challenge video featuring the NBA player wheel, attribute picks, and a 99 OVR build attempt in the browser basketball game.",
        uploadDate: "2026-03-12",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/IRd9YHEGmy0",
        url: "https://www.youtube.com/watch?v=IRd9YHEGmy0",
      },
    ],
  };

  // FAQ + Updates accordion state
  const [updatesExpanded, setUpdatesExpanded] = useState<number | null>(0);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Tools Grid 卡片锚点（与下方 8 个 section 一一对应）
  const sectionIds = [
    "beginner-guide",
    "best-builds",
    "ovr-99-guide",
    "attribute-tier-list",
    "best-players-wheel-picks",
    "sandbox-mode-guide",
    "season-simulator-guide",
    "updates-new-features",
  ];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* ============ Hero Section ============ */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("best-builds")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.build-a-player.com/bucket"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* ============ Video Section（视口内自动播放）============ */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="IRd9YHEGmy0"
              title="Can I Create a 99 OVR on Build a Bucket?"
            />
          </div>
        </div>
      </section>

      {/* ============ Tools Grid - 8 Navigation Cards ============ */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = sectionIds[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* ============ Module 1: Beginner Guide ============ */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 text-[hsl(var(--nav-theme-light))]">
              <BookOpen className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Getting Started
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle linkData={moduleLinkMap["bucketBeginnerGuide"]} locale={locale}>
                {t.modules.bucketBeginnerGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.bucketBeginnerGuide.intro}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {t.modules.bucketBeginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`bucketBeginnerGuide::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {step.description}
                  </p>
                  {step.tip && (
                    <p className="mt-2 flex items-start gap-2 text-sm text-[hsl(var(--nav-theme-light))]">
                      <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{step.tip}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Check className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.bucketBeginnerGuide.quickTips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* ============ Module 2: Best Builds ============ */}
      <section id="best-builds" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 text-[hsl(var(--nav-theme-light))]">
              <Layers className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Build Strategies
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle linkData={moduleLinkMap["bucketBestBuilds"]} locale={locale}>
                {t.modules.bucketBestBuilds.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.bucketBestBuilds.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.bucketBestBuilds.builds.map((build: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">
                    <LinkedTitle linkData={moduleLinkMap[`bucketBestBuilds::builds::${index}`]} locale={locale}>
                      {build.name}
                    </LinkedTitle>
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                    {build.difficulty}
                  </span>
                </div>
                <p className="text-sm font-medium mb-3">{build.role}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {build.coreAttributes.map((attr: string, ai: number) => (
                    <span
                      key={ai}
                      className="text-xs px-2 py-0.5 rounded-md bg-[hsl(var(--nav-theme)/0.15)] text-[hsl(var(--nav-theme-light))]"
                    >
                      {attr}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{build.strategy}</p>
                <div className="space-y-2 text-sm mt-auto">
                  <p className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{build.recovery}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{build.avoid}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Module 3: 99 OVR Guide ============ */}
      <section id="ovr-99-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 text-[hsl(var(--nav-theme-light))]">
              <Trophy className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Rating Optimization
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle linkData={moduleLinkMap["bucketOvr99Guide"]} locale={locale}>
                {t.modules.bucketOvr99Guide.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.bucketOvr99Guide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.bucketOvr99Guide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`bucketOvr99Guide::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-2">
                    {step.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <p className="flex items-start gap-2 rounded-lg bg-[hsl(var(--nav-theme)/0.07)] p-2.5">
                      <Target className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{step.rule}</span>
                    </p>
                    <p className="flex items-start gap-2 rounded-lg bg-amber-500/5 p-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{step.risk}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Module 4: Attribute Tier List ============ */}
      <section id="attribute-tier-list" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 text-[hsl(var(--nav-theme-light))]">
              <BarChart3 className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Attribute Rankings
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle linkData={moduleLinkMap["bucketAttributeTierList"]} locale={locale}>
                {t.modules.bucketAttributeTierList.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.bucketAttributeTierList.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-6">
            {t.modules.bucketAttributeTierList.tiers.map((tier: any, ti: number) => {
              const tierColor =
                tier.tier === "S"
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                  : tier.tier === "A"
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                    : "bg-sky-500/15 border-sky-500/40 text-sky-300";
              return (
                <div key={ti}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-lg border text-xl font-bold ${tierColor}`}>
                      {tier.tier}
                    </span>
                    <div>
                      <h3 className="font-bold text-lg">{tier.label}</h3>
                      <p className="text-sm text-muted-foreground">{tier.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tier.attributes.map((attr: any, ai: number) => (
                      <div
                        key={ai}
                        className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h4 className="font-bold">
                            <LinkedTitle linkData={moduleLinkMap[`bucketAttributeTierList::tiers::${ti}::attributes::${ai}`]} locale={locale}>
                              {attr.name}
                            </LinkedTitle>
                          </h4>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                            {attr.priority}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{attr.why}</p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {attr.profiles.map((p: string, pi: number) => (
                            <span key={pi} className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-border">
                              {p}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(attr.styles).map(([style, grade]: [string, any]) => (
                            <span key={style} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground">
                              {style}: <span className="text-[hsl(var(--nav-theme-light))] font-semibold">{grade}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 5: 中部阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* ============ Module 5: Best Players and Wheel Picks ============ */}
      <section id="best-players-wheel-picks" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 text-[hsl(var(--nav-theme-light))]">
              <Users className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Wheel Strategy
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle linkData={moduleLinkMap["bucketBestPlayersWheelPicks"]} locale={locale}>
                {t.modules.bucketBestPlayersWheelPicks.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.bucketBestPlayersWheelPicks.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.bucketBestPlayersWheelPicks.picks.map((pick: any, index: number) => (
              <div
                key={index}
                className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {pick.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{pick.stat}</span>
                </div>
                <h3 className="text-lg font-bold text-[hsl(var(--nav-theme-light))] mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`bucketBestPlayersWheelPicks::picks::${index}`]} locale={locale}>
                    {pick.player}
                  </LinkedTitle>
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{pick.why}</p>
                <p className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
                  <ArrowRight className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>{pick.skip}</span>
                </p>
                <div className="rounded-lg bg-[hsl(var(--nav-theme)/0.07)] p-3 text-sm">
                  <p className="font-semibold mb-1">
                    Alternative: <span className="text-[hsl(var(--nav-theme-light))]">{pick.alternative}</span>
                    <span className="text-muted-foreground font-normal"> — {pick.altStat}</span>
                  </p>
                  <p className="text-muted-foreground">{pick.comparison}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* ============ Module 6: Sandbox Mode Guide ============ */}
      <section id="sandbox-mode-guide" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 text-[hsl(var(--nav-theme-light))]">
              <FlaskConical className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Build Testing
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle linkData={moduleLinkMap["bucketSandboxModeGuide"]} locale={locale}>
                {t.modules.bucketSandboxModeGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.bucketSandboxModeGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.bucketSandboxModeGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`bucketSandboxModeGuide::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-3">
                    {step.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <p className="flex items-start gap-2 rounded-lg bg-[hsl(var(--nav-theme)/0.07)] p-2.5">
                      <FlaskConical className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{step.experiment}</span>
                    </p>
                    <p className="flex items-start gap-2 rounded-lg bg-emerald-500/5 p-2.5">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{step.readout}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Module 7: Season Simulator Guide ============ */}
      <section id="season-simulator-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 text-[hsl(var(--nav-theme-light))]">
              <LineChart className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Season Results
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle linkData={moduleLinkMap["bucketSeasonSimulatorGuide"]} locale={locale}>
                {t.modules.bucketSeasonSimulatorGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.bucketSeasonSimulatorGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.bucketSeasonSimulatorGuide.profiles.map((profile: any, index: number) => (
              <div
                key={index}
                className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))] mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`bucketSeasonSimulatorGuide::profiles::${index}`]} locale={locale}>
                    {profile.profile}
                  </LinkedTitle>
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{profile.inputs}</p>
                <p className="text-xs text-muted-foreground italic mb-3">{profile.benchmark}</p>
                <p className="text-sm text-muted-foreground mb-3">{profile.read}</p>
                <div className="space-y-2 text-sm mb-3">
                  <p className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{profile.strong}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{profile.weak}</span>
                  </p>
                </div>
                <p className="flex items-start gap-2 text-sm rounded-lg bg-[hsl(var(--nav-theme)/0.07)] p-2.5">
                  <ArrowRight className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{profile.adjustment}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Module 8: Updates and New Features ============ */}
      <section id="updates-new-features" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 text-[hsl(var(--nav-theme-light))]">
              <Newspaper className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Game Updates
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle linkData={moduleLinkMap["bucketUpdatesNewFeatures"]} locale={locale}>
                {t.modules.bucketUpdatesNewFeatures.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.bucketUpdatesNewFeatures.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3">
            {t.modules.bucketUpdatesNewFeatures.entries.map((entry: any, index: number) => (
              <div
                key={index}
                className="border border-border rounded-xl overflow-hidden bg-white/5"
              >
                <button
                  onClick={() => setUpdatesExpanded(updatesExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {entry.date}
                    </span>
                    <span className="font-semibold truncate">{entry.title}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${updatesExpanded === index ? "rotate-180" : ""}`}
                  />
                </button>
                {updatesExpanded === index && (
                  <div className="px-4 md:px-5 pb-5">
                    <p className="text-sm text-muted-foreground mb-3">{entry.summary}</p>
                    <ul className="space-y-2">
                      {entry.changes.map((change: string, ci: number) => (
                        <li key={ci} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 官方渠道外链 */}
          <div className="scroll-reveal mt-8 flex flex-wrap gap-3 justify-center">
            <a
              href="https://x.com/Build_A_Player"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
            >
              <Star className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              Official X <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.build-a-player.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
            >
              Official Site <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* ============ Latest Updates（保留模板模块，禁止删除）============ */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={12} />

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.build-a-player.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.officialSite}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/Build_A_Player"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=IRd9YHEGmy0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link href="/copyright" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
