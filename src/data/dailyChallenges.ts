/**
 * 60 défis et idées magiques pour les activités de tous les jours
 * Observation, mime, bienveillance, chanson, imagination, mouvement.
 */

export interface DailyChallenge {
  id: string;
  category: 'mouvement' | 'observation' | 'imagination' | 'gentillesse' | 'musique';
  title: string;
  emoji: string;
  description: string;
  spokenText: string;
}

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'ch-1',
    category: 'mouvement',
    title: 'La danse du flamant rose',
    emoji: '🦩',
    description: 'Tiens-toi en équilibre sur un seul pied en battant doucement des ailes pendant 5 secondes !',
    spokenText: 'Défi magique : tiens-toi en équilibre sur un seul pied comme un flamant rose pendant 5 secondes ! Un, deux, trois, quatre, cinq ! Bravo !'
  },
  {
    id: 'ch-2',
    category: 'observation',
    title: 'La chasse aux trésors bleus',
    emoji: '🔍',
    description: 'Regarde autour de toi dans la pièce : trouve 3 objets de couleur bleue !',
    spokenText: 'Mission secrète d’explorateur : regarde bien autour de toi et trouve trois objets bleus !'
  },
  {
    id: 'ch-3',
    category: 'gentillesse',
    title: 'Le super câlin magique',
    emoji: '🤗',
    description: 'Offre le plus doux et chaleureux des câlins à maman, papa ou à ton doudou préféré.',
    spokenText: 'Mission douceur : fais le plus gros et doux câlin du monde à quelqu’un que tu aimes très fort !'
  },
  {
    id: 'ch-4',
    category: 'imagination',
    title: 'L’animal rigolo inventé',
    emoji: '🦄',
    description: 'Invente un animal magique qui a la tête d’un chat, le corps d’un dauphin et des ailes d’oiseau !',
    spokenText: 'Imagine un animal magique incroyable avec une tête de chat et des ailes d’oiseau ! Quel son fait-il ?'
  },
  {
    id: 'ch-5',
    category: 'mouvement',
    title: 'Le saut de la grenouille',
    emoji: '🐸',
    description: 'Accroupis-toi et fais 3 grands bonds de grenouille en faisant Coâ-coâ !',
    spokenText: 'Fais trois grands bonds de grenouille en coassant ! Coâ, coâ, coâ !'
  },
  {
    id: 'ch-6',
    category: 'musique',
    title: 'Le tambour de cuisine',
    emoji: '🥁',
    description: 'Tapote un petit rythme joyeux sur la table avec tes doigts comme un écureuil.',
    spokenText: 'Tapote un rythme joyeux avec le bout de tes doigts, comme une petite pluie d’été !'
  },
  {
    id: 'ch-7',
    category: 'observation',
    title: 'Les formes dans les nuages',
    emoji: '☁️',
    description: 'Regarde par la fenêtre ou imagine un gros nuage : à quel animal te fait-il penser ?',
    spokenText: 'Regarde le ciel : à quel animal ressemble le plus gros nuage que tu vois ?'
  },
  {
    id: 'ch-8',
    category: 'mouvement',
    title: 'La statue immobile',
    emoji: '🗿',
    description: 'Fais une grimace rigolote puis fige-toi comme une statue de glace sans bouger pendant 4 secondes !',
    spokenText: 'Fais une grimace rigolote puis ne bouge plus du tout comme une statue ! Un, deux, trois, statue !'
  },
  {
    id: 'ch-9',
    category: 'gentillesse',
    title: 'Le mot doux secret',
    emoji: '💌',
    description: 'Dis à voix haute le mot le plus gentil que tu connaisses : Merci, Je t’aime ou Bravo !',
    spokenText: 'Quel est ton mot magique préféré ? Dis-le avec ton plus beau sourire !'
  },
  {
    id: 'ch-10',
    category: 'mouvement',
    title: 'La marche du petit robot',
    emoji: '🤖',
    description: 'Marche sur 5 pas en bougeant tes bras de façon mécanique comme un robot rigolo : Bip-bop !',
    spokenText: 'Transforme-toi en robot : bip-bip bop ! Fais cinq pas rigolos !'
  },
  {
    id: 'ch-11',
    category: 'imagination',
    title: 'La recette de potion magique',
    emoji: '🥣',
    description: 'Mélange dans ton bol imaginaire : 2 étoiles dorées, un éclat de rire et une goutte de rosée !',
    spokenText: 'Préparons une potion magique qui donne le sourire : tourne trois fois ta cuillère imaginaire !'
  },
  {
    id: 'ch-12',
    category: 'mouvement',
    title: 'Le bâillement du lionceau',
    emoji: '🦁',
    description: 'Ouvre grand la bouche pour faire le plus grand et relaxant étirement de lionceau endormi.',
    spokenText: 'Étire tes bras très haut vers le plafond et fais un grand bâillement comme un lionceau qui se réveille !'
  },
  {
    id: 'ch-13',
    category: 'observation',
    title: 'Les objets ronds',
    emoji: '⚽',
    description: 'Compte 3 objets tout ronds autour de toi : une pendule, une assiette, un bouton...',
    spokenText: 'Ouvre grand tes yeux : trouve trois objets ronds comme des petits soleils !'
  },
  {
    id: 'ch-14',
    category: 'musique',
    title: 'Le murmure de la brise',
    emoji: '🌬️',
    description: 'Souffle doucement entre tes lèvres pour faire le doux bruit du vent d’automne dans les feuilles.',
    spokenText: 'Fais le bruit du vent tout doux qui caresse les feuilles des arbres : chhhhh...'
  },
  {
    id: 'ch-15',
    category: 'gentillesse',
    title: 'Le sourire miroir',
    emoji: '😄',
    description: 'Regarde quelqu’un ou un miroir et fais le plus grand sourire éclatant de toute ta vie !',
    spokenText: 'Montre ton plus beau sourire ! Les sourires sont magiques, ils rendent tout le monde heureux !'
  },
  {
    id: 'ch-16',
    category: 'mouvement',
    title: 'La fusée qui décolle',
    emoji: '🚀',
    description: 'Accroupis-toi, compte à rebours 3, 2, 1 et saute en l’air en levant les bras : Décollage !',
    spokenText: 'Trois, deux, un... Décollage de la fusée ! Saute très haut !'
  },
  {
    id: 'ch-17',
    category: 'imagination',
    title: 'Le voyage sur la lune',
    emoji: '🌙',
    description: 'Imagine que tu marches au ralenti sur la lune sans gravité : flotte doucement d’un pas à l’autre.',
    spokenText: 'Tu marches sur la lune en apesanteur : fais des pas légers comme une plume !'
  },
  {
    id: 'ch-18',
    category: 'observation',
    title: 'Le bruit le plus discret',
    emoji: '👂',
    description: 'Ferme les yeux pendant 5 secondes et écoute : quel est le petit son que tu entends ?',
    spokenText: 'Chut... Ferme les yeux et écoute le son le plus discret autour de toi.'
  },
  {
    id: 'ch-19',
    category: 'mouvement',
    title: 'La nageoire du poisson rouge',
    emoji: '🐠',
    description: 'Ondule avec tes mains comme des petites nageoires de poisson qui nagent dans l’eau claire.',
    spokenText: 'Fais nager tes deux mains comme des petits poissons qui se faufilent entre les coraux !'
  },
  {
    id: 'ch-20',
    category: 'gentillesse',
    title: 'Le coup de main d’as',
    emoji: '✨',
    description: 'Range un jouet ou un coussin à sa place pour aider à garder la maison jolie !',
    spokenText: 'Mission super-héros : range un petit objet à sa place pour faire briller la pièce !'
  }
];

export function getTodayChallenge(): DailyChallenge {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];
}
