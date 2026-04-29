'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGlowOne} />
        <div className={styles.heroGlowTwo} />

        <div className={styles.container}>
          <div className={styles.heroInner}>
            <div className={styles.logoShell}>
              <div className={styles.logoWrap}>
                <img
                  src="/logo.png"
                  alt="ReelWall logo"
                  className={styles.logo}
                />
              </div>
            </div>

            <p className={styles.eyebrow}>REELWALL DIGITAL TROPHY WALL</p>

            <h1 className={styles.heroTitle}>
              Build your wall.
              <br />
              Share the story.
            </h1>

            <p className={styles.heroText}>
              ReelWall is where your catches and stories become a legacy —
              preserved and shared.
            </p>

            <div className={styles.heroActions}>
              <Link href="/collections" className={styles.primaryButton}>
                Explore Public Collections
              </Link>

              <button
                type="button"
                className={styles.secondaryButton}
                disabled
                aria-disabled="true"
              >
                Download the App
              </button>
            </div>

            <p className={styles.comingSoonText}>
              iOS app coming soon.
            </p>

            <div className={styles.heroPills}>
              <div className={styles.heroPill}>
                <span className={styles.heroPillTitle}>Capture</span>
                <span className={styles.heroPillLabel}>the moment</span>
              </div>

              <div className={styles.heroPill}>
                <span className={styles.heroPillTitle}>Build</span>
                <span className={styles.heroPillLabel}>your wall</span>
              </div>

              <div className={styles.heroPill}>
                <span className={styles.heroPillTitle}>Share</span>
                <span className={styles.heroPillLabel}>your story</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎣</div>
              <p className={styles.featureEyebrow}>Capture</p>
              <h3 className={styles.featureTitle}>Keep the moments that matter</h3>
              <p className={styles.featureText}>
                Save the fish, the water, the weather, the trip, and the story
                behind it.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🗂️</div>
              <p className={styles.featureEyebrow}>Organize</p>
              <h3 className={styles.featureTitle}>Build collections with meaning</h3>
              <p className={styles.featureText}>
                Group catches by season, species, memories, milestones, or family
                trips.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🌊</div>
              <p className={styles.featureEyebrow}>Share</p>
              <h3 className={styles.featureTitle}>Turn your wall public</h3>
              <p className={styles.featureText}>
                Share a collection and let others explore the catches that define
                your story.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>REELWALL</div>

            <p className={styles.footerText}>
              A digital trophy wall for anglers to capture, organize, and share their catches and the stories behind them.
            </p>

            <div className={styles.footerLinks}>
              <Link href="/" className={styles.footerLink}>
                Home
              </Link>

              <Link href="/collections" className={styles.footerLink}>
                Collections
              </Link>

              <Link href="/privacy" className={styles.footerLink}>
                Privacy Policy
              </Link>

              <Link href="/terms" className={styles.footerLink}>
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}