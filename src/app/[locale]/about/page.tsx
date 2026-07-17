import Link from 'next/link'
import type { Metadata } from 'next'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import { type Locale } from '@/i18n/routing'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.buildabucket.wiki'
  const path = '/about'

  return {
    title: 'About Build-A-Bucket Wiki - Your Build-A-Bucket Resource Hub',
    description: 'Learn about Build-A-Bucket Wiki, a community-driven resource hub covering builds, the NBA player wheel, attributes, ratings, sandbox mode, and season simulations for the browser basketball game.',
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: locale === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`,
      siteName: 'Build-A-Bucket Wiki',
      title: 'About Build-A-Bucket Wiki',
      description: 'Learn about our mission to provide the best Build-A-Bucket builds, ratings, and strategies.',
      images: [
        {
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          alt: 'Build-A-Bucket Wiki',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'About Build-A-Bucket Wiki',
      description: 'Learn about our mission to provide the best Build-A-Bucket resources.',
      images: [`${siteUrl}/images/hero.webp`],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Build-A-Bucket Wiki
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            Your community-driven resource center for Build-A-Bucket
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Welcome to Build-A-Bucket Wiki</h2>
            <p>
              Build-A-Bucket Wiki is an <strong>unofficial, fan-made resource website</strong> dedicated to helping players
              master the browser basketball game &quot;Build-A-Bucket&quot;. We are a community-driven platform that covers the
              NBA player wheel, attribute picks, the best builds, overall ratings, sandbox mode, and full season simulations
              to help you get the most out of every spin.
            </p>
            <p>
              Whether you&apos;re a first-time player learning how the wheel works or a min-maxer chasing a 99 OVR build,
              Build-A-Bucket Wiki is here to support you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Our Mission</h2>
            <p>
              Our mission is simple: <strong>to empower Build-A-Bucket players with accurate, up-to-date information
              and clear strategies</strong> that help them build stronger stars and run smarter seasons. We strive to:
            </p>
            <ul>
              <li><strong>Provide reliable information:</strong> Keep our builds, ratings, and player notes updated as the game adds new players and modes</li>
              <li><strong>Break down the mechanics:</strong> Explain how each attribute pick changes your overall rating so you can plan with confidence</li>
              <li><strong>Foster community:</strong> Create a welcoming space where players can share builds, sandbox experiments, and season results</li>
              <li><strong>Stay accessible:</strong> Keep all resources free and easy to use for players of all skill levels</li>
            </ul>

            <h2>Our Vision</h2>
            <p>
              We envision Build-A-Bucket Wiki as the <strong>go-to destination</strong> for every Build-A-Bucket player seeking
              to improve their builds. We want to be the resource that players trust and rely on, whether they need a strong
              99 OVR template, want to understand the player wheel, or are testing wild setups in sandbox mode.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature Card 1 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🏀</div>
              <h3 className="text-xl font-semibold text-white mb-2">Best Builds</h3>
              <p className="text-slate-300">
                Complete attribute combinations and 99 OVR challenge strategies, from scorers and playmakers to two-way stars.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-2">Player Wheel</h3>
              <p className="text-slate-300">
                The NBA players that show up on the wheel and the specific skills worth picking from each one.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">📊</div>
              <h3 className="text-xl font-semibold text-white mb-2">Attributes</h3>
              <p className="text-slate-300">
                How shooting, playmaking, and defense ratings work, and which picks move the needle for each build type.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">⭐</div>
              <h3 className="text-xl font-semibold text-white mb-2">Ratings &amp; OVR</h3>
              <p className="text-slate-300">
                How your attribute choices add up to 90, 95, and 99 overall, and what separates a good build from a great one.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🏆</div>
              <h3 className="text-xl font-semibold text-white mb-2">Season Simulation</h3>
              <p className="text-slate-300">
                Regular season results, playoffs, awards, and championship outcomes explained so you know what to expect.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🧪</div>
              <h3 className="text-xl font-semibold text-white mb-2">Sandbox Mode</h3>
              <p className="text-slate-300">
                Freely tweak ratings and run experimental builds to test the limits of the rating system outside the wheel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Community-Driven</h2>
            <p>
              Build-A-Bucket Wiki is built <strong>by the community, for the community</strong>. We welcome contributions,
              feedback, and suggestions from players of all skill levels. Our content is constantly evolving based on:
            </p>
            <ul>
              <li><strong>Player feedback:</strong> Your suggestions help us improve and expand our builds and guides</li>
              <li><strong>Community discoveries:</strong> New attribute combos, 99 OVR paths, and sandbox experiments shared by players</li>
              <li><strong>Game updates:</strong> We monitor new players and modes and adjust our content accordingly</li>
              <li><strong>Meta shifts:</strong> We track which builds and picks perform best based on real season results</li>
            </ul>
            <p>
              <strong>Want to contribute?</strong> Whether you&apos;ve found a new 99 OVR combination, mapped out the player wheel,
              or have suggestions for new guides, we&apos;d love to hear from you! Reach out through our contact channels below.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>About the Team</h2>
            <p>
              Build-A-Bucket Wiki is maintained by a dedicated team of passionate gamers and analysts who love
              Build-A-Bucket as much as you do. We&apos;re players first, constantly testing builds, spinning the wheel,
              and staying updated with the latest season results and sandbox experiments.
            </p>
            <p>
              Our team combines expertise in:
            </p>
            <ul>
              <li><strong>Game analysis:</strong> Deep understanding of Build-A-Bucket mechanics, attributes, and the rating system</li>
              <li><strong>Web development:</strong> Building fast, user-friendly tools and interfaces</li>
              <li><strong>Content creation:</strong> Writing clear, helpful builds and strategy guides</li>
              <li><strong>Community management:</strong> Listening to player feedback and fostering a positive environment</li>
            </ul>
            <p className="text-slate-400 italic text-sm">
              Project Codename: &quot;Bucket&quot; – Building NBA stars, one spin at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Important Disclaimer</h2>
            <p className="text-yellow-400/90">
              <strong>Build-A-Bucket Wiki is an unofficial fan-made website.</strong> We are NOT affiliated with,
              endorsed by, or associated with Build-A-Player or the developers of Build-A-Bucket.
            </p>
            <p>
              All game content, trademarks, player names, and assets are the property of their respective owners.
              We use game-related content under fair use principles for informational and educational purposes only.
            </p>
            <p>
              Build-A-Bucket Wiki is a non-profit, community resource created by fans, for fans.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Get in Touch</h2>
            <p>
              We&apos;d love to hear from you! Whether you have questions, suggestions, found a bug, or just want to say hi:
            </p>
            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">General Inquiries</h3>
                <a href="mailto:contact@buildabucket.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  contact@buildabucket.wiki
                </a>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">Bug Reports</h3>
                <a href="mailto:support@buildabucket.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  support@buildabucket.wiki
                </a>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">Content Submissions</h3>
                <a href="mailto:contribute@buildabucket.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  contribute@buildabucket.wiki
                </a>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">Partnerships</h3>
                <a href="mailto:partnerships@buildabucket.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  partnerships@buildabucket.wiki
                </a>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              <strong>Response Time:</strong> We aim to respond to all inquiries within 2-3 business days.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-[hsl(var(--nav-theme)/0.3)] to-[hsl(var(--nav-theme)/0.1)] border-y border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Stay updated with the latest builds, ratings, and Build-A-Bucket news.
            Bookmark this site and check back regularly for new content!
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[hsl(var(--nav-theme-light))] text-white font-semibold hover:opacity-90 transition"
          >
            Explore Resources
          </Link>
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Link href="/" className="text-[hsl(var(--nav-theme-light))] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  )
}
