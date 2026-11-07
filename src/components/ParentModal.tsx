import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Clock, Lock, Volume2, VolumeX, X } from 'lucide-react';
import type { ParentSettings, Profile } from '../lib/profile';
import { soundEffects, speakFrenchText } from '../utils/soundEffects';

interface ParentModalProps {
  profile: Profile;
  settings: ParentSettings;
  counts: { total: number; done: number };
  badgesCount: number;
  onUpdateSettings: (partial: Partial<ParentSettings>) => void;
  onEditProfile: () => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export function ParentModal({
  profile,
  settings,
  counts,
  badgesCount,
  onUpdateSettings,
  onEditProfile,
  onResetProgress,
  onClose
}: ParentModalProps) {
  // Math gate: generate two numbers that sum up to <= 10
  const challenge = useMemo(() => {
    const a = Math.floor(Math.random() * 5) + 2;
    const b = Math.floor(Math.random() * 4) + 1;
    return { a, b, answer: a + b };
  }, []);

  const [inputAnswer, setInputAnswer] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(inputAnswer.trim(), 10) === challenge.answer) {
      soundEffects.playStarChime();
      setUnlocked(true);
      setErrorMsg(false);
    } else {
      soundEffects.playPop();
      setErrorMsg(true);
      setInputAnswer('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-encre/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="bg-creme w-full max-w-lg rounded-[2.5rem] p-6 shadow-2xl border-4 border-white flex flex-col gap-5 max-h-[90dvh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-encre/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-white shadow-bonbon flex items-center justify-center text-2xl">
              🛡️
            </span>
            <div>
              <h2 className="text-2xl font-bold">Coin Parents</h2>
              <p className="text-xs text-doux">Réglages bienveillants & progression</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEffects.playPop();
              onClose();
            }}
            className="press w-10 h-10 rounded-2xl bg-white shadow-bonbon flex items-center justify-center text-doux"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!unlocked ? (
          /* Security Gate for parents */
          <form onSubmit={checkAnswer} className="py-6 flex flex-col items-center gap-5 text-center">
            <div className="w-16 h-16 rounded-3xl bg-soleil-clair flex items-center justify-center text-3xl">
              <Lock className="w-8 h-8 text-encre" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Espace réservé aux grands</h3>
              <p className="text-sm text-doux mt-1">
                Pour vérifier que tu es un parent, résous ce petit calcul :
              </p>
              <div className="mt-4 text-3xl font-extrabold bg-white rounded-2xl py-3 px-6 shadow-bonbon inline-block">
                {challenge.a} + {challenge.b} = ?
              </div>
            </div>

            <div className="flex gap-2 w-full max-w-xs">
              <input
                type="number"
                inputMode="numeric"
                value={inputAnswer}
                onChange={(e) => setInputAnswer(e.target.value)}
                placeholder="Ta réponse"
                autoFocus
                className="flex-1 bg-white rounded-2xl px-4 py-3 text-xl font-bold text-center shadow-inner border-2 border-encre/10 focus:border-ciel focus:outline-none"
              />
              <button
                type="submit"
                className="press bg-menthe text-white font-bold px-6 py-3 rounded-2xl shadow-bonbon"
              >
                Entrer
              </button>
            </div>

            {errorMsg && (
              <p className="text-rose text-sm font-semibold">Oups ! Ce n’est pas le bon résultat. Réessaie !</p>
            )}
          </form>
        ) : (
          /* Actual Parent Dashboard */
          <div className="space-y-6">
            {/* Stats Summary */}
            <div className="bg-white rounded-3xl p-5 shadow-bonbon space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg flex items-center gap-2">
                  <span>{profile.avatar}</span> {profile.name}
                </span>
                <button
                  onClick={() => {
                    onClose();
                    onEditProfile();
                  }}
                  className="text-xs font-bold bg-creme text-doux px-3 py-1.5 rounded-full hover:bg-soleil-clair"
                >
                  Changer prénom
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-creme p-3 rounded-2xl text-center">
                  <span className="block text-2xl font-black text-menthe">
                    {counts.done} / {counts.total}
                  </span>
                  <span className="text-xs text-doux font-semibold">Contenus explorés</span>
                </div>
                <div className="bg-creme p-3 rounded-2xl text-center">
                  <span className="block text-2xl font-black text-soleil">
                    {badgesCount} / 9
                  </span>
                  <span className="text-xs text-doux font-semibold">Trophées débloqués</span>
                </div>
              </div>
            </div>

            {/* Screen Time Timer setting */}
            <div className="bg-white rounded-3xl p-5 shadow-bonbon space-y-3">
              <div className="flex items-center gap-2 font-bold text-base">
                <Clock className="w-5 h-5 text-corail" />
                <span>Minuteur d'écran doux</span>
              </div>
              <p className="text-xs text-doux">
                Pulse Kids prévient gentiment l'enfant à la fin du temps pour reposer ses yeux.
              </p>
              <div className="grid grid-cols-4 gap-2 pt-1">
                {[
                  { label: 'Désactivé', value: 0 },
                  { label: '15 min', value: 15 },
                  { label: '20 min', value: 20 },
                  { label: '30 min', value: 30 }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      soundEffects.playPop();
                      onUpdateSettings({ screenTimeLimit: opt.value });
                    }}
                    className={`press py-2 px-1 rounded-2xl text-xs font-bold text-center ${
                      settings.screenTimeLimit === opt.value
                        ? 'bg-corail text-white shadow-bonbon'
                        : 'bg-creme text-doux'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Speed & Sound */}
            <div className="bg-white rounded-3xl p-5 shadow-bonbon space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Vitesse de la voix</h4>
                  <p className="text-xs text-doux">Pour une meilleure compréhension orale</p>
                </div>
                <div className="flex gap-1 bg-creme p-1 rounded-2xl">
                  <button
                    onClick={() => {
                      soundEffects.playPop();
                      onUpdateSettings({ speechSpeed: 'normal' });
                      speakFrenchText('Vitesse normale activée.', { rate: 0.88 });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      settings.speechSpeed === 'normal' ? 'bg-white shadow-sm text-encre' : 'text-doux'
                    }`}
                  >
                    Normale
                  </button>
                  <button
                    onClick={() => {
                      soundEffects.playPop();
                      onUpdateSettings({ speechSpeed: 'slow' });
                      speakFrenchText('Vitesse douce et lente activée.', { rate: 0.72 });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      settings.speechSpeed === 'slow' ? 'bg-white shadow-sm text-encre' : 'text-doux'
                    }`}
                  >
                    Douce
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-encre/5">
                <div>
                  <h4 className="font-bold text-sm">Effets sonores</h4>
                  <p className="text-xs text-doux">Bruits de clochettes et petites victoires</p>
                </div>
                <button
                  onClick={() => {
                    const next = !settings.soundMuted;
                    soundEffects.setMuted(next);
                    onUpdateSettings({ soundMuted: next });
                    if (!next) soundEffects.playPop();
                  }}
                  className={`press w-10 h-10 rounded-2xl flex items-center justify-center ${
                    settings.soundMuted ? 'bg-rose-clair text-rose' : 'bg-menthe-clair text-menthe'
                  }`}
                  aria-label={settings.soundMuted ? 'Réactiver le son' : 'Couper le son'}
                >
                  {settings.soundMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Privacy note & Reset */}
            <div className="text-center space-y-3">
              <p className="text-[11px] text-doux">
                🔒 Pulse Kids respecte la vie privée : aucun compte, aucune publicité, zéro pistage tiers. Les données restent stockées sur votre appareil.
              </p>

              {!confirmReset ? (
                <button
                  onClick={() => setConfirmReset(true)}
                  className="text-xs text-doux/70 underline hover:text-rose"
                >
                  Réinitialiser la progression
                </button>
              ) : (
                <div className="bg-rose-clair p-3 rounded-2xl space-y-2">
                  <p className="text-xs font-bold text-rose">
                    Effacer toutes les coches et les trophées ?
                  </p>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setConfirmReset(false)}
                      className="px-3 py-1 bg-white rounded-xl text-xs font-bold text-doux"
                    >
                      Non, garder
                    </button>
                    <button
                      onClick={() => {
                        onResetProgress();
                        setConfirmReset(false);
                        onClose();
                      }}
                      className="px-3 py-1 bg-rose text-white rounded-xl text-xs font-bold"
                    >
                      Oui, effacer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
