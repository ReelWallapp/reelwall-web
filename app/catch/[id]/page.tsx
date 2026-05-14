'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import styles from './page.module.css';

export default function CatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const catchId = params?.id as string;

  const [catchItem, setCatchItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (!catchId) return;
    fetchCatch();
  }, [catchId]);

  const fetchCatch = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('catches')
        .select('*')
        .eq('id', catchId)
        .single();

      if (error) {
        console.log('Catch load error:', error);
        return;
      }

      setCatchItem(data);
    } catch (error) {
      console.log('Catch page error:', error);
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

  const shareCatch = async () => {
    try {
      const url = window.location.href;
      const title = catchItem?.place_name || 'ReelWall Moment';
      const text = catchItem?.note
        ? `${catchItem.note.slice(0, 140)}${
            catchItem.note.length > 140 ? '...' : ''
          }`
        : 'Check out this fishing memory on ReelWall.';

      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url,
        });

        return;
      }

      await copyToClipboard(url);
      setShareCopied(true);

      setTimeout(() => {
        setShareCopied(false);
      }, 2500);
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/collections');
    }
  };

  const getPublicImageUrl = (value?: string | null) => {
    if (!value) return '';

    if (value.startsWith('file://')) return '';

    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    if (value.startsWith('/')) return value;

    const cleanPath = value
      .replace(/^\/+/, '')
      .replace(/^catches\//, '')
      .replace(/^public\//, '');

    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catches/${cleanPath}`;
  };

  const formatDate = (value?: string | null) => {
    if (!value) return '';

    try {
      const date = new Date(value);

      if (Number.isNaN(date.getTime())) return value;

      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return value;
    }
  };

  const displayDate = catchItem?.catch_date || catchItem?.created_at || '';

  if (loading) {
    return (
      <main className={styles.page}>
        <section className={styles.centerState}>
          <div className={styles.stateCard}>
            <p className={styles.eyebrow}>REELWALL</p>
            <h1>Loading moment...</h1>
            <p>Pulling in the story from the water.</p>
          </div>
        </section>
      </main>
    );
  }

  if (!catchItem) {
    return (
      <main className={styles.page}>
        <section className={styles.centerState}>
          <div className={styles.stateCard}>
            <p className={styles.eyebrow}>REELWALL</p>
            <h1>Moment not found</h1>
            <p>This ReelWall moment could not be loaded.</p>

            <Link href="/collections" className={styles.primaryButton}>
              Explore Collections
            </Link>
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
            </div>
          </nav>

          <div className={styles.backRow}>
            <button
              type="button"
              onClick={handleBack}
              className={styles.backButton}
            >
              ← Back
            </button>
          </div>

          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>REELWALL MOMENT</p>

            <h1>Every fish has a story.</h1>

            <p className={styles.heroText}>
              A mounted fishing memory from ReelWall — captured, shared, and
              remembered.
            </p>

            <div className={styles.heroMeta}>
              {catchItem.is_personal_best ? (
                <span className={styles.goldPill}>Personal Best</span>
              ) : null}

              {displayDate ? <span>{formatDate(displayDate)}</span> : null}

              {catchItem.place_name ? <span>{catchItem.place_name}</span> : null}

              <button type="button" onClick={shareCatch}>
                {shareCopied ? 'Link Copied ✓' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.detailSection}>
        <div className={styles.container}>
          <div className={styles.detailPanel}>
            <div className={styles.imagePanel}>
              {catchItem.image_url ? (
                <img
                  src={getPublicImageUrl(catchItem.image_url)}
                  alt="ReelWall fishing memory"
                  className={styles.catchImage}
                  onError={(e) => {
                    e.currentTarget.src = '/logo.png';
                  }}
                />
              ) : (
                <div className={styles.noImage}>No image</div>
              )}
            </div>

            <div className={styles.contentGrid}>
              <aside className={styles.detailsColumn}>
                <p className={styles.sectionEyebrow}>Details</p>

                <div className={styles.detailCards}>
                  {catchItem.place_name ? (
                    <div className={styles.detailCard}>
                      <span>Location</span>
                      <strong>{catchItem.place_name}</strong>
                    </div>
                  ) : null}

                  {catchItem.region_name ? (
                    <div className={styles.detailCard}>
                      <span>Region</span>
                      <strong>{catchItem.region_name}</strong>
                    </div>
                  ) : null}

                  {displayDate ? (
                    <div className={styles.detailCard}>
                      <span>Date</span>
                      <strong>{formatDate(displayDate)}</strong>
                    </div>
                  ) : null}

                  {catchItem.is_personal_best ? (
                    <div className={styles.detailCard}>
                      <span>Badge</span>
                      <strong>Personal Best</strong>
                    </div>
                  ) : null}
                </div>
              </aside>

              <section className={styles.storyColumn}>
                <p className={styles.sectionEyebrow}>Story</p>

                <div className={styles.storyCard}>
                  {catchItem.note ? (
                    <p>{catchItem.note}</p>
                  ) : (
                    <p className={styles.emptyStory}>
                      No story added for this moment yet.
                    </p>
                  )}
                </div>

                <div className={styles.actions}>
                  <button
                    type="button"
                    onClick={shareCatch}
                    className={styles.primaryButton}
                  >
                    {shareCopied ? 'Link Copied ✓' : 'Share This Moment'}
                  </button>

                  <button
                    type="button"
                    onClick={handleBack}
                    className={styles.secondaryButton}
                  >
                    Back to Collection
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.footerBand}>
        <div className={styles.container}>
          <div className={styles.footerBandInner}>
            <p className={styles.eyebrow}>BUILT WITH REELWALL</p>

            <h2>Preserve the story, not just the photo.</h2>

            <p>
              ReelWall helps anglers capture, organize, mount, and preserve real
              moments from the water.
            </p>

            <div className={styles.footerActions}>
              <a
                href="https://apps.apple.com/ca/app/reelwall/id6763661886"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.appStoreBadge}
              >
                <img
                  src="/App_Store_Badge.svg"
                  alt="Download on the App Store"
                />
              </a>

              <Link href="/collections" className={styles.secondaryButton}>
                Explore Collections
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}