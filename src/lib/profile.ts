/**
 * Profil de l'enfant : prénom + avatar, stockés UNIQUEMENT sur l'appareil.
 * Rien n'est envoyé au serveur (le prénom est inséré localement dans les textes).
 */
import { useCallback, useState } from 'react';

export interface Profile {
  name: string;
  avatar: string;
}

export const AVATARS = ['🦊', '🐼', '🦁', '🐸', '🐙', '🦄', '🐢', '🐧', '🐰', '🐻'];

const PROFILE_KEY = 'pulse_kids_profile_v3';
const DONE_KEY = 'pulse_kids_done_v3';

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* navigation privée : on garde en mémoire */
  }
}

/** Prénom : lettres, espaces, tirets, apostrophes ; 20 caractères max. */
export function cleanName(input: string): string {
  return input
    .replace(/[^\p{L}\p{M}' -]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 20)
    .replace(/^\p{L}/u, (c) => c.toUpperCase());
}

export function useProfile() {
  const [profile, setProfileState] = useState<Profile | null>(() => {
    const p = read<Profile>(PROFILE_KEY);
    if (p && cleanName(p.name)) {
      return { name: cleanName(p.name), avatar: AVATARS.includes(p.avatar) ? p.avatar : AVATARS[0] };
    }
    if (typeof window !== 'undefined' && window.location.search.includes('autostart=1')) {
      const defaultProf = { name: 'Léo', avatar: '🦊' };
      write(PROFILE_KEY, defaultProf);
      return defaultProf;
    }
    return null;
  });
  const setProfile = useCallback((p: Profile) => {
    const next = { name: cleanName(p.name), avatar: p.avatar };
    write(PROFILE_KEY, next);
    setProfileState(next);
  }, []);
  return { profile, setProfile };
}

export interface Badge {
  id: string;
  emoji: string;
  title: string;
  description: string;
  hint: string;
}

export const ALL_BADGES: Badge[] = [
  { id: 'first_tale', emoji: '📖', title: 'P’tit Lecteur', description: 'Tu as écouté ton tout premier conte !', hint: 'Écoute un conte de la bibliothèque.' },
  { id: 'first_game', emoji: '🧩', title: 'P’tit Joueur', description: 'Tu as réussi ta première activité !', hint: 'Réussis un jeu dans les activités.' },
  { id: 'games_5', emoji: '🧠', title: 'Génie des Jeux', description: '5 activités réussies avec brio !', hint: 'Réussis 5 jeux différents.' },
  { id: 'games_20', emoji: '🌟', title: 'Grand Savant', description: '20 activités réussies ! Champion !', hint: 'Réussis 20 activités.' },
  { id: 'first_soir', emoji: '🌙', title: 'Douce Nuit', description: 'Tu as écouté une histoire pour t’endormir.', hint: 'Écoute un conte du soir sous les étoiles.' },
  { id: 'first_video', emoji: '🎬', title: 'Cinéphile', description: 'Tu as regardé une vidéo du journal ou du monde.', hint: 'Regarde une vidéo de la bibliothèque.' },
  { id: 'artist', emoji: '🎨', title: 'Artiste Magique', description: 'Tu as créé un dessin dans l’atelier magique !', hint: 'Fais un dessin dans l’Atelier Dessin.' },
  { id: 'collector_10', emoji: '💎', title: 'P’tit Curieux', description: '10 découvertes accomplies dans Pulse Kids !', hint: 'Découvre 10 contenus au total.' },
  { id: 'collector_30', emoji: '🏆', title: 'Super Explorateur', description: '30 trésors découverts ! Félicitations !', hint: 'Découvre 30 contenus au total.' }
];

const FAVORITES_KEY = 'pulse_kids_favorites_v3';
const BADGES_KEY = 'pulse_kids_badges_v3';
const PARENT_SETTINGS_KEY = 'pulse_kids_parent_settings_v3';

export interface ParentSettings {
  speechSpeed: 'normal' | 'slow';
  screenTimeLimit: number; // in minutes (0 = disabled)
  soundMuted: boolean;
}

const DEFAULT_SETTINGS: ParentSettings = {
  speechSpeed: 'normal',
  screenTimeLimit: 0,
  soundMuted: false
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set(read<string[]>(FAVORITES_KEY) ?? []));
  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      write(FAVORITES_KEY, [...next]);
      return next;
    });
  }, []);
  return { favorites, toggleFavorite };
}

export function useBadges() {
  const [unlocked, setUnlocked] = useState<Set<string>>(() => new Set(read<string[]>(BADGES_KEY) ?? []));
  const unlockBadge = useCallback((id: string): boolean => {
    let wasNew = false;
    setUnlocked((prev) => {
      if (prev.has(id)) return prev;
      wasNew = true;
      const next = new Set(prev).add(id);
      write(BADGES_KEY, [...next]);
      return next;
    });
    return wasNew;
  }, []);
  return { unlocked, unlockBadge };
}

export function useParentSettings() {
  const [settings, setSettingsState] = useState<ParentSettings>(() => {
    const s = read<ParentSettings>(PARENT_SETTINGS_KEY);
    return { ...DEFAULT_SETTINGS, ...(s ?? {}) };
  });

  const updateSettings = useCallback((partial: Partial<ParentSettings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...partial };
      write(PARENT_SETTINGS_KEY, next);
      return next;
    });
  }, []);

  return { settings, updateSettings };
}

/** Contenus terminés (conte lu, activité réussie) → petite coche ✓. */
export function useDone() {
  const [done, setDone] = useState<Set<string>>(() => new Set(read<string[]>(DONE_KEY) ?? []));
  const markDone = useCallback((id: string) => {
    setDone((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev).add(id);
      write(DONE_KEY, [...next]);
      return next;
    });
  }, []);
  return { done, markDone };
}

/** Purge des données des versions précédentes (dont un ancien code PIN en clair). */
export function purgeLegacyStorage() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('pulse_kids_') && !k.endsWith('_v3'))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}
