import { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Gamepad2,
  Moon,
  Palette,
  Pencil,
  RefreshCw,
  Shield,
  Sparkles,
  Trophy,
  Volume2,
  WifiOff
} from 'lucide-react';
import type { Profile } from '../lib/profile';
import type { Today } from '../../shared/schemas';
import { SECTION_STYLE, type Section } from './ui';
import { soundEffects, speakFrenchText, pronounceChildName } from '../utils/soundEffects';
import { DAILY_CHALLENGES, getTodayChallenge, type DailyChallenge } from '../data/dailyChallenges';

interface HomeProps {
  profile: Profile;
  today: Today;
  counts: Record<Exclude<Section, 'video'>, { total: number; done: number }>;
  badgesCount: number;
  favoritesCount: number;
  offline: boolean;
  onOpen: (s: Section) => void;
  onOpenDrawing: () => void;
  onOpenBadges: () => void;
  onOpenParents: () => void;
  onEditProfile: () => void;
}

function greeting(): string {
  const h = Number(
    new Intl.DateTimeFormat('fr-FR', {
      hour: 'numeric',
      hour12: false,
      timeZone: 'Europe/Paris'
    }).format(new Date())
  );
  return h >= 18 || h < 5 ? 'Bonsoir' : 'Bonjour';
}

const TILE_LABEL: Record<Exclude<Section, 'video'>, string> = {
  contes: 'Contes',
  activites: 'Activités',
  soir: 'Contes du soir'
};

const tile = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 140, damping: 16, delay: 0.07 * i }
  })
};

