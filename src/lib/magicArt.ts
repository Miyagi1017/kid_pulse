/**
 * Moteur de transformation magique pour le dessin des enfants
 * Analyse les traits, formes et couleurs du croquis de l'enfant
 * et génère une illustration magique surprise correspondante.
 */

import { videoPhoto } from '../data/videoImages';
import { illustrationFor } from '../data/illustrations';

export interface MagicArtResult {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  category: 'animaux' | 'espace' | 'magie' | 'vehicules' | 'nature';
  imageUrl: string;
  voicePraise: (name: string) => string;
  colorTone: string;
}

interface SketchAnalysis {
  hasDrawing: boolean;
  pixelCount: number;
  dominantColor: 'warm' | 'cool' | 'green' | 'pink' | 'purple' | 'dark' | 'neutral';
  aspectRatio: 'square' | 'tall' | 'wide';
}

/**
 * Analyse rapidement les pixels dessinés sur le canvas (sans latence)
 */
export function analyzeCanvasSketch(canvas: HTMLCanvasElement): SketchAnalysis {
  try {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      return { hasDrawing: true, pixelCount: 500, dominantColor: 'warm', aspectRatio: 'square' };
    }

    const w = canvas.width;
    const h = canvas.height;
    // Sample down to 80x80 for fast responsive analysis
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = 80;
    sampleCanvas.height = 80;
    const sCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
    if (!sCtx) {
      return { hasDrawing: true, pixelCount: 500, dominantColor: 'warm', aspectRatio: 'square' };
    }

    sCtx.drawImage(canvas, 0, 0, 80, 80);
    const imgData = sCtx.getImageData(0, 0, 80, 80);
    const data = imgData.data;

    let nonWhitePixels = 0;
    let minX = 80;
    let maxX = 0;
    let minY = 80;
    let maxY = 0;

    let sumR = 0;
    let sumG = 0;
    let sumB = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Ignore pure white or transparent background
      if (a > 30 && (r < 240 || g < 240 || b < 240)) {
        nonWhitePixels++;
        const pixelIndex = i / 4;
        const px = pixelIndex % 80;
        const py = Math.floor(pixelIndex / 80);

        if (px < minX) minX = px;
        if (px > maxX) maxX = px;
        if (py < minY) minY = py;
        if (py > maxY) maxY = py;

        sumR += r;
        sumG += g;
        sumB += b;
      }
    }

    const hasDrawing = nonWhitePixels > 15;
    const boundsW = Math.max(1, maxX - minX);
    const boundsH = Math.max(1, maxY - minY);
    const ratio = boundsW / boundsH;
    const aspectRatio: 'square' | 'tall' | 'wide' =
      ratio > 1.35 ? 'wide' : ratio < 0.75 ? 'tall' : 'square';

    let dominantColor: 'warm' | 'cool' | 'green' | 'pink' | 'purple' | 'dark' | 'neutral' = 'warm';
    if (nonWhitePixels > 0) {
      const avgR = sumR / nonWhitePixels;
      const avgG = sumG / nonWhitePixels;
      const avgB = sumB / nonWhitePixels;

      if (avgR > 180 && avgG > 140 && avgB < 120) {
        dominantColor = 'warm'; // Yellow/Orange
      } else if (avgB > avgR && avgB > avgG) {
        dominantColor = 'cool'; // Blue/Cyan
      } else if (avgG > avgR && avgG > avgB) {
        dominantColor = 'green';
      } else if (avgR > 200 && avgB > 140) {
        dominantColor = 'pink';
      } else if (avgR > 120 && avgB > 180) {
        dominantColor = 'purple';
      } else if (avgR < 80 && avgG < 80 && avgB < 80) {
        dominantColor = 'dark';
      }
    }

    return {
      hasDrawing,
      pixelCount: nonWhitePixels,
      dominantColor,
      aspectRatio
    };
  } catch {
    return { hasDrawing: true, pixelCount: 500, dominantColor: 'warm', aspectRatio: 'square' };
  }
}

