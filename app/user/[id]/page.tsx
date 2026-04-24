'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

type CollectionItem = {
  id: string;
  title: string;
  description?: string | null;
  cover_image_url?: string | null;
  coverImageUri?: string | null;
  image_url?: string | null;
  is_public?: boolean | null;
  created_at?: string | null;
  catch_count?: number | null;
  user_id?: string | null;
  user_name?: string | null;
  user_avatar_url?: string | null;
};

type ProfileMap = Record<
  string,
  {
    name?: string | null;
    avatar_url?: string | null;
    profile_image_url?: string | null;
    profile_photo_url?: string | null;
  }
>;

export default function HomePage() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [profiles, setProfiles] = useState<ProfileMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Home collections load error:', error);
        setCollections([]);
        return;
      }

      const collectionRows = (data || []) as CollectionItem[];
      setCollections(collectionRows);

      const userIds = Array.from(
        new Set(collectionRows.map((c) => c.user_id).filter(Boolean))
      ) as string[];

      if (userIds.length > 0) {
        const { data: profileRows, error: profileError } = await supabase
          .from('Profiles')
          .select('*')
          .in('id', userIds);

        if (profileError) {
          console.log('Profile load error:', profileError);
        } else if (profileRows) {
          const nextProfiles: ProfileMap = {};

          for (const row of profileRows as any[]) {
            nextProfiles[row.id] = {
              name: row.name || row.display_name || row.username || null,
              avatar_url:
                row.avatar_url ||
                row.profile_image_url ||
                row.profile_photo_url ||
                null,
              profile_image_url: row.profile_image_url || null,
              profile_photo_url: row.profile_photo_url || null,
            };
          }

          setProfiles(nextProfiles);
        }
      }
    } catch (error) {
      console.log('Home page error:', error);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  const recentCollections = collections.slice(0, 3);
  const moreCollections = collections.slice(3);

  const getCoverImage = (collection: CollectionItem) => {
    return (
      collection.cover_image_url ||
      collection.coverImageUri ||
      collection.image_url ||
      null
    );
  };

  const getProfileName = (collection: CollectionItem) => {
    const profile = collection.user_id ? profiles[collection.user_id] : undefined;
    return collection.user_name || profile?.name || 'ReelWall Angler';
  };

  const getInitial = (name: string) => {
    return name.trim().charAt(0).toUpperCase() || 'R';
  };

  const getCatchCount = (collection: CollectionItem) => {
    if (typeof collection.catch_count === 'number') return collection.catch_count;
    return null;
  };

  const renderCollectionCard = (collection: CollectionItem) => {
    const cover = getCoverImage(collection);
    const name = getProfileName(collection);
    const catchCount = getCatchCount(collection);

    return (
      <Link
        key={collection.id}
        href={`/collections/${collection.id}`}
        className="group block overflow-hidden rounded-2xl border border-[#2A5D93] bg-[#0B2239] transition hover:-translate-y-0.5 hover:border-[#F2C94C]"
      >
        <div className="relative h-[150px] w-full overflow-hidden bg-[#12314F] sm:h-[165px]">
          {cover ? (
            <img
              src={cover}
              alt={collection.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#102C47]">
              <img
                src="/logo.png"
                alt="ReelWall"
                className="h-12 w-12 object-contain opacity-90"
              />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        </div>

        <div className="p-3">
          <p className="line-clamp-1 text-[11px] font-bold text-[#F2C94C]">
            {name}
          </p>

          <h3 className="mt-1 line-clamp-1 text-lg font-extrabold text-white">
            {collection.title}
          </h3>

          <p className="mt-1 line-clamp-1 text-sm text-gray-300">
            {collection.description || 'Public collection'}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="rounded-full bg-[#123B6A] px-2.5 py-1 text-[11px] font-bold text-white">
              {catchCount !== null
                ? `${catchCount} ${catchCount === 1 ? 'catch' : 'catches'}`
                : 'Public'}
            </span>

            <span className="text-sm font-bold text-[#F2C94C]">
              View →
            </span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <main className="min-h-screen bg-[#081E33] text-white">
      <section className="border-b border-[#163554] bg-gradient-to-b from-[#0A2238] to-[#081E33]">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-[#163554] bg-[#0B2239] shadow-lg">
              <img
                src="/logo.png"
                alt="ReelWall logo"
                className="h-10 w-10 object-contain"
              />
            </div>

            <p className="mb-3 text-xs font-bold tracking-[0.22em] text-[#F2C94C]">
              DIGITAL TROPHY WALL
            </p>

            <h1 className="mb-4 max-w-4xl text-4xl font-extrabold leading-tight md:text-5xl">
              Save the Catch. Keep the Story.
            </h1>

            <p className="mx-auto mb-6 max-w-2xl text-base leading-7 text-gray-300">
              ReelWall helps anglers capture, organize, and share meaningful catches
              through collections, stories, and trophy walls.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/collections"
                className="rounded-full bg-[#F2C94C] px-5 py-2.5 text-sm font-extrabold text-[#0A2540] transition hover:opacity-90"
              >
                View Collections
              </Link>

              <Link
                href="/collections"
                className="rounded-full border border-[#163554] bg-[#0B2239] px-5 py-2.5 text-sm font-bold text-white transition hover:border-[#F2C94C]"
              >
                Explore Public Walls
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-5">
          <p className="mb-2 text-xs font-bold tracking-[0.22em] text-[#F2C94C]">
            RECENT
          </p>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Recent Collections
          </h2>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#163554] bg-[#0B2239] p-6 text-gray-300">
            Loading collections...
          </div>
        ) : recentCollections.length === 0 ? (
          <div className="rounded-2xl border border-[#163554] bg-[#0B2239] p-6 text-gray-400">
            No public collections yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentCollections.map((collection) => renderCollectionCard(collection))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12 pt-2">
        <div className="mb-5">
          <p className="mb-2 text-xs font-bold tracking-[0.22em] text-[#F2C94C]">
            PUBLIC WALLS
          </p>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Explore More
          </h2>
        </div>

        {!loading && moreCollections.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {moreCollections.map((collection) => renderCollectionCard(collection))}
          </div>
        ) : !loading ? (
          <div className="rounded-2xl border border-[#163554] bg-[#0B2239] p-6 text-gray-400">
            No more public collections yet.
          </div>
        ) : null}
      </section>

      <footer className="border-t border-[#163554]">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center">
          <p className="mb-2 text-xs font-bold tracking-[0.22em] text-[#F2C94C]">
            REELWALL
          </p>

          <p className="mx-auto max-w-2xl text-sm leading-6 text-gray-400">
            A digital trophy wall for anglers to preserve catches, collections,
            and stories from the water.
          </p>
        </div>
      </footer>
    </main>
  );
}
