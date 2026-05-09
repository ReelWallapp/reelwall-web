import Link from 'next/link';
import styles from './page.module.css';

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.glowOne} />
        <div className={styles.glowTwo} />

        <div className={styles.container}>
          <p className={styles.eyebrow}>CONTACT REELWALL</p>

          <h1 className={styles.title}>
            Questions, feedback, or fishing stories?
          </h1>

          <p className={styles.subtitle}>
            ReelWall is live and growing. Reach out with support questions,
            ideas, feedback, or stories from the water.
          </p>

          <div className={styles.contactCard}>
            <div className={styles.contactRow}>
              <div>
                <p className={styles.label}>Email</p>
                <h2>Get in touch</h2>
              </div>

              <a href="mailto:info@reelwall.app" className={styles.emailButton}>
                info@reelwall.app
              </a>
            </div>

            <div className={styles.divider} />

            <div className={styles.contactRow}>
              <div>
                <p className={styles.label}>Download</p>
                <h2>Find ReelWall on the App Store</h2>
              </div>

              <a
                href="https://apps.apple.com/ca/app/reelwall/id6763661886"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryButton}
              >
                Download Now
              </a>
            </div>
          </div>
          </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerInner}>
            <div>
              <div className={styles.footerBrand}>REELWALL</div>
              <p className={styles.footerText}>
                Land the fish. Tell the story.
              </p>
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