// Catalogue d'œuvres magiques avec leurs vraies photos/illustrations
export const MAGIC_ART_CATALOG: MagicArtResult[] = [
  // --- ANIMAUX ---
  {
    id: 'magic-panda',
    title: 'Le Panda Gourmand de la Forêt de Bambous',
    subtitle: 'Tout rond, tout doux et plein de tendresse',
    emoji: '🐼',
    category: 'animaux',
    imageUrl: videoPhoto('video-animaux-13')?.url || illustrationFor('conte-01') || '',
    voicePraise: (name) => `Abracadabra ! Tes jolis traits ont donné naissance à un adorable panda géant, ${name} ! Il te sourit en mangeant du bambou !`,
    colorTone: '#2fc59a'
  },
  {
    id: 'magic-chaton',
    title: 'Le Chaton Magique aux Moustaches Dorées',
    subtitle: 'Il ronronne de joie devant ton dessin',
    emoji: '🐱',
    category: 'animaux',
    imageUrl: illustrationFor('conte-01') || videoPhoto('video-animaux-11')?.url || '',
    voicePraise: (name) => `Magie féerique ! Bravo ${name}, ton dessin s'est transformé en un petit chaton malicieux aux yeux pétillants !`,
    colorTone: '#ff7a59'
  },
  {
    id: 'magic-lion',
    title: 'Le Lionceau Roi de la Savane',
    subtitle: 'Une crinière dorée éclatante comme le soleil',
    emoji: '🦁',
    category: 'animaux',
    imageUrl: videoPhoto('video-animaux-11')?.url || '',
    voicePraise: (name) => `Formidable ${name} ! Tes couleurs vives ont réveillé un majestueux lionceau d'or dans la savane !`,
    colorTone: '#ffc83d'
  },
  {
    id: 'magic-dauphin',
    title: 'Le Dauphin des Eaux Émeraudes',
    subtitle: 'Un bond spectaculaire au-dessus des vagues',
    emoji: '🐬',
    category: 'animaux',
    imageUrl: videoPhoto('video-animaux-05')?.url || '',
    voicePraise: (name) => `Plouf magique ! Ton tracé a fait jaillir un magnifique dauphin argenté hors des flots bleus, ${name} !`,
    colorTone: '#4aa8ff'
  },
  {
    id: 'magic-tortue',
    title: 'La Tortue Paisible aux Écailles d’Opale',
    subtitle: 'Voyageuse millénaire des grands océans',
    emoji: '🐢',
    category: 'animaux',
    imageUrl: videoPhoto('video-animaux-07')?.url || '',
    voicePraise: (name) => `Regarde ${name} ! Ta belle forme ronde est devenue une tortue marine sage et protectrice !`,
    colorTone: '#2fc59a'
  },
  {
    id: 'magic-elephant',
    title: 'Le Petit Éléphanteau Arroseur',
    subtitle: 'Sa trompe projette une pluie d’étoiles d’eau',
    emoji: '🐘',
    category: 'animaux',
    imageUrl: videoPhoto('video-animaux-02')?.url || '',
    voicePraise: (name) => `Trompette magique ! Ton dessin a créé un grand éléphant bienveillant, félicitations ${name} !`,
    colorTone: '#8b7cf6'
  },
  {
    id: 'magic-baleine',
    title: 'La Baleine Bleue Chanteuse',
    subtitle: 'Reine des profondeurs océaniques',
    emoji: '🐳',
    category: 'animaux',
    imageUrl: videoPhoto('video-animaux-15')?.url || '',
    voicePraise: (name) => `Incroyable ${name} ! Ton croquis a donné vie à une gigantesque baleine bleue au cœur immense !`,
    colorTone: '#4aa8ff'
  },
  {
    id: 'magic-manchots',
    title: 'Les Manchots Patineurs de la Banquise',
    subtitle: 'Ils glissent sur le ventre dans la neige fraîche',
    emoji: '🐧',
    category: 'animaux',
    imageUrl: videoPhoto('video-animaux-01')?.url || '',
    voicePraise: (name) => `Brrr et Youpi ! Tes coups de crayon ont fait danser des petits manchots joyeux sur la banquise, ${name} !`,
    colorTone: '#4aa8ff'
  },
  {
    id: 'magic-papillon',
    title: 'Le Papillon aux Ailes Multicolores',
    subtitle: 'Il vole de fleur en fleur avec légèreté',
    emoji: '🦋',
    category: 'animaux',
    imageUrl: videoPhoto('video-animaux-06')?.url || '',
    voicePraise: (name) => `Un battement d'ailes enchanté ! Bravo ${name}, ton dessin s'est envolé comme un papillon féerique !`,
    colorTone: '#ff6fa8'
  },

  // --- ESPACE & CIEL ---
  {
    id: 'magic-fusee',
    title: 'La Super Fusée Stellaire',
    subtitle: 'Cap sur Mars et les confins de la galaxie',
    emoji: '🚀',
    category: 'espace',
    imageUrl: videoPhoto('video-espace-04')?.url || '',
    voicePraise: (name) => `Cinq, quatre, trois, deux, un... Décollage ! Ta création est devenue une puissante fusée interstellaire, ${name} !`,
    colorTone: '#ff7a59'
  },
  {
    id: 'magic-saturne',
    title: 'Saturne et ses Anneaux de Poussière d’Étoiles',
    subtitle: 'Un joyau cosmique brillant dans le vide céleste',
    emoji: '🪐',
    category: 'espace',
    imageUrl: videoPhoto('video-espace-03')?.url || '',
    voicePraise: (name) => `Magie de l'univers ! Ton dessin a matérialisé la mystérieuse planète Saturne avec ses anneaux dorés, ${name} !`,
    colorTone: '#ffc83d'
  },
  {
    id: 'magic-lune',
    title: 'La Douce Lune Bienveillante',
    subtitle: 'Elle veille sur le sommeil des enfants chaque nuit',
    emoji: '🌙',
    category: 'espace',
    imageUrl: videoPhoto('video-espace-01')?.url || illustrationFor('soir-01') || '',
    voicePraise: (name) => `Chut... Écoute la lune qui te remercie pour ce dessin doux et apaisant, ${name} !`,
    colorTone: '#8b7cf6'
  },
  {
    id: 'magic-aurore',
    title: 'L’Aurore Boréale Féerique',
    subtitle: 'Des voiles de lumière verte et rose dans la nuit',
    emoji: '🌌',
    category: 'espace',
    imageUrl: videoPhoto('video-espace-08')?.url || '',
    voicePraise: (name) => `Quel spectacle féerique ! Tes couleurs se sont transformées en une sublime aurore boréale dans le ciel, ${name} !`,
    colorTone: '#2fc59a'
  },
  {
    id: 'magic-terre',
    title: 'La Planète Bleue Éblouissante',
    subtitle: 'Notre belle maison vue depuis les étoiles',
    emoji: '🌍',
    category: 'espace',
    imageUrl: videoPhoto('video-espace-07')?.url || '',
    voicePraise: (name) => `Magnifique ${name} ! Regarde notre Terre toute ronde et bleue qui brille grâce à ton coup de pinceau !`,
    colorTone: '#4aa8ff'
  },

  // --- CONTES & MAGIE ---
  {
    id: 'magic-chateau',
    title: 'Le Château aux Mille Tourelles',
    subtitle: 'Là où commencent toutes les plus belles histoires',
    emoji: '🏰',
    category: 'magie',
    imageUrl: videoPhoto('video-monde-03')?.url || illustrationFor('conte-04') || '',
    voicePraise: (name) => `Il était une fois... Ton dessin a bâti un château de conte de fées étincelant sous le ciel, ${name} !`,
    colorTone: '#8b7cf6'
  },
  {
    id: 'magic-licorne',
    title: 'La Licorne aux Crins d’Arc-en-Ciel',
    subtitle: 'Créature magique aux sabots d’argent',
    emoji: '🦄',
    category: 'magie',
    imageUrl: illustrationFor('conte-02') || '',
    voicePraise: (name) => `Pure magie ! Une licorne enchantée vient de surgir de ton dessin pour te faire un clin d’œil, ${name} !`,
    colorTone: '#ff6fa8'
  },
  {
    id: 'magic-dragon',
    title: 'Le Petit Dragon Cracheur d’Étoiles',
    subtitle: 'Gardien secret des trésors de cristal',
    emoji: '🐉',
    category: 'magie',
    imageUrl: illustrationFor('conte-03') || '',
    voicePraise: (name) => `Wahou ${name} ! Ton esquisse a réveillé un gentil petit dragon qui souffle des étincelles dorées !`,
    colorTone: '#2fc59a'
  },
  {
    id: 'magic-foret',
    title: 'L’Arbre Millénaire des Fées',
    subtitle: 'Ses feuilles murmurent des chansons au vent',
    emoji: '🌳',
    category: 'magie',
    imageUrl: videoPhoto('video-nature-01')?.url || '',
    voicePraise: (name) => `Splendide ${name} ! Tes traits ont fait pousser un arbre enchanté digne des plus grands contes !`,
    colorTone: '#2fc59a'
  },

  // --- VÉHICULES ---
  {
    id: 'magic-train',
    title: 'Le Train à Vapeur Panache Blanc',
    subtitle: 'Tchou-tchou ! En route pour de grandes aventures',
    emoji: '🚂',
    category: 'vehicules',
    imageUrl: videoPhoto('video-metiers-02')?.url || '',
    voicePraise: (name) => `Tchou-tchou ! Tous à bord ! Ton dessin s'est transformé en une rutilante locomotive à vapeur, ${name} !`,
    colorTone: '#ff7a59'
  },
  {
    id: 'magic-pompier',
    title: 'Le Grand Camion des Pompiers Héros',
    subtitle: 'Pin-pon ! Toujours prêt à secourir avec bravoure',
    emoji: '🚒',
    category: 'vehicules',
    imageUrl: videoPhoto('video-metiers-01')?.url || '',
    voicePraise: (name) => `Pin-pon pin-pon ! Tu as créé le camion de pompiers le plus courageux du monde, bravo ${name} !`,
    colorTone: '#ff7a59'
  },
  {
    id: 'magic-bateau',
    title: 'Le Voilier des Mers du Sud',
    subtitle: 'Hissez les voiles au gré des vents doux',
    emoji: '⛵',
    category: 'vehicules',
    imageUrl: videoPhoto('video-nature-03')?.url || '',
    voicePraise: (name) => `Ohé moussaillon ! Ton coup de crayon est devenu un magnifique navire naviguant vers l'aventure, ${name} !`,
    colorTone: '#4aa8ff'
  },

  // --- NATURE & GOURMANDISES ---
  {
    id: 'magic-arcenciel',
    title: 'L’Arc-en-Ciel des Merveilles',
    subtitle: 'Le pont lumineux entre le soleil et la pluie',
    emoji: '🌈',
    category: 'nature',
    imageUrl: videoPhoto('video-nature-02')?.url || '',
    voicePraise: (name) => `Toutes les couleurs du ciel ! Ton dessin s'est déployé en un arc-en-ciel magique gigantesque, ${name} !`,
    colorTone: '#ffc83d'
  },
  {
    id: 'magic-fleurs',
    title: 'La Prairie aux Mille Fleurs Parfumées',
    subtitle: 'Un tapis éclatant de marguerites et tournesols',
    emoji: '🌻',
    category: 'nature',
    imageUrl: videoPhoto('video-nature-10')?.url || '',
    voicePraise: (name) => `Quelle merveille ${name} ! Tes traits ont fait éclore un jardin féerique plein de couleurs et de papillons !`,
    colorTone: '#ffc83d'
  },
  {
    id: 'magic-montagnes',
    title: 'Les Hauts Sommets Enneigés',
    subtitle: 'Là où les aigles volent au-dessus des nuages',
    emoji: '⛰️',
    category: 'nature',
    imageUrl: videoPhoto('video-nature-09')?.url || '',
    voicePraise: (name) => `Vertigineux et grandiose ! Ton dessin est devenu une majestueuse montagne touchant le ciel, ${name} !`,
    colorTone: '#4aa8ff'
  }
];

