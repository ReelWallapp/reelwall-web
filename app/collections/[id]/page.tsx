import type { Metadata } from 'next';
import CollectionDetailClient from './CollectionDetailClient';
import { supabase } from '../../../lib/supabase';

type PageProps = {
  params: {
    id: string;
  };
};

const SITE_URL = 'https://reelwall.app';

const getPublicImageUrl = (value?: string | null) => {
  if (!value) return '';

  if (value.startsWith('file://')) return '';

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  const cleanPath = value
  .replace(/^\/+/, '')
  .replace(/^collections\//, '')
  .replace(/^public\//, '');

return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/collections/${cleanPath}`;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const collectionId = params.id;

  const { data: collection } = await supabase
    .from('collections')
    .select('*')
    .eq('id', collectionId)
    .single();

  let coverImage = getPublicImageUrl(
  collection?.cover_image ||
    collection?.cover_image_url ||
    collection?.coverImageUri ||
    collection?.image_url
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

  const title = collection?.title
    ? `${collection.title} | ReelWall Collection`
    : 'ReelWall Collection';

  const description =
    collection?.description ||
    'A fishing memory collection shared from ReelWall.';

  const image = coverImage || `${SITE_URL}/logo.png`;
  const url = `${SITE_URL}/collections/${collectionId}`;

  return {
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