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

      const { data: collectionRows, error } = await supabase
        .from('collections')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const nextCollections = collectionRows || [];
      setCollections(nextCollections);

      const ids = nextCollections.map((c) => c.id);

      if (ids.length) {
        const { data: linkRows } = await supabase
          .from('collection_catches')
          .select('collection_id, catch_id')
          .in('collection_id', ids);

        setLinks(linkRows || []);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const catchCountByCollection = useMemo(() => {
    const map: Record<string, number> = {};
    links.forEach((l) => {
      map[l.collection_id] = (map[l.collection_id] || 0) + 1;
    });
    return map;
  }, [links]);

  const getCover = (c: CollectionItem) =>
    c.cover_image_url || c.coverImageUri || c.image_url || '/logo.png';

  const getCount = (id: string) => catchCountByCollection[id] || 0;

  const formatDate = (val?: string | null) => {
    if (!val) return '';
    return new Date(val).toLocaleDateString();
  };

  return (
    <main className={styles.page}>
      
      {/* 🔥 MINIMAL HEADER */}
      <section className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerRow}>
            
            <Link href="/" className={styles.logoInline}>
              <img src="/logo.png" alt="logo" />
            </Link>

            <div>
              <p className={styles.headerEyebrow}>Public Collections</p>
              <h1 className={styles.headerTitle}>Explore Collections</h1>
            </div>

          </div>
        </div>
      </section>

      {/* 🔥 COLLECTION GRID */}
      <section className={styles.section}>
        <div className={styles.container}>

          {errorMessage ? (
            <div className={styles.stateCard}>Error: {errorMessage}</div>
          ) : loading ? (
            <div className={styles.stateCard}>Loading collections...</div>
          ) : collections.length === 0 ? (
            <div className={styles.stateCard}>No collections yet</div>
          ) : (
            <div className={styles.grid}>
              {collections.map((c) => {
                const count = getCount(c.id);

                return (
                  <Link
                    key={c.id}
                    href={`/collections/${c.id}`}
                    className={styles.card}
                  >
                    <div className={styles.cardMedia}>
                      <img src={getCover(c)} alt={c.title} />
                      <div className={styles.cardOverlay} />

                      <div className={styles.badge}>
                        {count} {count === 1 ? 'catch' : 'catches'}
                      </div>
                    </div>

                    <div className={styles.cardBody}>
                      <h3>{c.title}</h3>
                      <p>
                        {c.description || 'Explore this ReelWall collection.'}
                      </p>

                      <div className={styles.cardFooter}>
                        <span>{formatDate(c.created_at)}</span>
                        <span>View →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}