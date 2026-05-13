import type { Metadata } from 'next';
import CollectionDetailClient from './CollectionDetailClient';
import { supabase } from '../../../lib/supabase';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SITE_URL = 'https://reelwall.app';
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lkoiruiyweqhprkelopj.supabase.co';

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

  return `${SUPABASE_URL}/storage/v1/object/public/catches/${cleanPath}`;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id: collectionId } = await params;

  const { data: collection } = await supabase
    .from('collections')
    .select('*')
    .eq('id', collectionId)
    .single();

  const collectionAny = collection as any;

  let profileName = '';

  if (collectionAny?.user_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, username, avatar_url')
      .eq('id', collectionAny.user_id)
      .single();

    profileName = profile?.display_name || profile?.username || '';
  }

  let coverImage = getPublicImageUrl(
    collectionAny?.cover_image_url ||
      collectionAny?.cover_image ||
      collectionAny?.coverImageUri ||
      collectionAny?.image_url
  );

  if (!coverImage) {
    const { data: links } = await supabase
      .from('collection_catches')
      .select('catch_id')
      .eq('collection_id', collectionId);

    const catchIds = (links || []).map((link) => link.catch_id);

    if (catchIds.length > 0) {
      const { data: catchRows } = await supabase
        .from('catches')
        .select('image_url')
        .in('id', catchIds);

      const firstImageCatch = (catchRows || []).find((item) => item.image_url);

      coverImage = getPublicImageUrl(firstImageCatch?.image_url);
    }
  }

  const title = collectionAny?.title
    ? `${collectionAny.title} | ReelWall Collection`
    : 'ReelWall Collection';

  const description =
    collectionAny?.description ||
    (profileName
      ? `A fishing memory collection shared by ${profileName} on ReelWall.`
      : 'A fishing memory collection shared from ReelWall.');

  const image = coverImage || `${SITE_URL}/logo.png`;
  const url = `${SITE_URL}/collections/${collectionId}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'ReelWall',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default function Page() {
  return <CollectionDetailClient />;
}