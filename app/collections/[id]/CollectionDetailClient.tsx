'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
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

export default function CollectionDetailClient() {
  const params = useParams();
  const collectionId = params?.id as string;

  const [collection, setCollection] = useState<CollectionItem | null>(null);
  const [catches, setCatches] = useState<CatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);
  const [copiedCatchId, setCopiedCatchId] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrCopied, setQrCopied] = useState(false);

  const qrRef = useRef<HTMLDivElement | null>(null);

  const collectionUrl =
    typeof window !== 'undefined' ? window.location.href : '';

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
      const title = collection?.title || 'ReelWall Collection';
      const text = `Check out this ReelWall collection:\n\n${url}`;

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
      setTimeout(() => setShareCopied(false), 2500);
    } catch (error) {
      console.log('Share collection error:', error);
    }
  };

  const copyCollectionLink = async () => {
    try {
      await copyToClipboard(collectionUrl);
      setQrCopied(true);
      setTimeout(() => setQrCopied(false), 2500);
    } catch (error) {
      console.log('Copy QR link error:', error);
    }
  };

  const downloadQrCode = () => {
    try {
      const svg = qrRef.current?.querySelector('svg');
      if (!svg) return;

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const blob = new Blob([svgString], {
        type: 'image/svg+xml;charset=utf-8',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = `${collection?.title || 'reelwall-collection'}-qr.svg`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.log('Download QR error:', error);
    }
  };

  const printQrCode = () => {
    try {
      const svg = qrRef.current?.querySelector('svg');
      if (!svg) return;

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const printWindow = window.open('', '_blank');

      if (!printWindow) return;

      printWindow.document.write(`
        <html>
          <head>
            <title>ReelWall Collection QR</title>
            <style>
              body {
                margin: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: Arial, sans-serif;
                background: #ffffff;
                color: #081E33;
              }
              .card {
                text-align: center;
                padding: 32px;
              }
              h1 {
                margin: 0 0 8px;
                font-size: 28px;
              }
              p {
                margin: 8px 0 20px;
                font-size: 15px;
              }
              .qr {
                display: inline-block;
                padding: 18px;
                border: 1px solid #e5e7eb;
                border-radius: 18px;
              }
              .url {
                margin-top: 18px;
                font-size: 12px;
                color: #555;
                word-break: break-all;
              }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>${collection?.title || 'ReelWall Collection'}</h1>
              <p>Scan to view this ReelWall collection</p>
              <div class="qr">${svgString}</div>
              <div class="url">${collectionUrl}</div>
            </div>
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } catch (error) {
      console.log('Print QR error:', error);
    }
  };

  const shareCatch = async (item: CatchItem) => {
    try {
      const url = `${window.location.origin}/catch/${item.id}`;
      const title = item.place_name || 'ReelWall Catch';
      const noteText = item.note
        ? `${item.note.slice(0, 120)}${item.note.length > 120 ? '...' : ''}`
        : 'Check out this ReelWall catch.';

      const text = `${noteText}\n\n${url}`;

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

    const cleanPath = value
      .replace(/^\/+/, '')
      .replace(/^catches\//, '')
      .replace(/^public\//, '');

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

            <div
              style={{
                marginTop: 20,
                width: '100%',
                maxWidth: 460,
              }}
            >
              <button
                type="button"
                onClick={() => setQrOpen((current) => !current)}
                style={{
                  width: '100%',
                  border: '1px solid rgba(242, 201, 76, 0.18)',
                  background: 'rgba(8, 30, 51, 0.78)',
                  backdropFilter: 'blur(12px)',
                  color: '#F5F7FA',
                  borderRadius: 999,
                  padding: '16px 20px',
                  fontSize: 15,
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.16)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 999,
                      background: 'rgba(242, 201, 76, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#F2C94C',
                      fontSize: 16,
                      fontWeight: 900,
                    }}
                  >
                    QR
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 900,
                        lineHeight: 1,
                      }}
                    >
                      QR Share Card
                    </span>

                    <span
                      style={{
                        marginTop: 4,
                        color: '#8FA3B8',
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Download • Print • Share
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    color: '#F2C94C',
                    fontSize: 18,
                    fontWeight: 900,
                    lineHeight: 1,
                  }}
                >
                  {qrOpen ? '−' : '+'}
                </span>
              </button>

              {qrOpen ? (
                <div
                  style={{
                    marginTop: 14,
                    border: '1px solid rgba(242, 201, 76, 0.2)',
                    background:
                      'linear-gradient(180deg, rgba(13, 41, 67, 0.98), rgba(8, 30, 51, 0.98))',
                    borderRadius: 28,
                    padding: 20,
                    boxShadow: '0 18px 42px rgba(0,0,0,0.24)',
                    textAlign: 'center',
                  }}
                >
                  <div
                    ref={qrRef}
                    style={{
                      background: '#ffffff',
                      color: '#081E33',
                      borderRadius: 24,
                      padding: 20,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: '#081E33',
                        fontSize: 11,
                        fontWeight: 900,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                      }}
                    >
                      ReelWall Collection
                    </p>

                    <h3
                      style={{
                        margin: '8px 0 16px',
                        color: '#081E33',
                        fontSize: 22,
                        lineHeight: 1.08,
                        fontWeight: 900,
                      }}
                    >
                      {collection.title}
                    </h3>

                    <div
                      style={{
                        display: 'inline-flex',
                        background: '#ffffff',
                        padding: 10,
                        borderRadius: 18,
                        border: '1px solid #E5E7EB',
                      }}
                    >
                      <QRCode value={collectionUrl} size={160} />
                    </div>

                    <p
                      style={{
                        margin: '14px 0 0',
                        color: '#334155',
                        fontSize: 13,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Scan to view this ReelWall collection
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      gap: 10,
                      marginTop: 14,
                    }}
                  >
                    <button
                      type="button"
                      onClick={copyCollectionLink}
                      style={{
                        border: '1px solid rgba(242, 201, 76, 0.3)',
                        background: 'rgba(8, 30, 51, 0.72)',
                        color: '#F2C94C',
                        borderRadius: 999,
                        padding: '10px 14px',
                        fontSize: 13,
                        fontWeight: 900,
                        cursor: 'pointer',
                      }}
                    >
                      {qrCopied ? 'Copied ✓' : 'Copy Link'}
                    </button>

                    <button
                      type="button"
                      onClick={downloadQrCode}
                      style={{
                        border: 0,
                        background: '#F2C94C',
                        color: '#081E33',
                        borderRadius: 999,
                        padding: '10px 14px',
                        fontSize: 13,
                        fontWeight: 900,
                        cursor: 'pointer',
                      }}
                    >
                      Download QR
                    </button>

                    <button
                      type="button"
                      onClick={printQrCode}
                      style={{
                        border: '1px solid rgba(255,255,255,0.14)',
                        background: 'rgba(255,255,255,0.08)',
                        color: '#F5F7FA',
                        borderRadius: 999,
                        padding: '10px 14px',
                        fontSize: 13,
                        fontWeight: 900,
                        cursor: 'pointer',
                      }}
                    >
                      Print
                    </button>
                  </div>
                </div>
              ) : null}
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