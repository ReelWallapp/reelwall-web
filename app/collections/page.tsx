'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
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

type CollectionCatchLink = {
  collection_id: string;
  catch_id: string;
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [links, setLinks] = useState<CollectionCatchLink[]>([]);
  const [catches, setCatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const { data: collectionRows, error: collectionError } = await supabase
        .from('collections')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (collectionError) throw collectionError;

      const nextCollections = (collectionRows || []) as CollectionItem[];
      setCollections(nextCollections);

      const collectionIds = nextCollections.map((item) => item.id);

      if (collectionIds.length > 0) {
        const { data: linkRows, error: linkError } = await supabase
          .from('collection_catches')
          .select('collection_id, catch_id')
          .in('collection_id', collectionIds);

        if (linkError) {
          console.log('Collection links load error:', linkError);
          setLinks([]);
        } else {
          setLinks((linkRows || []) as CollectionCatchLink[]);
        }
      } else {
        setLinks([]);
      }

      const { data: catchRows, error: catchError } = await supabase
        .from('catches')
        .select('id, image_url');

      if (catchError) {
        console.log('Catches load error:', catchError);
        setCatches([]);
      } else {
        setCatches(catchRows || []);
      }
    } catch (error: any) {
      console.log('Collections page load error:', error);
      setCollections([]);
      setLinks([]);
      setCatches([]);
      setErrorMessage(error?.message || 'Could not load collections');
    } finally {
      setLoading(false);
    }
  };

  const catchCountByCollection = useMemo(() => {
    const map: Record<string, number> = {};

    for (const link of links) {
      map[link.collection_id] = (map[link.collection_id] || 0) + 1;
    }

    return map;
  }, [links]);

  const catchesById = useMemo(() => {
    const map: Record<string, any> = {};

    catches.forEach((c) => {
      map[c.id] = c;
    });

    return map;
  }, [catches]);

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

  const getCollectionCover = (collection: CollectionItem) => {
    const linked = links
      .filter((l) => l.collection_id === collection.id)
      .map((l) => catchesById[l.catch_id])
      .filter(Boolean);

    const candidates = [
      collection.cover_image_url,
      collection.coverImageUri,
      collection.image_url,
      ...linked.map((item) => item.image_url),
    ];

    for (const value of candidates) {
      const url = getPublicImageUrl(value);
      if (url) return url;
    }

    return '/logo.png';
  };

  const getCollectionCount = (collectionId: string) => {
    return catchCountByCollection[collectionId] || 0;
  };

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
              <Link href="/">Home</Link>
              <Link href="/vault">Vault</Link>
              <Link href="/news">News</Link>
            </div>
          </nav>

          <div className={styles.heroInner}>
            <div className={styles.heroLogoWrap}>
              <img src="/logo.png" alt="ReelWall logo" className={styles.heroLogo} />
            </div>

            <p className={styles.eyebrow}>REELWALL PUBLIC COLLECTIONS</p>

            <h1 className={styles.heroTitle}>Curated fishing story walls.</h1>

            <p className={styles.heroText}>
              Explore public ReelWall collections built around trips, seasons,
              species, family memories, and the catches that deserve to be remembered.
            </p>

            <div className={styles.heroPills}>
              <span>🗂️ Collections</span>
              <span>🎣 Stories</span>
              <span>🏆 Mounted moments</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
  <div>
    <p className={styles.sectionEyebrow}>Collections</p>
    <h2 className={styles.sectionTitle}>All Public Collections</h2>
  </div>
</div>




          {errorMessage ? (
            <div className={styles.stateCard}>
              <div className={styles.stateTitle}>Could not load collections</div>
              <div className={styles.stateText}>{errorMessage}</div>
            </div>
          ) : loading ? (
            <div className={styles.stateCard}>
              <div className={styles.stateTitle}>Loading collections...</div>
              <div className={styles.stateText}>
                Pulling in public collections from ReelWall.
              </div>
            </div>
          ) : collections.length === 0 ? (
            <div className={styles.stateCard}>
              <div className={styles.stateTitle}>No collections yet</div>
              <div className={styles.stateText}>
                Public collections will appear here once they are available.
              </div>
            </div>
          ) : (
            <div className={styles.grid}>
              {collections.map((collection) => {
                const count = getCollectionCount(collection.id);

                return (
                  <Link
                    key={collection.id}
                    href={`/collections/${collection.id}`}
                    className={styles.card}
                  >
                    <div className={styles.cardMedia}>
                      <img
                        src={getCollectionCover(collection)}
                        alt={collection.title}
                        className={styles.cardImage}
                        onError={(e) => {
                          e.currentTarget.src = '/logo.png';
                        }}
                      />

                      <div className={styles.cardOverlay} />

                      <span className={styles.cardFloatingPill}>
                        {count} {count === 1 ? 'catch' : 'catches'}
                      </span>
                    </div>

                    <div className={styles.cardBody}>
                      <p className={styles.cardEyebrow}>Public Collection</p>

                      <h3 className={styles.cardTitle}>{collection.title}</h3>

                      <p className={styles.cardDescription}>
                        {collection.description ||
                          'A public ReelWall collection ready to explore.'}
                      </p>

                      <div className={styles.cardFooter}>
                        <span>Open collection</span>
                        <strong>View →</strong>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className={styles.footerBand}>
        <div className={styles.container}>
          <div className={styles.footerBandInner}>
            <p className={styles.footerEyebrow}>BUILT WITH REELWALL</p>
            <h3 className={styles.footerTitle}>Every Fish Has a Story</h3>
            <p className={styles.footerText}>
              ReelWall helps anglers capture, organize, mount, and preserve their
              best catches as a digital trophy wall.
            </p>

            <div className={styles.footerActions}>
              <Link href="/" className={styles.footerButton}>
                Back Home
              </Link>

              <Link href="/vault" className={styles.footerButtonSecondary}>
                Explore Vault
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}