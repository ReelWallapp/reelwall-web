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
  .replace(/^public\//, ''); // ✅ REMOVE WRONG FOLDER
  

  console.log('SUPABASE URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('IMAGE PATH:', cleanPath);

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
  onError={(e) => {
    console.log('FAILED IMAGE URL:', e.currentTarget.src); // 👈 ADD THIS
    e.currentTarget.src = '/logo.png';
  }}
/>
  <div className={styles.cardOverlay} />
</div>

<div className={styles.cardBody}>
  <div className={styles.cardTopMeta}>
    <span className={styles.cardMetaPill}>
      {count} {count === 1 ? 'catch' : 'catches'}
    </span>
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
              ReelWall helps anglers capture, organize & showcase their best
              catches as a digital trophy wall.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
  