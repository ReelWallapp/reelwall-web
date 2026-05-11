'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import styles from './page.module.css';

type FeaturedMount = {
  id: string;
  image_url?: string | null;
  note?: string | null;
  catch_date?: string | null;
  place_name?: string | null;
  region_name?: string | null;
  created_at?: string | null;
  mounted_at?: string | null;
};

export default function HomePage() {
  const [featuredMount, setFeaturedMount] = useState<FeaturedMount | null>(null);

  useEffect(() => {
    loadFeaturedMount();
  }, []);

  const loadFeaturedMount = async () => {
    const { data, error } = await supabase
  .from('catches')
  .select('id, image_url, note, catch_date, place_name, region_name, created_at, mounted_at')
  .eq('is_public', true)
  .not('image_url', 'is', null)
  .order('mounted_at', { ascending: false, nullsFirst: false })
  .order('created_at', { ascending: false })
  .limit(1)
  .maybeSingle();

    if (error) {
      console.log('Featured mount load error:', error);
      return;
    }

    setFeaturedMount(data);
  };

  const getPublicImageUrl = (value?: string | null) => {
    if (!value) return '';

    if (value.startsWith('file://')) return '';

    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    if (value.startsWith('/')) {
      return value;
    }

    const cleanPath = value
      .replace(/^\/+/, '')
      .replace(/^catches\//, '')
      .replace(/^public\//, '');

    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catches/${cleanPath}`;
  };

  const featuredImage = getPublicImageUrl(featuredMount?.image_url);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGlowOne} />
        <div className={styles.heroGlowTwo} />

        <div className={styles.container}>
          <nav className={styles.nav}>
            <Link href="/" className={styles.brand}>
              <span className={styles.logoBadge}>
                <img src="/logo.png" alt="ReelWall logo" className={styles.navLogo} />
              </span>

              <span>REELWALL</span>
            </Link>

            <div className={styles.navLinks}>
  <Link href="/collections">Collections</Link>
  <Link href="/vault">Vault</Link>
  <Link href="/news">News</Link>
  <Link href="/about">About</Link>
  <Link href="/contact">Contact</Link>
  <Link href="/privacy">Privacy</Link>
</div>
          </nav>

          <div className={styles.heroInner}>
            <div className={styles.heroLogoWrap}>
              <img src="/logo.png" alt="ReelWall logo" className={styles.heroLogo} />
            </div>

            <p className={styles.subtitle}>
              Every Fish Has a <span>Story</span>
            </p>

            <div className={styles.flowPill}>
              <div className={styles.flowStep}>
                <span>Capture</span>
              </div>

              <span className={styles.flowArrow}>→</span>

              <div className={styles.flowStepHighlight}>
                <span>Mount</span>
              </div>

              <span className={styles.flowArrow}>→</span>

              <div className={styles.flowStep}>
                <span>Vault</span>
              </div>
            </div>

            <h1 className={styles.heroTitle}>
              Land the fish.
              <br />
              Tell the story.
            </h1>

            <p className={styles.heroText}>
              ReelWall is a digital trophy wall for anglers to capture fishing
              memories, mount their best moments, build collections, and preserve
              the stories that matter most.
            </p>

            <div className={styles.heroActions}>
              <Link href="/collections" className={styles.primaryPill}>
                <span>
                  <strong>Explore</strong>
                  Public Collections
                </span>
              </Link>

              <Link href="/vault" className={styles.secondaryPill}>
                <span>
                  <strong>LiveWell</strong>
                  Vault
                </span>
              </Link>

              <a
                href="https://apps.apple.com/ca/app/reelwall/id6763661886"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadPill}
              >
                <span>
                  <strong>App Store</strong>
                  Download Now
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {featuredMount && (
        <section className={styles.featuredMountSection}>
          <div className={styles.container}>
            <div className={styles.featuredMountPanel}>
              <div className={styles.featuredMountImageWrap}>
                <img
                  src={featuredImage || '/logo.png'}
                  alt="Featured ReelWall mount"
                  className={styles.featuredMountImage}
                  onError={(e) => {
                    e.currentTarget.src = '/logo.png';
                  }}
                />
              </div>

              <div className={styles.featuredMountCopy}>
                <p className={styles.eyebrow}>FEATURED MOUNT</p>

                <h2>Moments worth mounting.</h2>

                <p>
                  {featuredMount.note ||
                    'A public ReelWall mount from the water — captured, mounted, and remembered.'}
                </p>

                <div className={styles.featuredMountMeta}>
                  {featuredMount.catch_date && <span>{featuredMount.catch_date}</span>}
                  {(featuredMount.region_name || featuredMount.place_name) && (
                    <span>{featuredMount.region_name || featuredMount.place_name}</span>
                  )}
                </div>

                <Link href="/collections" className={styles.primaryButton}>
                  Explore More Stories
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>THE REELWALL FLOW</p>

            <h2>From quick photo to lasting memory.</h2>

            <p>
              Capture the moment. Tell the story. Mount what matters.
              Preserve what lasts.
            </p>
          </div>

          <div className={styles.flowGrid}>
            <div className={styles.flowCard}>
              <span>01</span>
              <h3>Capture</h3>
              <p>Save the photos, notes, dates, places, and fishing memories.</p>
            </div>

            <div className={styles.flowCard}>
              <span>02</span>
              <h3>Wall</h3>
              <p>Your private space to organize and refine your fishing experiences.</p>
            </div>

            <div className={styles.flowCard}>
              <span>03</span>
              <h3>Mount</h3>
              <p>Choose the moments worthy of your public trophy wall.</p>
            </div>

            <div className={styles.flowCard}>
              <span>04</span>
              <h3>Vault</h3>
              <p>Preserve special angling moments with verification and legacy.</p>
            </div>
          </div>
        </div>
      </section>

      

      <section className={styles.previewSection}>
        <div className={styles.container}>
          <div className={styles.previewGrid}>
            <Link href="/collections" className={styles.previewCard}>
              <p className={styles.eyebrow}>COLLECTIONS</p>
              <h3>Collections built from time on the water.</h3>
              <p>
                Group angling experiences by trip, season, species, family
                memories, or the moments that define your time on the water.
              </p>
              <span>Explore Collections →</span>
            </Link>

            <Link href="/vault" className={styles.previewCard}>
              <p className={styles.eyebrow}>LIVEWELL VAULT</p>
              <h3>For the fishing moments that matter most.</h3>
              <p>
                Vault special fishing memories with a verification page,
                certificate-ready layout, and a stronger sense of permanence.
              </p>
              <span>View Vault →</span>
            </Link>

            <Link href="/news" className={styles.previewCard}>
              <p className={styles.eyebrow}>NEWS</p>
              <h3>Stories from the water.</h3>
              <p>
                Follow product updates, founder notes, featured stories,
                and community moments from ReelWall.
              </p>
              <span>Read News →</span>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.vaultSection}>
        <div className={styles.container}>
          <div className={styles.vaultPanel}>
            <div>
              <p className={styles.eyebrow}>BUILT FOR LEGACY</p>
              <h2>Not just another fishing feed.</h2>
              <p>
                ReelWall is built around stories, memories, and meaningful
                sharing — not clutter, noise, or endless scrolling.
              </p>
            </div>

            <Link href="/collections" className={styles.primaryButton}>
              Start Exploring
            </Link>
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
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}