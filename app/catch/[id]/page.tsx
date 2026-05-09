'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

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
      const title = catchItem?.place_name || 'ReelWall Catch';
      const text = catchItem?.note
        ? `${catchItem.note.slice(0, 140)}${
            catchItem.note.length > 140 ? '...' : ''
          }`
        : 'Check out this catch on ReelWall.';

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

    const cleanPath = value.replace(/^\/+/, '').replace(/^catches\//, '');

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

  const weatherText =
    catchItem?.weather_temp !== undefined &&
    catchItem?.weather_temp !== null &&
    catchItem?.weather_description
      ? `${catchItem.weather_temp}°C • ${catchItem.weather_description}`
      : catchItem?.weather_description || '';

  const displayDate = catchItem?.catch_date || catchItem?.created_at || '';

  if (loading) {
    return (
      <main className="min-h-screen bg-[#081E33] text-white">
        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="rounded-[28px] border border-[#F2C94C]/20 bg-[#102C47] px-8 py-10 text-center shadow-2xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#F2C94C]">
              REELWALL
            </p>

            <h1 className="text-3xl font-black tracking-[-0.04em]">
              Loading catch...
            </h1>

            <p className="mt-3 text-sm font-semibold text-[#A5B3C2]">
              Pulling in the story from the water.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (!catchItem) {
    return (
      <main className="min-h-screen bg-[#081E33] text-white">
        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="rounded-[28px] border border-[#F2C94C]/20 bg-[#102C47] px-8 py-10 text-center shadow-2xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#F2C94C]">
              REELWALL
            </p>

            <h1 className="text-3xl font-black tracking-[-0.04em]">
              Catch not found
            </h1>

            <p className="mt-3 text-sm font-semibold text-[#A5B3C2]">
              This catch could not be loaded.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#081E33] text-white">
      <section className="relative overflow-hidden border-b border-[#264F75]/40 bg-gradient-to-b from-[#071C31] to-[#081E33]">
        <div className="pointer-events-none absolute right-[8%] top-16 h-96 w-96 rounded-full bg-[#F2C94C]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-64 h-[30rem] w-[30rem] rounded-full bg-[#1C466C]/30 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-8 md:py-12">
          <button
            type="button"
            onClick={handleBack}
            className="mb-8 inline-flex min-h-11 items-center rounded-full border border-white/10 bg-[#04121F]/60 px-5 text-sm font-black text-[#E6EDF3] backdrop-blur transition hover:border-[#F2C94C]/30 hover:text-[#F2C94C]"
          >
            ← Back
          </button>

          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#F2C94C]">
              REELWALL CATCH
            </p>

            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.065em] md:text-7xl">
              Wall-worthy.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-8 text-[#C0CEDB]">
              Because some moments deserve more than a camera roll.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {catchItem.is_personal_best ? (
                <span className="inline-flex min-h-11 items-center rounded-full bg-[#F2C94C] px-5 text-sm font-black uppercase tracking-wide text-[#081E33] shadow-lg shadow-[#F2C94C]/15">
                  Personal Best
                </span>
              ) : null}

              {displayDate ? (
                <span className="inline-flex min-h-11 items-center rounded-full border border-white/10 bg-[#04121F]/60 px-5 text-sm font-black text-[#E6EDF3]">
                  {formatDate(displayDate)}
                </span>
              ) : null}

              {catchItem.place_name ? (
                <span className="inline-flex min-h-11 items-center rounded-full border border-white/10 bg-[#04121F]/60 px-5 text-sm font-black text-[#E6EDF3]">
                  {catchItem.place_name}
                </span>
              ) : null}

              <button
                type="button"
                onClick={shareCatch}
                className="inline-flex min-h-11 items-center rounded-full bg-[#F2C94C] px-5 text-sm font-black text-[#081E33] shadow-lg shadow-[#F2C94C]/15 transition hover:-translate-y-0.5 hover:opacity-95"
              >
                {shareCopied ? 'Link Copied ✓' : 'Share Catch'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="overflow-hidden rounded-[34px] border border-[#F2C94C]/20 bg-[#102C47] shadow-2xl shadow-black/20">
          {catchItem.image_url ? (
            <div className="flex w-full items-center justify-center bg-[#081E33] p-3 md:p-5">
              <img
                src={getPublicImageUrl(catchItem.image_url)}
                alt="ReelWall catch"
                className="max-h-[760px] w-full rounded-[24px] object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/logo.png';
                }}
              />
            </div>
          ) : (
            <div className="flex h-96 w-full items-center justify-center bg-[#081E33] text-sm font-bold text-[#A5B3C2]">
              No image
            </div>
          )}

          <div className="grid gap-8 p-6 md:grid-cols-[0.85fr_1.15fr] md:p-8">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#F2C94C]">
                Catch Details
              </p>

              <div className="space-y-3">
                {catchItem.place_name ? (
                  <div className="rounded-2xl border border-white/5 bg-[#081E33]/70 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8FA3B8]">
                      Location
                    </p>
                    <p className="mt-1 text-base font-black text-white">
                      {catchItem.place_name}
                    </p>
                  </div>
                ) : null}

                {displayDate ? (
                  <div className="rounded-2xl border border-white/5 bg-[#081E33]/70 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8FA3B8]">
                      Date
                    </p>
                    <p className="mt-1 text-base font-black text-white">
                      {formatDate(displayDate)}
                    </p>
                  </div>
                ) : null}

                {weatherText ? (
                  <div className="rounded-2xl border border-white/5 bg-[#081E33]/70 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8FA3B8]">
                      Weather
                    </p>
                    <p className="mt-1 text-base font-black text-white">
                      {weatherText}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#F2C94C]">
                Story
              </p>

              <div className="min-h-52 rounded-[24px] border border-white/5 bg-[#081E33]/70 p-5">
                {catchItem.note ? (
                  <p className="whitespace-pre-wrap text-base font-medium leading-8 text-[#D7E2EC]">
                    {catchItem.note}
                  </p>
                ) : (
                  <p className="text-base font-medium leading-8 text-[#8FA3B8]">
                    No story added for this catch yet.
                  </p>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={shareCatch}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#F2C94C] px-5 text-sm font-black text-[#081E33] transition hover:-translate-y-0.5 hover:opacity-95"
                >
                  {shareCopied ? 'Link Copied ✓' : 'Share This Catch'}
                </button>

                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#F2C94C]/25 bg-[#0B253D] px-5 text-sm font-black text-white transition hover:border-[#F2C94C]/45"
                >
                  Back to Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#264F75]/40 bg-[#061421]">
        <div className="mx-auto max-w-5xl px-6 py-12 text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#F2C94C]">
            BUILT WITH REELWALL
          </p>

          <h3 className="text-3xl font-black tracking-[-0.045em] md:text-5xl">
            Preserve the story, not just the photo.
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-[#9FB0C1]">
            ReelWall helps anglers capture, organize, and showcase real moments
            from the water.
          </p>
        </div>
      </section>
    </main>
  );
}