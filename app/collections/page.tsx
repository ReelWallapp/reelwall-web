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
    } catch (error: any) {
      console.log('Collections page load error:', error);
      setCollections([]);
      setLinks([]);
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

  const getCollectionCover = (collection: CollectionItem) => {
    return (
      collection.cover_image_url ||
      collection.coverImageUri ||
      collection.image_url ||
      '/logo.png'
    );
  };

  const getCollectionCount = (collectionId: string) => {
    return catchCountByCollection[collectionId] || 0;
  };

  const formatDate = (value?: string | null) => {
    if (!value) return '';

    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return '';
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.heroCompact}>
        <div className={styles.container}>
          <div className={styles.heroCompactInner}>
            <Link href="/" className={styles.logoWrap}>
              <img
                src="/logo.png"
                alt="ReelWall logo"
                className={styles.logo}
              />
            </Link>

            <p className={styles.eyebrow}>REELWALL PUBLIC COLLECTIONS</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Collections</p>
            <h2 className={styles.sectionTitle}>All Public Collections</h2>
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
                      />
                      <div className={styles.cardOverlay} />
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.cardTopMeta}>
                        <span className={styles.cardMetaPill}>
                          {count} {count === 1 ? 'catch' : 'catches'}
                        </span>

                        {formatDate(collection.created_at) ? (
                          <span className={styles.cardDate}>
                            {formatDate(collection.created_at)}
                          </span>
                        ) : null}
                      </div>

                      <h3 className={styles.cardTitle}>{collection.title}</h3>

                      <p className={styles.cardDescription}>
                        {collection.description ||
                          'A public ReelWall collection ready to explore.'}
                      </p>

                      <div className={styles.cardFooter}>
                        <span className={styles.cardMeta}>Open collection</span>
                        <span className={styles.cardLink}>View →</span>
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
              ReelWall helps anglers capture, organize, and showcase their best
              catches as a digital trophy wall.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
  