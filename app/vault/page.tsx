'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function VaultPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <img src="/logo.png" alt="ReelWall logo" className={styles.brandLogo} />
          <span>REELWALL</span>
        </Link>

       <a
  href="https://apps.apple.com/ca/app/reelwall/id6763661886"
  target="_blank"
  rel="noopener noreferrer"
  className={styles.appButton}
>
          <span className={styles.appleIcon}></span>
          <span>
            <strong>App Store</strong>
            Download
          </span>
        </a>
      </header>

      <section className={styles.hero}>
        <div className={styles.glowOne} />
        <div className={styles.glowTwo} />

        <div className={styles.container}>
          <p className={styles.eyebrow}>LIVEWELL VAULT</p>

          <div className={styles.vaultLogoWrap}>
            <img
              src="/reelwall-vault-hook-lock.png"
              alt="LiveWell Vault"
              className={styles.vaultLogo}
            />
          </div>

          <h1>Your Best Moments, Preserved.</h1>

          <p className={styles.heroText}>
            LiveWell Vault is where your most meaningful ReelWall angling memories are
            protected, verified, and ready to carry forward.
          </p>

          <div className={styles.taglineWrap}>
            <span>You earned the moment</span>
            <strong>Now preserve it</strong>
          </div>

          <div className={styles.heroActions}>
            <a
  href="https://apps.apple.com/ca/app/reelwall/id6763661886"
  target="_blank"
  rel="noopener noreferrer"
  className={styles.primaryButton}
>
              Download on the App Store
            </a>

            <Link href="/collections" className={styles.secondaryButton}>
              Explore Collections
            </Link>
          </div>

          <p className={styles.promoText}>Early access: first 3 Vault records on us</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.statusCard}>
            <div>
              <p className={styles.cardLabel}>MY VAULT</p>
              <h2>Vault Ready</h2>
              <p>
                Choose from your mounted ReelWall memories and preserve the ones
                that matter most.
              </p>
            </div>

            <div className={styles.countBox}>
  <p className={styles.countBadge}>FOUNDING ANGLER BONUS</p>

  <strong>3</strong>

  <span>Vault Records</span>

  <small>
    Included during early access
  </small>
</div>
          </div>

          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}></span>
              <h3>Mount first</h3>
              <p>
                Vault is intentionally built for mounted catches — the moments
                already chosen for your ReelWall.
              </p>
            </div>

            <div className={styles.featureCard}>
              <span className={styles.featureIcon}></span>
              <h3>Preserve the record</h3>
              <p>
                Save the image, story, date, and location into a dedicated Vault
                record.
              </p>
            </div>

            <div className={styles.featureCard}>
              <span className={styles.featureIcon}></span>
              <h3>Verify and share</h3>
              <p>
                Vault records can include certificate-style pages and QR-ready
                verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.recordsSection}>
        <div className={styles.container}>
          <div className={styles.recordsHeader}>
            <div>
              <p className={styles.eyebrow}>VAULT RECORDS</p>
              <h2>Private by default. Built to last.</h2>
            </div>

            <span className={styles.privatePill}>🔒 Secure. Private. Preserved.</span>
          </div>

          <div className={styles.demoRecord}>
            <div className={styles.recordImage}>
              <img
                src="/reelwall-vault-hook-lock.png"
                alt="Vault record"
              />
            </div>

            <div className={styles.recordCopy}>
              <p className={styles.cardLabel}>VAULT CERTIFICATE</p>
              <h3>Every saved catch becomes a record.</h3>
              <p>
                LiveWell Vault gives special angling memories a preserved record designed to last beyond everyday storage and social feeds.
              </p>

              <div className={styles.recordActions}>
                <span>View Certificate</span>
                <span>QR Verification</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.infoSection}>
        <div className={styles.container}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <p className={styles.infoBadge}>WHY IT MATTERS</p>
<h3>Some moments deserve more than a post.</h3>

<p>
  All ReelWall angling memories are securely stored within the app.
</p>

<p>
  LiveWell Vault adds an additional preservation layer for the
  moments that matter most.
</p>

<p>
  When a moment is vaulted, ReelWall creates a preserved snapshot
  of the image, story, catch date, and details exactly as they
  existed at that moment in time.
</p>

<p>
  Unlike ordinary storage or social posts that can become buried,
  altered, compressed, or lost over time, vaulted records are
  preserved with independent verification, unique record IDs,
  certificate pages, preservation timestamps, and long-term
  preservation records.
</p>

<p>
  Think of it less like saving a photo — and more like preserving
  a fishing memory.
</p>
            </div>

            <div className={styles.infoCard}>
              <p className={styles.infoBadge}>BUILT ON YOUR REELWALL</p>
              <h3>Nothing changes about your wall.</h3>
              <p>
                Your photos, stories, and mounted moments stay exactly where
                they are. Vault is an added layer for the catches you want to
                protect and carry forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <Link href="/">← Back to ReelWall</Link>
        </div>
      </footer>
    </main>
  );
}