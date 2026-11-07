import { motion } from 'motion/react';
import { X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_BADGES } from '../lib/profile';
import { soundEffects, speakFrenchText } from '../utils/soundEffects';

interface BadgesModalProps {
  name: string;
  unlocked: Set<string>;
  onClose: () => void;
}

export function BadgesModal({ name, unlocked, onClose }: BadgesModalProps) {
  const count = unlocked.size;

  const inspectBadge = (b: (typeof ALL_BADGES)[0]) => {
    const isUnlocked = unlocked.has(b.id);
    if (isUnlocked) {
      soundEffects.playStarChime();
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      speakFrenchText(`${b.title} ! ${b.description}`, { rate: 0.9, pitch: 1.15 });
    } else {
      soundEffects.playPop();
      speakFrenchText(`Badge mystère : ${b.hint}`, { rate: 0.9, pitch: 1.15 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-encre/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        className="bg-creme w-full max-w-lg rounded-[2.5rem] p-6 shadow-2xl border-4 border-white flex flex-col gap-5 max-h-[90dvh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden>
              🏆
            </span>
            <div>
              <h2 className="text-2xl font-bold">Le Coffre aux Trésors</h2>
              <p className="text-sm text-doux">
                {count} sur {ALL_BADGES.length} trésors trouvés par {name} !
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEffects.playPop();
              onClose();
            }}
            className="press w-11 h-11 rounded-2xl bg-white shadow-bonbon flex items-center justify-center text-doux"
            aria-label="Fermer le coffre"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white rounded-full h-4 p-1 shadow-inner overflow-hidden">
          <div
            className="bg-gradient-to-r from-soleil to-corail h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.round((count / ALL_BADGES.length) * 100)}%` }}
          />
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-3 gap-3">
          {ALL_BADGES.map((badge) => {
            const hasIt = unlocked.has(badge.id);
            return (
              <motion.button
                key={badge.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => inspectBadge(badge)}
                className={`p-3 rounded-3xl flex flex-col items-center text-center gap-1.5 transition-all shadow-bonbon ${
                  hasIt ? 'bg-white border-2 border-soleil' : 'bg-white/40 opacity-55 grayscale'
                }`}
                aria-label={hasIt ? `${badge.title} : ${badge.description}` : `Trésor verrouillé : ${badge.hint}`}
              >
                <span className="text-4xl sm:text-5xl my-1">{hasIt ? badge.emoji : '🔒'}</span>
                <span className="text-xs font-bold leading-tight line-clamp-1">{badge.title}</span>
                <span className="text-[10px] text-doux leading-none">
                  {hasIt ? 'Débloqué !' : 'À découvrir'}
                </span>
              </motion.button>
            );
          })}
        </div>

        <p className="text-center text-xs text-doux">
          Touche un trésor pour entendre comment le débloquer !
        </p>
      </motion.div>
    </div>
  );
}
