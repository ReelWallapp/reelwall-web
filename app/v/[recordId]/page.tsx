import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';

const PRIMARY = '#F2C94C';

type PageProps = {
  params: Promise<{
    recordId: string;
  }>;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function formatDate(value?: string | null) {
  if (!value) return 'Not provided';

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return d.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getPublicImageUrl(value?: string | null) {
  if (!value) return '';

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  const cleanPath = value.replace(/^\/+/, '').replace(/^catches\//, '');

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catches/${cleanPath}`;
}

export default async function VaultVerificationPage({ params }: PageProps) {
  const { recordId } = await params;
  const { data: record, error } = await supabase
    .from('vault_records')
    .select('*')
    .eq('id', recordId)
    .single();

  if (error || !record) {
    return (
      <main style={styles.page}>
        <div style={styles.centerCard}>
          <h1 style={styles.title}>Record not found</h1>
          <p style={styles.muted}>This Vault record could not be verified.</p>
        </div>
      </main>
    );
  }

  const imageUrl =
  record.arweave_image_url ||
  getPublicImageUrl(record.image_url);
  const location = record.place_name || record.region_name || 'Location private';
  const catchDate = record.catch_date || 'Catch date not provided';
  const preservedDate = record.created_at ? formatDate(record.created_at) : 'Date preserved';
  const story = record.story?.trim() || 'A catch worth preserving.';

  const isSecured =
    record.vault_status === 'secured' ||
    record.mint_status === 'minted';

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.brandPill}>✓ LIVEWELL VAULT</div>

        <h1 style={styles.heroTitle}>Verified Record</h1>

        <p style={styles.heroText}>
          A permanent catch record secured through LiveWell Vault.
        </p>

        <div style={styles.statusPill}>
          {isSecured ? '✓ Verified Record' : 'Securing Record'}
        </div>
      </section>

      <section style={styles.goldFrame}>
        <div style={styles.card}>
          <div style={styles.certTopRow}>
            <span style={styles.certEyebrow}>Certificate of Record</span>
            <span style={styles.certSeal}>VAULT</span>
          </div>

          <div style={styles.imageFrame}>
            {imageUrl ? (
              <img src={imageUrl} alt="Preserved catch" style={styles.image} />
            ) : (
              <div style={styles.noImage}>No image</div>
            )}
          </div>

          <h2 style={styles.recordTitle}>Preserved Catch</h2>
          <p style={styles.recordDate}>Preserved {preservedDate}</p>

          <div style={styles.divider} />

          <div style={styles.storyBox}>
            <p style={styles.label}>The Story</p>
            <p style={styles.story}>{story}</p>
          </div>

          <div style={styles.grid}>
            <div style={styles.detailBox}>
              <p style={styles.label}>Catch Date</p>
              <p style={styles.value}>{catchDate}</p>
            </div>

            <div style={styles.detailBox}>
              <p style={styles.label}>Location</p>
              <p style={styles.value}>{location}</p>
            </div>
          </div>

          <div style={styles.detailBox}>
            <p style={styles.label}>Record ID</p>
            <p style={styles.valueSmall}>{record.id}</p>
          </div>

          <div style={styles.permanentBox}>
            <p style={styles.permanentTitle}>Permanent • Verified</p>
            <p style={styles.permanentText}>
              This record represents the catch as it was preserved in LiveWell Vault.
            </p>
          </div>
        </div>
      </section>

      

      <p style={styles.footer}>Verified by LiveWell Vault</p>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background:
      'radial-gradient(circle at top left, rgba(28,70,108,0.45), transparent 30%), radial-gradient(circle at right 30%, rgba(242,201,76,0.14), transparent 28%), #081E33',
    color: '#F5F7FA',
    padding: '28px 18px 52px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  centerCard: {
    maxWidth: 520,
    margin: '100px auto',
    background: '#102C47',
    border: '1px solid rgba(242,201,76,0.25)',
    borderRadius: 24,
    padding: 28,
    textAlign: 'center',
  },
  hero: {
    maxWidth: 720,
    margin: '0 auto 22px',
  },
  brandPill: {
    display: 'inline-block',
    color: PRIMARY,
    background: 'rgba(242,201,76,0.1)',
    border: '1px solid rgba(242,201,76,0.28)',
    borderRadius: 999,
    padding: '8px 12px',
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 1.4,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 42,
    lineHeight: 1,
    margin: '0 0 10px',
    fontWeight: 900,
    letterSpacing: -0.8,
  },
  heroText: {
    color: '#A5B3C2',
    fontSize: 16,
    lineHeight: 1.5,
    margin: '0 0 16px',
    maxWidth: 460,
    fontWeight: 700,
  },

proofButton: {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#163554',
  color: '#F2C94C',
  border: '1px solid rgba(242,201,76,0.28)',
  borderRadius: 999,
  padding: '12px 16px',
  fontSize: 13,
  fontWeight: 900,
  textDecoration: 'none',
},

  statusPill: {
    display: 'inline-block',
    color: PRIMARY,
    background: 'rgba(242,201,76,0.14)',
    border: '1px solid rgba(242,201,76,0.42)',
    borderRadius: 999,
    padding: '9px 13px',
    fontSize: 13,
    fontWeight: 900,
  },
  goldFrame: {
    maxWidth: 720,
    margin: '0 auto',
    borderRadius: 30,
    padding: 4,
    background: 'rgba(242,201,76,0.16)',
    border: '1px solid rgba(242,201,76,0.45)',
    boxShadow: '0 0 28px rgba(242,201,76,0.18)',
  },
  card: {
    background: '#102C47',
    borderRadius: 26,
    padding: 18,
    border: '1px solid rgba(242,201,76,0.28)',
  },
  certTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  certEyebrow: {
    color: PRIMARY,
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  certSeal: {
    color: '#081E33',
    background: PRIMARY,
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: 1,
    borderRadius: 999,
    padding: '6px 10px',
  },
  imageFrame: {
    height: 420,
    background: '#081E33',
    borderRadius: 22,
    border: '1px solid rgba(242,201,76,0.45)',
    overflow: 'hidden',
    marginBottom: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  noImage: {
    color: '#A5B3C2',
    fontWeight: 800,
  },
  recordTitle: {
    color: '#F5F7FA',
    fontSize: 30,
    fontWeight: 900,
    letterSpacing: -0.3,
    margin: '0 0 5px',
  },
  recordDate: {
    color: PRIMARY,
    fontSize: 15,
    fontWeight: 800,
    margin: 0,
  },
  divider: {
    width: 52,
    height: 3,
    borderRadius: 999,
    background: PRIMARY,
    margin: '16px 0',
  },
  storyBox: {
    background: 'rgba(242,201,76,0.08)',
    borderRadius: 18,
    padding: 14,
    border: '1px solid rgba(242,201,76,0.14)',
    marginBottom: 12,
  },
  label: {
    color: PRIMARY,
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: 1,
    textTransform: 'uppercase',
    margin: '0 0 6px',
  },
  story: {
    color: '#F5F7FA',
    fontSize: 15,
    lineHeight: 1.55,
    fontWeight: 700,
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 10,
    marginBottom: 10,
  },
  detailBox: {
    background: '#081E33',
    borderRadius: 16,
    padding: 13,
    border: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 10,
  },
  value: {
    color: '#F5F7FA',
    fontSize: 14,
    fontWeight: 800,
    lineHeight: 1.35,
    margin: 0,
  },
  valueSmall: {
    color: '#F5F7FA',
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.4,
    wordBreak: 'break-all',
    margin: 0,
  },
  permanentBox: {
    background: 'rgba(242,201,76,0.1)',
    borderRadius: 18,
    padding: 14,
    border: '1px solid rgba(242,201,76,0.18)',
    marginTop: 4,
  },
  permanentTitle: {
    color: '#F5F7FA',
    fontSize: 15,
    fontWeight: 900,
    margin: '0 0 5px',
  },
  permanentText: {
    color: '#A5B3C2',
    fontSize: 13,
    lineHeight: 1.45,
    fontWeight: 700,
    margin: 0,
  },
  footer: {
    color: '#A5B3C2',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 18,
  },
  muted: {
    color: '#A5B3C2',
  },
  title: {
    color: '#F5F7FA',
  },
};