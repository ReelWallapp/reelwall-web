import Link from 'next/link';
import styles from '../page.module.css';

export default function WhyWeBuiltReelWallPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGlowOne} />
        <div className={styles.heroGlowTwo} />

        <div className={styles.container}>
          <nav className={styles.nav}>
            <Link href="/" className={styles.brand}>
              <span className={styles.logoBadge}>
                <img
                  src="/logo.png"
                  alt="ReelWall logo"
                  className={styles.navLogo}
                />
              </span>

              <span>REELWALL</span>
            </Link>

            <div className={styles.navLinks}>
              <Link href="/">Home</Link>
              <Link href="/collections">Collections</Link>
              <Link href="/vault">Vault</Link>
              <Link href="/news">News</Link>
            </div>
          </nav>

          <div className={styles.heroInner}>
            <div className={styles.heroLogoWrap}>
              <img
                src="/logo.png"
                alt="ReelWall logo"
                className={styles.heroLogo}
              />
            </div>

            <p className={styles.eyebrow}>FOUNDERS NOTE</p>

            <h1 className={styles.heroTitle}>
              Why We Built ReelWall
            </h1>

            <p className={styles.heroText}>
              Built by an angler for anglers.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div
          className={styles.comingSoonCard}
          style={{
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          <div
            style={{
              position: 'relative',
              zIndex: 1,
            }}
          >
            <p
              style={{
                color: '#c0cedb',
                lineHeight: 1.9,
                fontSize: 17,
                margin: 0,
              }}
            >
              ReelWall started with a pretty simple idea.
              <br />
              <br />
              Fishing memories deserve a better home.
              <br />
              <br />
              Like a lot of anglers, I had photos spread everywhere — old
              phones, camera rolls, different social apps, screenshots,
              folders I forgot about, and stories that slowly got buried
              over time. Some memories were lost completely after accounts
              got hacked or devices failed.
              <br />
              <br />
              After losing years of fishing photos myself, I realized there
              really wasn’t a place built specifically for anglers to keep
              track of the moments that actually matter to them.
              <br />
              <br />
              So I decided to build one.
              <br />
              <br />
              ReelWall is a place to capture memories from the water, tell
              the story behind them, organize collections, mount your
              favorite moments, and preserve the experiences you never want
              to lose.
              <br />
              <br />
              It’s also about the old memories too — the photos of your
              dad, your grandpa, old fishing trips, worn-out printed
              pictures sitting in boxes or albums somewhere. The moments
              that become more meaningful as time passes. ReelWall gives
              anglers a place to bring those memories back to life and
              preserve them digitally so they are not lost over time.
              <br />
              <br />
              This was never meant to feel like another social media app. I
              wanted it to feel more personal than that — more like a
              digital trophy wall built around memory, legacy, and time
              spent outdoors.
              <br />
              <br />
              Most importantly, ReelWall is built around fishing itself.
              The stories, the early mornings, the people you were with,
              the one that got away, and the ones you’ll remember for the
              rest of your life.
              <br />
              <br />
              We’re still early, and there’s a lot more ahead — from
              collections and preservation tools to community
              participation, collectibles, rarities, heirloom-style
              features, and entirely new ways for anglers to connect with
              and preserve the moments they care about most.
              <br />
              <br />
              Thanks for joining us early in the journey as we try
              different water, explore new ideas, run to new spots,
              and switch lures here and there.
              <br />
              <br />
              And hopefully… we’re fishing where the fish are.
              <br />
              <br />
              <span
                style={{
                  color: '#f2c94c',
                  fontWeight: 900,
                }}
              >
                — Phil
                <br />
                Founder, ReelWall
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className={styles.footerBand}>
        <div className={styles.container}>
          <div className={styles.footerBandInner}>
            <p className={styles.footerEyebrow}>REELWALL</p>

            <h3 className={styles.footerTitle}>
              Land the fish. Tell the story.
            </h3>

            <p className={styles.footerText}>
              ReelWall is built for anglers who want to capture memories,
              mount what matters, and preserve what lasts.
            </p>

            <div className={styles.footerActions}>
              <Link
                href="/collections"
                className={styles.footerButton}
              >
                Explore Collections
              </Link>

              <Link
                href="/vault"
                className={styles.footerButtonSecondary}
              >
                View LiveWell Vault
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}