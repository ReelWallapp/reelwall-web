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
            Built around the moments worth remembering.
          </h1>

          <p className={styles.subtitle}>
            ReelWall is a digital trophy wall for anglers — a place to capture
            fishing memories, mount the moments that matter, and preserve the
            stories behind them.
          </p>

          <div className={styles.actions}>
            <Link href="/news/why-we-built-reelwall" className={styles.primaryButton}>
              Why We Built ReelWall
            </Link>

            <Link href="/collections" className={styles.secondaryButton}>
              Explore Collections
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.storyCard}>
            <p className={styles.cardEyebrow}>OUR PURPOSE</p>

            <h2>Not every fish makes the wall.</h2>

            <p>
              Some catches are more than a photo. They carry a story — a trip,
              a person, a season, a memory, or a moment you do not want buried
              in your camera roll.
            </p>

            <p>
              ReelWall was built for those moments. It is not meant to be just
              another fishing feed. It is a cleaner, more intentional place for
              anglers to build their own digital trophy wall.
            </p>
          </div>

          <div className={styles.grid}>
            <div className={styles.infoCard}>
              <span>01</span>
              <h3>Capture</h3>
              <p>
                Save the photo, date, place, and story behind the fishing memory.
              </p>
            </div>

            <div className={styles.infoCard}>
              <span>02</span>
              <h3>Mount</h3>
              <p>
                Choose the moments worthy of your public ReelWall trophy wall.
              </p>
            </div>

            <div className={styles.infoCard}>
              <span>03</span>
              <h3>Preserve</h3>
              <p>
                Use LiveWell Vault for the memories you want to carry forward.
              </p>
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