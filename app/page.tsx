'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import styles from './page.module.css';

type CollectionItem = {
  id: string;
  title: string;
  description?: string | null;
  cover_image_url?: string | null;
  coverImageUri?: string | null;
  image_url?: string | null;
  created_at?: string | null;
  is_public?: boolean | null;
};

export default function HomePage() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreviewCollections();
  }, []);

  async function loadPreviewCollections() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.log('Home preview load error:', error);
        setCollections([]);
        return;
      }

      setCollections((data || []) as CollectionItem[]);
    } catch (error) {
      console.log('Home page error:', error);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  }

  function getCollectionCover(collection: CollectionItem) {
    return (
      collection.cover_image_url ||
      collection.coverImageUri ||
      collection.image_url ||
      '/logo.png'
    );
  }

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
              ReelWall is where your catches and stories become a legacy — preserved and shared.
            </p>

            <div className={styles.heroActions}>
              <Link href="/collections" className={styles.primaryButton}>
                Explore Public Collections
              </Link>
            </div>

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
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Featured</p>
            <h2 className={styles.sectionTitle}>
              Explore real catches from the ReelWall community
            </h2>
          </div>

          {loading ? (
            <div className={styles.stateCard}>
              <div className={styles.stateText}>Loading recent collections...</div>
            </div>
          ) : collections.length === 0 ? (
            <div className={styles.stateCard}>
              <div className={styles.stateText}>
                No public collections yet. They’ll appear here as soon as anglers start sharing.
              </div>
            </div>
          ) : (
            <div className={styles.previewStack}>
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.id}`}
                  className={styles.previewCard}
                >
                  <div className={styles.previewMedia}>
                    <img
                      src={getCollectionCover(collection)}
                      alt={collection.title}
                      className={styles.previewImage}
                    />
                    <div className={styles.previewOverlay} />
                  </div>

                  <div className={styles.previewBody}>
                    <p className={styles.previewEyebrow}>Public Collection</p>

                    <h3 className={styles.previewTitle}>{collection.title}</h3>

                    <p className={styles.previewText}>
                      {collection.description || 'Explore this public ReelWall collection.'}
                    </p>

                    <span className={styles.previewLink}>Open collection →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className={styles.sectionActions}>
            <Link href="/collections" className={styles.primaryButton}>
              See All Public Collections
            </Link>
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
              A digital trophy wall for anglers to preserve catches, collections,
              and the stories behind them.
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