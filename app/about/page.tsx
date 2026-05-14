import Link from 'next/link';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.glowOne} />
        <div className={styles.glowTwo} />

        <div className={styles.container}>
          <p className={styles.eyebrow}>ABOUT REELWALL</p>

          <h1 className={styles.title}>
            Built around the fishing moments worth remembering.
          </h1>

          <p className={styles.subtitle}>
            ReelWall is a digital trophy wall for anglers — a place to capture
            fishing memories, tell the story behind them, build collections, and
            preserve the moments that matter most.
          </p>

          <div className={styles.actions}>
            <Link href="/collections" className={styles.primaryButton}>
              Explore Collections
            </Link>

            <Link href="/vault" className={styles.secondaryButton}>
              View LiveWell Vault
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.founderSection}>
  <div className={styles.container}>
    <div className={styles.founderCard}>
      <div className={styles.founderContent}>
        <div className={styles.founderTop}>
          <div className={styles.founderLogoWrap}>
            <img
              src="/logo.png"
              alt="ReelWall logo"
              className={styles.founderLogo}
            />
          </div>

          <p className={styles.eyebrow}>FOUNDER STORY</p>
        </div>

        <h2>
          Built by an angler who got tired of losing the memories.
        </h2>

        <p>
          ReelWall started from a simple problem: fishing memories were
          getting buried in camera rolls, old phones, folders, and social
          feeds.
        </p>

        <p>
          I wanted a better place for anglers to capture the moments from
          the water, tell the story behind them, organize collections, and
          preserve the ones worth remembering.
        </p>

        <p className={styles.founderSignature}>
          — Phil Harrison, Founder of ReelWall
        </p>

        <div className={styles.founderActions}>
          <Link
            href="/news/why-we-built-reelwall"
            className={styles.primaryButton}
          >
            Read The Full Story
          </Link>
        </div>
      </div>

      <div className={styles.founderImageSide}>
        <img
          src="/founder-story.png"
          alt="ReelWall founder story"
          className={styles.founderImage}
        />
      </div>
    </div>
  </div>
</section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerInner}>
            <div>
              <div className={styles.footerBrand}>REELWALL</div>
              <p className={styles.footerText}>Land the fish. Tell the story.</p>
            </div>

            <div className={styles.footerLinks}>
              <Link href="/">Home</Link>
              <Link href="/collections">Collections</Link>
              <Link href="/vault">Vault</Link>
              <Link href="/news">News</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}