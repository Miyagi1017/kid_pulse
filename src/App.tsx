import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { Onboarding } from './components/Onboarding';
import { Home } from './components/Home';
import { Library } from './components/Library';
import { TaleReader } from './components/TaleReader';
import { ActivityPlayer } from './components/ActivityPlayer';
import { VideoPlayer } from './components/DailyVideo';
import { DrawingCanvas } from './components/DrawingCanvas';
import { BadgesModal } from './components/BadgesModal';
import { ParentModal } from './components/ParentModal';
import { buildPlaylist, TODAY_ID } from './lib/playlist';
import { VIDEO_THEMES } from './data/videos';
import type { Section } from './components/ui';
import { CONTES } from './data/contes';
import { CONTES_DU_SOIR } from './data/contesDuSoir';
import { ACTIVITES, CATEGORY_INFO } from './data/activites';
import { illustrationFor } from './data/illustrations';
import {
  ALL_BADGES,
  purgeLegacyStorage,
  useBadges,
  useDone,
  useFavorites,
  useParentSettings,
  useProfile
} from './lib/profile';
import { cachedToday, fetchToday } from './lib/today';
import { soundEffects, speakFrenchText, stopSpeaking } from './utils/soundEffects';
import type { Today } from '../shared/schemas';

type View =
  | { name: 'home' }
  | { name: 'profile' }
  | { name: 'video' }
  | { name: 'player'; index: number }
  | { name: 'library'; section: 'contes' | 'activites' | 'soir' }
  | { name: 'tale'; section: 'contes' | 'soir'; id: string }
  | { name: 'activity'; id: string }
  | { name: 'drawing' };

