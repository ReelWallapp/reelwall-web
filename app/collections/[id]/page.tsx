'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import styles from './page.module.css';

type CollectionItem = {
  id: string;
  title: string;
  description?: string | null;
  is_public?: boolean | null;
  created_at?: string | null;
};

type CatchItem = {
  id: string;
  image_url?: string | null;
  created_at?: string | null;
  catch_date?: string | null;
  place_name?: string | null;
  note?: string | null;
};

export default function CollectionDetailPage() {
  const params = useParams();
  const collectionId = params?.id as string;

  const [collection, setCollection] = useState<CollectionItem | null>(null);
  const [catches, setCatches] = useState<CatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);
  const [copiedCatchId, setCopiedCatchId] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionId) return;
    fetchCollection();
  }, [collectionId]);

  const fetchCollection = async () => {
    try {
      setLoading(true);

      const { data: collectionData, error: collectionError } = await supabase
        .from('collections')
        .select('*')
        .eq('id', collectionId)
        .single();

      if (collectionError) throw collectionError;

      setCollection(collectionData as CollectionItem);

      const { data: links, error: linksError } = await supabase
        .from('collection_catches')
        .select('catch_id')
        .eq('collection_id', collectionId);

      if (linksError) throw linksError;

      if (!links || links.length === 0) {
        setCatches([]);
        return;
      }

      const catchIds = links.map((link) => link.catch_id);

      const { data: catchesData, error: catchesError } = await supabase
        .from('catches')
        .select('id, image_url, created_at, catch_date, place_name, note')
        .in('id', catchIds)
        .order('created_at', { ascending: false });

      if (catchesError) throw catchesError;

      setCatches((catchesData || []) as CatchItem[]);
    } catch (error) {
      console.log('Collection detail load error:', error);
      setCollection(null);
      setCatches([]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (url: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
  };

  const shareCollection = async () => {
    try {
      const url = window.location.href;

      if (navigator.share) {
        await navigator.share({
          title: collection?.title || 'ReelWall Collection',
          text: 'Check out this ReelWall collection.',
          url,
        });
        return;
      }

      await copyToClipboard(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch (error) {
      console.log('Share collection error:', error);
    }
  };

  const shareCatch = async (item: CatchItem) => {
    try {
      const url = `${window.location.origin}/catch/${item.id}`;
      const title = item.place_name || 'ReelWall Catch';
      const text = item.note
        ? `${item.note.slice(0, 120)}${item.note.length > 120 ? '...' : ''}`
        : 'Check out this ReelWall catch.';

      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url,
        });
        return;
      }

      await copyToClipboard(url);
      setCopiedCatchId(item.id);
      setTimeout(() => setCopiedCatchId(null), 2500);
    } catch (error) {
      console.log('Share catch error:', error);
    }
  };

  const getPublicImageUrl = (value?: string | null) => {
    if (!value) return '';

    if (value.startsWith('file://')) return '';

    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    const cleanPath = value.replace(/^\/+/, '').replace(/^catches\//, '');

    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catches/${cleanPath}`;
  };

  const getCatchDisplayDate = (item?: CatchItem | null) => {
    if (!item) return '';
    return item.catch_date || item.created_at || '';
  };

  const formatDate = (value?: string | null) => {
    if (!value) return '';

    try {
      const d = new Date(value);

      if (Number.isNaN(d.getTime())) {
        return value;
      }

      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return value;
    }
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <section className={styles.stateWrap}>
          <div className={styles.stateCard}>
            <p className={styles.stateEyebrow}>REELWALL COLLECTION</p>
            <h1 className={styles.stateTitle}>Loading collection...</h1>
            <p className={styles.stateText}>
              Pulling in the catches and story for this collection.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (!collection) {
    return (
      <main className={styles.page}>
        <section className={styles.stateWrap}>
          <div className={styles.stateCard}>
            <p className={styles.stateEyebrow}>REELWALL COLLECTION</p>
            <h1 className={styles.stateTitle}>Collection not found</h1>
            <p className={styles.stateText}>
              This collection could not be loaded.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGlowOne} />
        <div className={styles.heroGlowTwo} />

        <div className={styles.container}>
          <div className={styles.heroInner}>
            <Link href="/collections" className={styles.backLink}>
              ← Back to Collections
            </Link>

            <p className={styles.eyebrow}>REELWALL COLLECTION</p>

            <h1 className={styles.heroTitle}>{collection.title}</h1>

            <p className={styles.heroText}>
              {collection.description ||
                'A digital trophy wall collection from ReelWall.'}
            </p>

            <div className={styles.heroPills}>
              <div className={styles.heroPill}>
                <span className={styles.heroPillNumber}>{catches.length}</span>
                <span className={styles.heroPillLabel}>
                  {catches.length === 1 ? 'catch' : 'catches'}
                </span>
              </div>

              <div className={styles.heroPill}>
                <span className={styles.heroPillNumber}>
                  {collection.is_public === false ? 'Private' : 'Public'}
                </span>
                <span className={styles.heroPillLabel}>visibility</span>
              </div>

              {formatDate(collection.created_at) ? (
                <div className={styles.heroPill}>
                  <span className={styles.heroPillNumber}>
                    {formatDate(collection.created_at)}
                  </span>
                  <span className={styles.heroPillLabel}>created</span>
                </div>
              ) : null}
            </div>

            <div className={styles.heroActions}>
              <button
                type="button"
                onClick={shareCollection}
                className={styles.primaryButton}
              >
                {shareCopied ? 'Link Copied ✓' : 'Share Collection'}
              </button>

              <Link href="/collections" className={styles.secondaryButton}>
                Browse More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Collection Catches</p>

            <h2 className={styles.sectionTitle}>
              {catches.length === 0 ? 'No catches yet' : 'Collection Catches'}
            </h2>

            <p className={styles.sectionText}>
              {catches.length === 0
                ? 'This collection does not have any catches to show yet.'
                : 'Open a catch to view the full story and details.'}
            </p>
          </div>

          {catches.length === 0 ? (
            <div className={styles.emptyCard}>
              <div className={styles.emptyTitle}>No catches yet</div>
              <div className={styles.emptyText}>
                This collection does not have any catches to show.
              </div>
            </div>
          ) : (
            <div className={styles.grid}>
              {catches.map((c) => {
                const displayDate = formatDate(getCatchDisplayDate(c));
                const catchCopied = copiedCatchId === c.id;

                return (
                  <article key={c.id} className={styles.card}>
                    <Link href={`/catch/${c.id}`} className={styles.cardImageLink}>
                      {c.image_url ? (
                        <div className={styles.cardMedia}>
                          <img
                            src={getPublicImageUrl(c.image_url)}
                            alt="Catch"
                            className={styles.cardImage}
                            onError={(e) => {
                              e.currentTarget.src = '/logo.png';
                            }}
                          />
                          <div className={styles.cardOverlay} />
                        </div>
                      ) : (
                        <div className={styles.cardFallback}>No image</div>
                      )}
                    </Link>

                    <div className={styles.cardBody}>
                      <div className={styles.cardTopMeta}>
                        {displayDate ? (
                          <span className={styles.cardMeta}>{displayDate}</span>
                        ) : null}
                      </div>

                      <h3 className={styles.cardTitle}>
                        {c.place_name || 'ReelWall Catch'}
                      </h3>

                      <p className={styles.cardDescription}>
                        {c.note || 'No note added.'}
                      </p>

                      <div className={styles.cardFooter}>
                        <Link href={`/catch/${c.id}`} className={styles.cardLink}>
                          View →
                        </Link>

                        <button
                          type="button"
                          onClick={() => shareCatch(c)}
                          className={styles.shareButton}
                        >
                          {catchCopied ? 'Copied ✓' : 'Share'}
                        </button>
                      </div>
                    </div>
                  </article>
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