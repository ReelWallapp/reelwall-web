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
  const [liked, setLiked] = useState(false);
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

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/collections');
    }
  };

  const shareCatch = async () => {
    try {
      const url = window.location.href;

      if (navigator.share) {
        await navigator.share({
          title: 'ReelWall Catch',
          text: 'Check out this catch on ReelWall',
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);

        setTimeout(() => {
          setShareCopied(false);
        }, 2500);
      }
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const weatherText =
    catchItem?.weather_temp !== undefined &&
    catchItem?.weather_temp !== null &&
    catchItem?.weather_description
      ? `${catchItem.weather_temp}°C • ${catchItem.weather_description}`
      : catchItem?.weather_description || '';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#081E33] text-white flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-sm font-bold tracking-[0.2em] text-[#F2C94C] mb-2">
            REELWALL
          </p>
          <h1 className="text-3xl font-extrabold">Loading catch...</h1>
        </div>
      </div>
    );
  }

  if (!catchItem) {
    return (
      <div className="min-h-screen bg-[#081E33] text-white flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-sm font-bold tracking-[0.2em] text-[#F2C94C] mb-2">
            REELWALL
          </p>
          <h1 className="text-3xl font-extrabold mb-3">Catch not found</h1>
          <p className="text-gray-400">
            This catch could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#081E33] text-white">
      <section className="border-b border-[#163554] bg-gradient-to-b from-[#0D2942] to-[#081E33]">
        <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">

          {/* ✅ BACK BUTTON */}
          <button
            onClick={handleBack}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1C466C] bg-[#0D2942]/80 px-4 py-2 text-sm font-bold text-[#E6EEF7] backdrop-blur hover:border-[#F2C94C]/40 hover:text-[#F2C94C] transition"
          >
            ← Back
          </button>

          <p className="text-sm font-bold tracking-[0.2em] text-[#F2C94C] mb-3">
            REELWALL CATCH
          </p>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-3">
            Wall-Worthy
          </h1>

          <p className="max-w-2xl text-gray-300 text-base md:text-lg leading-7">
            Becasue some moments deserve more than a camera roll.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {catchItem.is_personal_best ? (
              <div className="rounded-full bg-[#F2C94C] px-4 py-2 text-sm font-extrabold text-[#0A2540]">
                PERSONAL BEST
              </div>
            ) : null}

            <button
              onClick={() => setLiked((prev) => !prev)}
              className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
                liked
                  ? 'bg-[#F2C94C] text-[#0A2540]'
                  : 'bg-[#12314F] text-white hover:opacity-90'
              }`}
            >
              {liked ? '♥ Liked' : '♡ Like'}
            </button>

            <button
              onClick={shareCatch}
              className="rounded-full bg-[#12314F] px-4 py-2 text-sm font-extrabold text-white hover:opacity-90 transition"
            >
              {shareCopied ? 'Link Copied ✓' : 'Share Catch'}
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="overflow-hidden rounded-3xl border border-[#163554] bg-[#102C47] shadow-lg">
          {catchItem.image_url ? (
            <img
              src={catchItem.image_url}
              alt="Catch"
              className="w-full max-h-[700px] object-cover"
            />
          ) : (
            <div className="w-full h-96 bg-[#163554] flex items-center justify-center text-gray-400">
              No image
            </div>
          )}

          <div className="p-6">
            <div className="flex flex-wrap gap-3 mb-5">
              {catchItem.created_at ? (
                <div className="rounded-full bg-[#12314F] px-4 py-2 text-sm font-semibold text-white">
                  {new Date(catchItem.created_at).toLocaleDateString()}
                </div>
              ) : null}

              {catchItem.place_name ? (
                <div className="rounded-full bg-[#12314F] px-4 py-2 text-sm font-semibold text-white">
                  {catchItem.place_name}
                </div>
              ) : null}

              {weatherText ? (
                <div className="rounded-full bg-[#12314F] px-4 py-2 text-sm font-semibold text-white">
                  {weatherText}
                </div>
              ) : null}
            </div>

            <h2 className="text-2xl font-extrabold mb-3">Story</h2>

            {catchItem.note ? (
              <p className="text-gray-300 text-base leading-8">
                {catchItem.note}
              </p>
            ) : (
              <p className="text-gray-500 text-base leading-8">
                No note added for this catch yet.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-[#163554]">
        <div className="mx-auto max-w-5xl px-6 py-10 text-center">
          <p className="text-sm font-bold tracking-[0.2em] text-[#F2C94C] mb-3">
            BUILT WITH REELWALL
          </p>
          <h3 className="text-2xl md:text-3xl font-extrabold mb-3">
            Preserve the Story, Not Just the Photo
          </h3>
          <p className="max-w-2xl mx-auto text-gray-400 leading-7">
            ReelWall helps anglers capture, organize, and showcase real moments
            from the water.
          </p>
        </div>
      </section>
    </div>
  );
}