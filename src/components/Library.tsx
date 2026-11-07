import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Shuffle, Star } from 'lucide-react';
import { SECTION_STYLE, TopBar, type Section } from './ui';
import { soundEffects } from '../utils/soundEffects';

export interface LibraryItem {
  id: string;
  emoji: string;
  title: string;
  category?: string;
  image?: string;
}

export type CategoryLabels = Record<string, { label: string; emoji: string }>;

/** Grille des 50 contenus d'un espace : gros emojis, titre court, coche quand c'est fait. */
export function Library({
  section,
  items: allItems,
  done,
  favorites,
  onBack,
  onPick,
  onToggleFavorite,
  categories,
  intro,
  action
}: {
  section: Section;
  items: LibraryItem[];
  done: Set<string>;
  favorites?: Set<string>;
  onBack: () => void;
  onPick: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  categories?: CategoryLabels;
  intro?: ReactNode;
  action?: { label: string; onClick: () => void };
}) {
  const st = SECTION_STYLE[section];
  const [filter, setFilter] = useState<string | null>(null);

  const items =
    filter === 'favorites'
      ? allItems.filter((i) => favorites?.has(i.id))
      : filter
      ? allItems.filter((i) => i.category === filter)
      : allItems;

  const present = categories ? Object.keys(categories).filter((c) => allItems.some((i) => i.category === c)) : [];
  const dark = section === 'soir';

  const pick = (id: string) => {
    soundEffects.playPop();
    onPick(id);
  };

  const surprise = () => {
    const pool = items.filter((i) => !done.has(i.id));
    const list = pool.length ? pool : items;
    if (list.length) pick(list[Math.floor(Math.random() * list.length)].id);
  };

  const favCount = favorites ? allItems.filter((i) => favorites.has(i.id)).length : 0;

  return (
    <div className={`min-h-dvh ${dark ? 'bg-nuit text-white' : ''}`}>
      <TopBar
        title={st.label}
        emoji={st.emoji}
        onBack={onBack}
        dark={dark}
        right={
          action ? (
            <button onClick={action.onClick} className={`press shadow-bonbon h-12 px-4 rounded-2xl ${st.strong} text-white font-semibold flex items-center gap-2`}>
              {action.label}
            </button>
          ) : (
            <button onClick={surprise} className={`press shadow-bonbon h-12 px-4 rounded-2xl ${st.strong} ${section === 'contes' ? 'text-encre' : 'text-white'} font-semibold flex items-center gap-2`}>
              <Shuffle className="w-5 h-5" /> <span className="hidden sm:inline">Surprise !</span>
            </button>
          )
        }
      />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-10 pt-2">
        <p className={`mb-4 ${dark ? 'text-white/70' : 'text-doux'}`}>
          {done.size ? `${[...done].filter((d) => items.some((i) => i.id === d)).length} sur ${items.length} déjà faits. ` : ''}Touche une image pour commencer !
        </p>
        {intro}

        {/* Filters bar */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-3 -mx-4 px-4" role="tablist" aria-label="Filtres et thèmes">
          <button
            role="tab"
            aria-selected={filter === null}
            onClick={() => {
              soundEffects.playPop();
              setFilter(null);
            }}
            className={`press shrink-0 rounded-full px-4 py-2 font-semibold whitespace-nowrap ${
              filter === null ? `${st.strong} text-white shadow-bonbon` : dark ? 'bg-white/15 text-white' : 'bg-white text-encre'
            }`}
          >
            🎲 Tout mélangé
          </button>

          {favCount > 0 && (
            <button
              role="tab"
              aria-selected={filter === 'favorites'}
              onClick={() => {
                soundEffects.playPop();
                setFilter('favorites');
              }}
              className={`press shrink-0 rounded-full px-4 py-2 font-semibold whitespace-nowrap ${
                filter === 'favorites' ? 'bg-soleil text-encre shadow-bonbon' : dark ? 'bg-white/15 text-white' : 'bg-white text-encre'
              }`}
            >
              ⭐ Préférés ({favCount})
            </button>
          )}

          {categories &&
            present.map((c) => {
              const active = filter === c;
              const info = categories[c];
              return (
                <button
                  key={c}
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    soundEffects.playPop();
                    setFilter(c);
                  }}
                  className={`press shrink-0 rounded-full px-4 py-2 font-semibold whitespace-nowrap ${
                    active ? `${st.strong} text-white shadow-bonbon` : dark ? 'bg-white/15 text-white' : 'bg-white text-encre'
                  }`}
                >
                  {info.emoji} {info.label}
                </button>
              );
            })}
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center gap-3">
            <span className="text-6xl">⭐</span>
            <h3 className="text-xl font-bold">Pas encore de préférés ici !</h3>
            <p className={`text-sm max-w-sm ${dark ? 'text-white/70' : 'text-doux'}`}>
              Touche la petite étoile sur un conte ou un jeu pour le garder dans tes préférés.
            </p>
            <button
              onClick={() => setFilter(null)}
              className="press mt-2 px-5 py-2.5 rounded-2xl bg-white text-encre shadow-bonbon font-bold text-sm"
            >
              Voir tous les contenus
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {items.map((item, i) => {
              const isDone = done.has(item.id);
              const isFav = favorites?.has(item.id);
              return (
                <motion.li key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 12) * 0.03 }}>
                  <button
                    onClick={() => pick(item.id)}
                    className={`press shadow-bonbon relative w-full h-full rounded-3xl p-4 text-left flex flex-col gap-2 ${dark ? 'bg-white/10' : 'bg-white'}`}
                  >
                    {onToggleFavorite && (
                      <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundEffects.playPop();
                          onToggleFavorite(item.id);
                        }}
                        className={`absolute top-2 left-2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                          isFav
                            ? 'bg-soleil text-encre shadow'
                            : dark
                            ? 'bg-black/40 text-white/60 hover:text-white'
                            : 'bg-creme text-doux/60 hover:text-soleil'
                        }`}
                        aria-label={isFav ? 'Retirer des préférés' : 'Ajouter aux préférés'}
                      >
                        <Star className={`w-5 h-5 ${isFav ? 'fill-encre' : ''}`} />
                      </span>
                    )}

                    {isDone && (
                      <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-menthe text-white text-sm font-bold flex items-center justify-center shadow" aria-label="Déjà fait">
                        ✓
                      </span>
                    )}

                    {item.image ? (
                      <img src={item.image} alt="" loading="lazy" decoding="async" className="w-full aspect-[4/3] object-cover rounded-2xl" />
                    ) : (
                      <span className={`w-16 h-16 rounded-2xl ${dark ? 'bg-white/10' : st.soft} flex items-center justify-center text-4xl`} aria-hidden>
                        {item.emoji}
                      </span>
                    )}
                    <span className="font-semibold leading-snug">{item.title}</span>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