function useOnline() {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

export default function App() {
  const { profile, setProfile } = useProfile();
  const { done, markDone } = useDone();
  const { favorites, toggleFavorite } = useFavorites();
  const { unlocked: badges, unlockBadge } = useBadges();
  const { settings, updateSettings } = useParentSettings();

  const [view, setViewState] = useState<View>({ name: 'home' });
  const [today, setToday] = useState<Today>(cachedToday);
  const [showBadges, setShowBadges] = useState(false);
  const [showParents, setShowParents] = useState(false);
  const [screenTimeAlert, setScreenTimeAlert] = useState(false);

  const sessionStartTime = useRef<number>(Date.now());
  const online = useOnline();

  // Screen time monitoring
  useEffect(() => {
    if (settings.screenTimeLimit <= 0) return;
    const interval = setInterval(() => {
      const elapsedMinutes = (Date.now() - sessionStartTime.current) / (60 * 1000);
      if (elapsedMinutes >= settings.screenTimeLimit && !screenTimeAlert) {
        soundEffects.playSessionEndAlert();
        speakFrenchText("C'est l'heure de faire une petite pause et de reposer tes yeux !", { rate: 0.85 });
        setScreenTimeAlert(true);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [settings.screenTimeLimit, screenTimeAlert]);

  useEffect(() => {
    purgeLegacyStorage();
    fetchToday().then((t) => t && setToday(t));
  }, []);

  const setView = (v: View) => {
    stopSpeaking();
    window.scrollTo({ top: 0 });
    setViewState(v);
  };
  const home = () => setView({ name: 'home' });

  const playlist = useMemo(() => buildPlaylist(today), [today]);

  const counts = useMemo(() => {
    const c = (ids: { id: string }[]) => ({ total: ids.length, done: ids.filter((i) => done.has(i.id)).length });
    return { contes: c(CONTES), activites: c(ACTIVITES), soir: c(CONTES_DU_SOIR) };
  }, [done]);

  const totalDoneCount = done.size;

  const handleTaleDone = useCallback(
    (taleId: string, isNight: boolean) => {
      markDone(taleId);
      unlockBadge('first_tale');
      if (isNight) unlockBadge('first_soir');
      if (totalDoneCount + 1 >= 10) unlockBadge('collector_10');
      if (totalDoneCount + 1 >= 30) unlockBadge('collector_30');
    },
    [markDone, unlockBadge, totalDoneCount]
  );

  const handleActivitySolved = useCallback(
    (actId: string) => {
      markDone(actId);
      unlockBadge('first_game');
      const solvedActivities = ACTIVITES.filter((a) => done.has(a.id) || a.id === actId).length;
      if (solvedActivities >= 5) unlockBadge('games_5');
      if (solvedActivities >= 20) unlockBadge('games_20');
      if (totalDoneCount + 1 >= 10) unlockBadge('collector_10');
      if (totalDoneCount + 1 >= 30) unlockBadge('collector_30');
    },
    [markDone, unlockBadge, done, totalDoneCount]
  );

  const handleVideoWatched = useCallback(
    (vidId: string) => {
      markDone(vidId);
      unlockBadge('first_video');
      if (totalDoneCount + 1 >= 10) unlockBadge('collector_10');
      if (totalDoneCount + 1 >= 30) unlockBadge('collector_30');
    },
    [markDone, unlockBadge, totalDoneCount]
  );

  const handleSavedDrawing = useCallback(() => {
    unlockBadge('artist');
  }, [unlockBadge]);

  const handleResetProgress = () => {
    localStorage.removeItem('pulse_kids_done_v3');
    localStorage.removeItem('pulse_kids_badges_v3');
    localStorage.removeItem('pulse_kids_favorites_v3');
    window.location.reload();
  };

  /** Prochain contenu de la liste (en priorité un pas encore fait). */
  const nextId = (list: { id: string }[], current: string) => {
    const start = list.findIndex((i) => i.id === current);
    for (let k = 1; k <= list.length; k++) {
      const cand = list[(start + k) % list.length];
      if (!done.has(cand.id)) return cand.id;
    }
    return list[(start + 1) % list.length].id;
  };

  if (!profile || view.name === 'profile') {
    return (
      <Onboarding
        initial={profile}
        onDone={(p) => {
          setProfile(p);
          home();
        }}
      />
    );
  }

  let screen: React.ReactNode;
  switch (view.name) {
    case 'drawing':
      screen = (
        <DrawingCanvas
          name={profile.name}
          onBack={home}
          onSavedDrawing={handleSavedDrawing}
        />
      );
      break;

    case 'video': {
      const [journal, ...videos] = playlist;
      screen = (
        <Library
          section="video"
          items={videos.map((v) => ({ id: v.id, emoji: v.emoji, title: v.title, image: v.thumb, category: v.category }))}
          done={done}
          favorites={favorites}
          categories={VIDEO_THEMES}
          onBack={home}
          onPick={(id) => setView({ name: 'player', index: playlist.findIndex((p) => p.id === id) })}
          onToggleFavorite={toggleFavorite}
          action={{ label: '▶ Tout regarder', onClick: () => setView({ name: 'player', index: 0 }) }}
          intro={
            <button
              onClick={() => setView({ name: 'player', index: 0 })}
              className="press shadow-bonbon w-full mb-5 rounded-[2rem] bg-corail text-white p-4 sm:p-5 flex items-center gap-4 text-left"
            >
              {journal.thumb ? (
                <img src={journal.thumb} alt="" className="w-28 sm:w-36 aspect-[4/3] object-cover rounded-2xl border-4 border-white/60" />
              ) : (
                <span className="text-6xl">{journal.emoji}</span>
              )}
              <span className="flex-1">
                <span className="block text-sm font-semibold opacity-90">📰 Le journal du jour {done.has(TODAY_ID) ? '✓' : ''}</span>
                <span className="block text-xl sm:text-2xl font-bold leading-tight">{journal.title}</span>
                <span className="block mt-1 opacity-90">Puis {videos.length} vidéos à la suite ▶</span>
              </span>
            </button>
          }
        />
      );
      break;
    }
    case 'player': {
      const currentVideo = playlist[Math.max(0, view.index)];
      screen = (
        <VideoPlayer
          playlist={playlist}
          startIndex={Math.max(0, view.index)}
          name={profile.name}
          isFavorite={currentVideo ? favorites.has(currentVideo.id) : false}
          speechSpeed={settings.speechSpeed}
          onBack={() => setView({ name: 'video' })}
          onWatched={handleVideoWatched}
          onToggleFavorite={currentVideo ? () => toggleFavorite(currentVideo.id) : undefined}
        />
      );
      break;
    }
    case 'library': {
      const items =
        view.section === 'activites'
          ? ACTIVITES
          : (view.section === 'contes' ? CONTES : CONTES_DU_SOIR).map((t) => ({ ...t, image: illustrationFor(t.id) }));
      screen = (
        <Library
          section={view.section}
          items={items}
          done={done}
          favorites={favorites}
          categories={view.section === 'activites' ? CATEGORY_INFO : undefined}
          onBack={home}
          onToggleFavorite={toggleFavorite}
          onPick={(id) => setView(view.section === 'activites' ? { name: 'activity', id } : { name: 'tale', section: view.section as 'contes' | 'soir', id })}
        />
      );
      break;
    }
    case 'tale': {
      const list = view.section === 'contes' ? CONTES : CONTES_DU_SOIR;
      const tale = list.find((t) => t.id === view.id) ?? list[0];
      screen = (
        <TaleReader
          key={tale.id}
          tale={tale}
          name={profile.name}
          isFavorite={favorites.has(tale.id)}
          speechSpeed={settings.speechSpeed}
          onBack={() => setView({ name: 'library', section: view.section })}
          onFinished={() => handleTaleDone(tale.id, view.section === 'soir')}
          onNext={() => setView({ name: 'tale', section: view.section, id: nextId(list, tale.id) })}
          onToggleFavorite={() => toggleFavorite(tale.id)}
        />
      );
      break;
    }
    case 'activity': {
      const activity = ACTIVITES.find((a) => a.id === view.id) ?? ACTIVITES[0];
      screen = (
        <ActivityPlayer
          key={activity.id}
          activity={activity}
          name={profile.name}
          isFavorite={favorites.has(activity.id)}
          speechSpeed={settings.speechSpeed}
          onBack={() => setView({ name: 'library', section: 'activites' })}
          onSolved={() => handleActivitySolved(activity.id)}
          onNext={() => setView({ name: 'activity', id: nextId(ACTIVITES, activity.id) })}
          onToggleFavorite={() => toggleFavorite(activity.id)}
        />
      );
      break;
    }
    default:
      screen = (
        <Home
          profile={profile}
          today={today}
          counts={counts}
          badgesCount={badges.size}
          favoritesCount={favorites.size}
          offline={!online}
          onOpen={(s: Section) => setView(s === 'video' ? { name: 'video' } : { name: 'library', section: s })}
          onOpenDrawing={() => setView({ name: 'drawing' })}
          onOpenBadges={() => setShowBadges(true)}
          onOpenParents={() => setShowParents(true)}
          onEditProfile={() => setView({ name: 'profile' })}
        />
      );
  }

  const viewKey =
    view.name === 'tale' || view.name === 'activity'
      ? `${view.name}-${'id' in view ? view.id : ''}`
      : view.name === 'library'
      ? `lib-${view.section}`
      : view.name;

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        <motion.div key={viewKey} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {screen}
        </motion.div>
      </AnimatePresence>

      {/* Badges / Treasure modal */}
      <AnimatePresence>
        {showBadges && (
          <BadgesModal
            name={profile.name}
            unlocked={badges}
            onClose={() => setShowBadges(false)}
          />
        )}
      </AnimatePresence>

      {/* Parent Zone Modal */}
      <AnimatePresence>
        {showParents && (
          <ParentModal
            profile={profile}
            settings={settings}
            counts={{
              total: CONTES.length + CONTES_DU_SOIR.length + ACTIVITES.length + playlist.length,
              done: done.size
            }}
            badgesCount={badges.size}
            onUpdateSettings={updateSettings}
            onEditProfile={() => {
              setShowParents(false);
              setView({ name: 'profile' });
            }}
            onResetProgress={handleResetProgress}
            onClose={() => setShowParents(false)}
          />
        )}
      </AnimatePresence>

      {/* Screen Time Gentle Rest Modal */}
      <AnimatePresence>
        {screenTimeAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-encre/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-creme max-w-sm w-full rounded-[2.5rem] p-6 text-center border-4 border-white shadow-2xl flex flex-col items-center gap-4"
            >
              <span className="text-7xl float" aria-hidden>
                🌙
              </span>
              <h3 className="text-2xl font-bold">C'est l'heure de la pause !</h3>
              <p className="text-sm text-doux leading-relaxed">
                Bravo pour toutes tes belles découvertes aujourd'hui, {profile.name} ! Il est temps de reposer tes petits yeux.
              </p>
              <button
                onClick={() => {
                  soundEffects.playPop();
                  sessionStartTime.current = Date.now();
                  setScreenTimeAlert(false);
                }}
                className="press mt-2 w-full py-4 rounded-2xl bg-lavande text-white font-bold text-lg shadow-bonbon"
              >
                C'est compris ! ✨
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