/**
 * Génère une œuvre magique surprise adaptée au dessin de l'enfant
 */
export function generateMagicArtwork(
  canvas: HTMLCanvasElement,
  activeTemplateId?: string,
  excludeId?: string
): MagicArtResult {
  const analysis = analyzeCanvasSketch(canvas);

  let pool = MAGIC_ART_CATALOG.filter((item) => item.imageUrl && item.id !== excludeId);
  if (pool.length === 0) pool = MAGIC_ART_CATALOG;

  // 1. Si un modèle spécifique était choisi, privilégier la catégorie ou le sujet correspondant
  if (activeTemplateId) {
    if (activeTemplateId.startsWith('animaux')) {
      const match = pool.filter((i) => i.category === 'animaux');
      if (match.length) pool = match;
    } else if (activeTemplateId.startsWith('espace')) {
      const match = pool.filter((i) => i.category === 'espace');
      if (match.length) pool = match;
    } else if (activeTemplateId.startsWith('magie')) {
      const match = pool.filter((i) => i.category === 'magie');
      if (match.length) pool = match;
    } else if (activeTemplateId.startsWith('vehicules')) {
      const match = pool.filter((i) => i.category === 'vehicules');
      if (match.length) pool = match;
    } else if (activeTemplateId.startsWith('nature')) {
      const match = pool.filter((i) => i.category === 'nature');
      if (match.length) pool = match;
    }
  } else {
    // 2. Sinon, orienter selon la couleur dominante détectée dans le dessin
    if (analysis.dominantColor === 'cool') {
      const blues = pool.filter((i) => i.category === 'espace' || i.id.includes('dauphin') || i.id.includes('baleine') || i.id.includes('terre'));
      if (blues.length) pool = blues;
    } else if (analysis.dominantColor === 'warm') {
      const warms = pool.filter((i) => i.id.includes('lion') || i.id.includes('saturne') || i.id.includes('arcenciel') || i.id.includes('fleurs'));
      if (warms.length) pool = warms;
    } else if (analysis.dominantColor === 'green') {
      const greens = pool.filter((i) => i.id.includes('tortue') || i.id.includes('foret') || i.id.includes('dragon') || i.id.includes('panda'));
      if (greens.length) pool = greens;
    } else if (analysis.dominantColor === 'purple' || analysis.dominantColor === 'pink') {
      const magicPinks = pool.filter((i) => i.category === 'magie' || i.id.includes('licorne') || i.id.includes('papillon') || i.id.includes('chateau'));
      if (magicPinks.length) pool = magicPinks;
    }
  }

  // Sélection aléatoire avec une touche de surprise
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