export function Home({
  profile,
  today,
  counts,
  badgesCount,
  favoritesCount,
  offline,
  onOpen,
  onOpenDrawing,
  onOpenBadges,
  onOpenParents,
  onEditProfile
}: HomeProps) {
  const [challengeIndex, setChallengeIndex] = useState<number>(() => {
    const todayCh = getTodayChallenge();
    return Math.max(0, DAILY_CHALLENGES.findIndex((c) => c.id === todayCh.id));
  });

  const challenge: DailyChallenge = DAILY_CHALLENGES[challengeIndex % DAILY_CHALLENGES.length];

  const open = (s: Section) => {
    soundEffects.playPop();
    onOpen(s);
  };

  const nextChallenge = () => {
    soundEffects.playPop();
    setChallengeIndex((prev) => (prev + 1) % DAILY_CHALLENGES.length);
  };

  const isEvening = greeting() === 'Bonsoir';
  const small: Exclude<Section, 'video'>[] = isEvening
    ? ['soir', 'contes', 'activites']
    : ['contes', 'activites', 'soir'];

  return (
    <main
      className="min-h-dvh max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 pb-28 sm:pb-16 select-none"
      style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))' }}
    >
      {/* Header personnalisé avec prononciation du prénom */}
      <header className="flex items-center gap-3 sm:gap-5 mb-5 sm:mb-7">
        <div className="text-6xl sm:text-7xl float" aria-hidden>
          {profile.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-doux text-base sm:text-xl font-medium">{greeting()}</p>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-5xl font-extrabold truncate text-encre">
              {profile.name} !
            </h1>
            {/* Voix du prénom interactive */}
            <button
              onClick={() => pronounceChildName(profile.name, isEvening ? 'goodnight' : 'greeting')}
              className="press px-3 py-1.5 rounded-full bg-soleil-clair text-encre font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm border border-soleil/40 hover:bg-soleil transition-colors"
              aria-label={`Écouter la voix de mon prénom ${profile.name}`}
              title="Écouter mon prénom"
            >
              <Volume2 className="w-4 h-4 text-encre" />
              <span>Écouter 🔊</span>
            </button>
          </div>
        </div>

        {/* Quick action buttons - min 56px touch friendly */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEffects.playPop();
              onOpenBadges();
            }}
            className="press relative min-w-[50px] min-h-[50px] sm:w-14 sm:h-14 rounded-2xl bg-white shadow-bonbon flex items-center justify-center text-soleil"
            aria-label="Mon coffre aux trésors"
            title="Mes trésors"
          >
            <Trophy className="w-6 h-6 fill-soleil" />
            {badgesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-corail text-white text-[11px] font-black flex items-center justify-center shadow">
                {badgesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              soundEffects.playPop();
              onOpenParents();
            }}
            className="press min-w-[50px] min-h-[50px] sm:w-14 sm:h-14 rounded-2xl bg-white shadow-bonbon flex items-center justify-center text-doux hover:text-encre"
            aria-label="Coin parents et réglages"
            title="Coin parents"
          >
            <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={onEditProfile}
            className="press min-w-[50px] min-h-[50px] sm:w-14 sm:h-14 rounded-2xl bg-white shadow-bonbon flex items-center justify-center text-doux"
            aria-label="Changer de prénom"
            title="Changer de prénom"
          >
            <Pencil className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </header>

      {offline && (
        <p
          role="status"
          className="mb-4 flex items-center gap-2 rounded-2xl bg-ciel-clair text-ciel px-4 py-2 font-medium"
        >
          <WifiOff className="w-5 h-5 shrink-0" /> Pas d’internet ? Pas de souci, tout marche quand même !
        </p>
      )}

      {/* Vidéo du jour : grande tuile responsive */}
      <motion.button
        custom={0}
        variants={tile}
        initial="hidden"
        animate="show"
        onClick={() => open('video')}
        className="press shadow-bonbon w-full rounded-[2.25rem] bg-corail text-white p-6 sm:p-8 text-left relative overflow-hidden mb-4 sm:mb-6"
      >
        <span className="absolute -right-4 -bottom-6 text-[9rem] sm:text-[11rem] opacity-25 rotate-12" aria-hidden>
          {today.emoji}
        </span>
        <span className="inline-block bg-white/25 rounded-full px-3.5 py-1 text-xs sm:text-sm font-semibold mb-3">
          🎬 La vidéo du jour
        </span>
        <span className="block text-2xl sm:text-4xl font-extrabold leading-tight max-w-[85%]">
          {today.title}
        </span>
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-white text-corail rounded-full px-5 py-2.5 text-base sm:text-lg font-bold shadow">
            ▶ Regarder
          </span>
          <span className="text-xs sm:text-sm font-semibold opacity-90">
            + 50 vidéos documentaires à la suite
          </span>
        </div>
      </motion.button>

      {/* Les 3 bibliothèques : Grid adapté iPad (3 colonnes) et téléphone */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mb-4 sm:mb-6">
        {small.map((s, i) => {
          const st = SECTION_STYLE[s];
          const c = counts[s];
          return (
            <motion.button
              key={s}
              custom={i + 1}
              variants={tile}
              initial="hidden"
              animate="show"
              onClick={() => open(s)}
              className={`press shadow-bonbon rounded-[2rem] ${st.strong} ${
                s === 'soir' || s === 'activites' ? 'text-white' : 'text-encre'
              } p-5 sm:p-6 text-left flex sm:flex-col items-center sm:items-start gap-4 min-h-[96px] sm:min-h-[160px]`}
            >
              <span className="text-5xl sm:text-6xl" aria-hidden>
                {st.emoji}
              </span>
              <span className="flex-1">
                <span className="block text-xl sm:text-2xl font-bold">{TILE_LABEL[s]}</span>
                <span className="block opacity-85 font-medium text-sm sm:text-base mt-0.5">
                  {c.done > 0 ? `${c.done} / ${c.total} ✓` : `${c.total} à découvrir`}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Atelier Dessin Magique - Tuile créative avec les 55 modèles */}
      <motion.button
        custom={4}
        variants={tile}
        initial="hidden"
        animate="show"
        onClick={() => {
          soundEffects.playPop();
          onOpenDrawing();
        }}
        className="press shadow-bonbon w-full rounded-[2.25rem] bg-gradient-to-r from-lavande via-purple-400 to-rose text-white p-5 sm:p-7 text-left flex items-center gap-4 sm:gap-6 relative overflow-hidden mb-4 sm:mb-6"
      >
        <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/20 flex items-center justify-center text-4xl sm:text-5xl shrink-0">
          🎨
        </span>
        <div className="flex-1 min-w-0">
          <span className="inline-block bg-white/25 rounded-full px-3 py-0.5 text-xs font-bold mb-1">
            ✨ Atelier créatif • 55 modèles
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold leading-tight">Mon Dessin Magique</h2>
          <p className="text-xs sm:text-base text-white/95 font-medium mt-1">
            Pinceau arc-en-ciel, 55 guides de dessin pas-à-pas et tampons d’animaux !
          </p>
        </div>
        <span className="hidden sm:inline-flex bg-white text-lavande rounded-2xl px-5 py-2.5 font-bold text-base shadow shrink-0">
          Dessiner ➜
        </span>
      </motion.button>

      {/* Défi Magique du Jour - 60 idées d'activités quotidiennes */}
      <motion.div
        custom={5}
        variants={tile}
        initial="hidden"
        animate="show"
        className="rounded-[2.25rem] bg-white shadow-bonbon p-5 sm:p-6 border-2 border-soleil-clair flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-4 flex-1">
          <span className="text-4xl sm:text-5xl shrink-0">{challenge.emoji}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-soleil-clair text-encre text-[11px] sm:text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                🌟 Défi magique du jour
              </span>
              <span className="text-xs text-doux capitalize">({challenge.category})</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-encre">{challenge.title}</h3>
            <p className="text-xs sm:text-sm text-doux mt-0.5 leading-relaxed">
              {challenge.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={() => speakFrenchText(challenge.spokenText, { rate: 0.88, pitch: 1.15 })}
            className="press px-3.5 py-2 rounded-2xl bg-ciel-clair text-ciel font-bold text-xs sm:text-sm flex items-center gap-1.5"
            aria-label="Écouter le défi magique"
            title="Écouter"
          >
            <Volume2 className="w-4 h-4" />
            <span>Écouter</span>
          </button>
          <button
            onClick={nextChallenge}
            className="press px-3.5 py-2 rounded-2xl bg-creme text-encre font-bold text-xs sm:text-sm flex items-center gap-1.5 border border-encre/10"
            aria-label="Autre défi magique"
            title="Autre défi"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Autre</span>
          </button>
        </div>
      </motion.div>

      <footer className="text-center text-xs sm:text-sm text-doux mt-8 mb-4">
        Pulse Kids • sans publicité • plus de 180 activités et contes • données 100% locales
      </footer>

      {/* Barre de navigation ergonomique pour téléphone (format mobile avec zone de pouce) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-encre/10 px-3 py-2 flex items-center justify-around sm:hidden shadow-lg"
        style={{ paddingBottom: 'max(0.6rem, env(safe-area-inset-bottom))' }}
        aria-label="Navigation rapide"
      >
        <button
          onClick={() => {
            soundEffects.playPop();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="press flex flex-col items-center gap-0.5 text-encre p-1"
        >
          <span className="text-2xl">🏠</span>
          <span className="text-[10px] font-bold">Accueil</span>
        </button>
        <button
          onClick={() => open('contes')}
          className="press flex flex-col items-center gap-0.5 text-encre p-1"
        >
          <span className="text-2xl">📖</span>
          <span className="text-[10px] font-bold">Contes</span>
        </button>
        <button
          onClick={() => open('activites')}
          className="press flex flex-col items-center gap-0.5 text-encre p-1"
        >
          <span className="text-2xl">🧩</span>
          <span className="text-[10px] font-bold">Jeux</span>
        </button>
        <button
          onClick={() => {
            soundEffects.playPop();
            onOpenDrawing();
          }}
          className="press flex flex-col items-center gap-0.5 text-encre p-1"
        >
          <span className="text-2xl">🎨</span>
          <span className="text-[10px] font-bold">Dessin</span>
        </button>
        <button
          onClick={() => {
            soundEffects.playPop();
            onOpenBadges();
          }}
          className="press flex flex-col items-center gap-0.5 text-encre p-1"
        >
          <span className="text-2xl">🏆</span>
          <span className="text-[10px] font-bold">Trésors</span>
        </button>
      </nav>
    </main>
  );
}
