'use client';

import Link from 'next/link';
import styles from './page.module.css';

const stories = [
  {
    tag: 'FOUNDERS NOTE',
    title: 'Why We Built ReelWall',
    text:
      'Fishing memories deserve a better home. ReelWall was built by an angler for anglers — to preserve stories, moments, and memories from the water before they are lost over time.',
    href: '/news/why-we-built-reelwall',
  },
  {
    tag: 'LIVEWELL VAULT',
    title: 'Preserve What Lasts',
    text:
      'Vault gives special fishing memories a more permanent place — with verification, certificate-style pages, and legacy in mind.',
    href: '/vault',
  },
  {
    tag: 'COLLECTIONS',
    title: 'Stories From the Water',
    text:
      'Collections help anglers group memories by trip, season, species, family moments, or time spent on the water.',
    href: '/collections',
  },
];

export default function NewsPage() {
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

            <p className={styles.eyebrow}>REELWALL NEWS</p>

            <h1 className={styles.heroTitle}>Stories from the water.</h1>

            <p className={styles.heroText}>
              Field notes, product updates, featured moments, and the stories
              behind ReelWall.
            </p>

            <div className={styles.heroPills}>
              <span>Updates</span>
              <span>Field Notes</span>
              <span>Vault</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <Link
            href="/news/why-we-built-reelwall"
            className={styles.comingSoonCard}
            style={{
              textDecoration: 'none',
            }}
          >
            <p className={styles.sectionEyebrow}>FEATURED NOTE</p>

            <h2
              style={{
                marginTop: 14,
              }}
            >
              Why We Built ReelWall
            </h2>

            <p>
              Fishing memories deserve a better home. ReelWall was built by an
              angler for anglers — to preserve stories, moments, and memories
              from the water before they are lost over time.
            </p>

            <div className={styles.comingSoonPill}>
              Read Founder Story →
            </div>
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Featured Notes</p>

            <h2 className={styles.sectionTitle}>
              Built around moments that matter.
            </h2>
          </div>

          <div className={styles.grid}>
            {stories.map((story) => (
              <Link
                key={story.title}
                href={story.href}
                className={styles.card}
              >
                <p className={styles.cardTag}>{story.tag}</p>

                <h3>{story.title}</h3>

                <p>{story.text}</p>

                <span>Read more →</span>
              </Link>
            ))}
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