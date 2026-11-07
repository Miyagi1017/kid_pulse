/**
 * 55+ Sujets et modèles de dessin pour l'atelier créatif des enfants
 * Chaque modèle propose un sujet inspirant, une lecture audio du thème
 * et un tracé de guidage en pointillés doux sur le canvas.
 */

export interface DrawingTemplate {
  id: string;
  category: 'animaux' | 'espace' | 'magie' | 'vehicules' | 'nature';
  title: string;
  emoji: string;
  prompt: string;
  drawGuide: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

export const TEMPLATE_CATEGORIES = [
  { id: 'tous', label: 'Tout voir', emoji: '🌟' },
  { id: 'animaux', label: 'Animaux', emoji: '🐼' },
  { id: 'espace', label: 'Espace & Ciel', emoji: '🚀' },
  { id: 'magie', label: 'Contes & Féerie', emoji: '🦄' },
  { id: 'vehicules', label: 'Véhicules', emoji: '🚗' },
  { id: 'nature', label: 'Nature & Délices', emoji: '🍓' }
] as const;

function setupGuideStyle(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.strokeStyle = '#c4b5fd'; // Soft lavender guide
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 8]);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

function restoreGuideStyle(ctx: CanvasRenderingContext2D) {
  ctx.restore();
}

export const DRAWING_TEMPLATES: DrawingTemplate[] = [
  // --- ANIMAUX (11) ---
  {
    id: 'animaux-chaton',
    category: 'animaux',
    title: 'Le chaton joueur',
    emoji: '🐱',
    prompt: 'Dessinons un petit chaton joueur avec de grandes oreilles et de longues moustaches !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.22;
      // Head
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      // Ears
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.7, cy - r * 0.6);
      ctx.lineTo(cx - r * 0.8, cy - r * 1.3);
      ctx.lineTo(cx - r * 0.2, cy - r * 0.9);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + r * 0.7, cy - r * 0.6);
      ctx.lineTo(cx + r * 0.8, cy - r * 1.3);
      ctx.lineTo(cx + r * 0.2, cy - r * 0.9);
      ctx.stroke();
      // Eyes
      ctx.beginPath();
      ctx.arc(cx - r * 0.35, cy - r * 0.1, r * 0.12, 0, Math.PI * 2);
      ctx.arc(cx + r * 0.35, cy - r * 0.1, r * 0.12, 0, Math.PI * 2);
      ctx.stroke();
      // Nose & mouth
      ctx.beginPath();
      ctx.moveTo(cx, cy + r * 0.15);
      ctx.lineTo(cx - r * 0.1, cy + r * 0.05);
      ctx.lineTo(cx + r * 0.1, cy + r * 0.05);
      ctx.closePath();
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'animaux-panda',
    category: 'animaux',
    title: 'Le panda géant',
    emoji: '🐼',
    prompt: 'Dessinons un gentil panda tout rond qui croque du bambou frais !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.24;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      // Panda round ears
      ctx.beginPath();
      ctx.arc(cx - r * 0.75, cy - r * 0.75, r * 0.3, 0, Math.PI * 2);
      ctx.arc(cx + r * 0.75, cy - r * 0.75, r * 0.3, 0, Math.PI * 2);
      ctx.stroke();
      // Eye patches
      ctx.beginPath();
      ctx.ellipse(cx - r * 0.35, cy - r * 0.05, r * 0.22, r * 0.16, -0.2, 0, Math.PI * 2);
      ctx.ellipse(cx + r * 0.35, cy - r * 0.05, r * 0.22, r * 0.16, 0.2, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'animaux-lionceau',
    category: 'animaux',
    title: 'Le petit lion roi',
    emoji: '🦁',
    prompt: 'Dessinons le roi des animaux avec une magnifique crinière dorée en soleil !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.2;
      // Mane (sun-like flower)
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.5, 0, Math.PI * 2);
      ctx.stroke();
      // Face
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'animaux-dauphin',
    category: 'animaux',
    title: 'Le dauphin sauteur',
    emoji: '🐬',
    prompt: 'Dessinons un joyeux dauphin qui saute au-dessus des vagues de l’océan !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.min(w, h) * 0.35, Math.min(w, h) * 0.18, -0.25, 0, Math.PI * 2);
      ctx.stroke();
      // Fin
      ctx.beginPath();
      ctx.moveTo(cx, cy - Math.min(w, h) * 0.16);
      ctx.lineTo(cx - 20, cy - Math.min(w, h) * 0.3);
      ctx.lineTo(cx + 30, cy - Math.min(w, h) * 0.12);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'animaux-tortue',
    category: 'animaux',
    title: 'La tortue marine',
    emoji: '🐢',
    prompt: 'Dessinons une tortue paisible avec une grande carapace aux motifs d’écailles !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.22;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 1.2, r * 0.9, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Head
      ctx.beginPath();
      ctx.arc(cx + r * 1.4, cy, r * 0.35, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'animaux-koala',
    category: 'animaux',
    title: 'Le koala câlin',
    emoji: '🐨',
    prompt: 'Dessinons un petit koala tout doux accroché à sa branche d’eucalyptus !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.22;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx - r * 0.9, cy - r * 0.5, r * 0.35, 0, Math.PI * 2);
      ctx.arc(cx + r * 0.9, cy - r * 0.5, r * 0.35, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'animaux-renard',
    category: 'animaux',
    title: 'Le renard malicieux',
    emoji: '🦊',
    prompt: 'Dessinons un renardeau roux avec sa queue touffue au bout blanc !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy + 60);
      ctx.lineTo(cx - 80, cy - 40);
      ctx.lineTo(cx + 80, cy - 40);
      ctx.closePath();
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'animaux-lapin',
    category: 'animaux',
    title: 'Le lapin bondissant',
    emoji: '🐰',
    prompt: 'Dessinons un lapin rigolo aux très longues oreilles qui adore les carottes !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2 + 30;
      const r = Math.min(w, h) * 0.2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx - r * 0.4, cy - r * 1.4, r * 0.2, r * 0.7, -0.15, 0, Math.PI * 2);
      ctx.ellipse(cx + r * 0.4, cy - r * 1.4, r * 0.2, r * 0.7, 0.15, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'animaux-grenouille',
    category: 'animaux',
    title: 'La grenouille coasseuse',
    emoji: '🐸',
    prompt: 'Dessinons une grenouille verte assise sur son nénuphar au milieu de l’étang !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.22;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 1.2, r * 0.8, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx - r * 0.6, cy - r * 0.7, r * 0.35, 0, Math.PI * 2);
      ctx.arc(cx + r * 0.6, cy - r * 0.7, r * 0.35, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'animaux-elephant',
    category: 'animaux',
    title: 'L’éléphanteau joyeux',
    emoji: '🐘',
    prompt: 'Dessinons un petit éléphant avec une grande trompe qui lance de l’eau !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.22;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx - r * 0.9, cy, r * 0.45, r * 0.7, 0, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'animaux-dino',
    category: 'animaux',
    title: 'Le gentil diplodocus',
    emoji: '🦕',
    prompt: 'Dessinons un gentil dinosaure herbivore au cou très très long !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 40, 90, 60, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 70, cy + 20);
      ctx.quadraticCurveTo(cx - 100, cy - 80, cx - 60, cy - 120);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },

  // --- ESPACE & CIEL (10) ---
  {
    id: 'espace-fusee',
    category: 'espace',
    title: 'La fusée spatiale',
    emoji: '🚀',
    prompt: 'Trois, deux, un, décollage ! Dessinons une fusée qui file vers les étoiles !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 120);
      ctx.quadraticCurveTo(cx + 60, cy, cx + 50, cy + 90);
      ctx.lineTo(cx - 50, cy + 90);
      ctx.quadraticCurveTo(cx - 60, cy, cx, cy - 120);
      ctx.stroke();
      // Porthole
      ctx.beginPath();
      ctx.arc(cx, cy - 10, 28, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'espace-saturne',
    category: 'espace',
    title: 'La planète aux anneaux',
    emoji: '🪐',
    prompt: 'Dessinons une planète mystérieuse entourée d’un grand anneau brillant !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.18;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 2.2, r * 0.5, -0.3, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'espace-etoile',
    category: 'espace',
    title: 'L’étoile scintillante',
    emoji: '⭐',
    prompt: 'Dessinons une grande étoile à cinq branches qui illumine toute la nuit !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      const rOut = Math.min(w, h) * 0.28;
      const rIn = rOut * 0.45;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const rad = (i * Math.PI) / 5 - Math.PI / 2;
        const radius = i % 2 === 0 ? rOut : rIn;
        const x = cx + Math.cos(rad) * radius;
        const y = cy + Math.sin(rad) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'espace-lune',
    category: 'espace',
    title: 'Le croissant de lune',
    emoji: '🌙',
    prompt: 'Dessinons un beau croissant de lune endormi avec un bonnet de nuit !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.25;
      ctx.beginPath();
      ctx.arc(cx, cy, r, -0.4 * Math.PI, 0.7 * Math.PI);
      ctx.quadraticCurveTo(cx - r * 0.2, cy, cx + r * 0.3, cy - r * 0.95);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'espace-soleil',
    category: 'espace',
    title: 'Le soleil souriant',
    emoji: '☀️',
    prompt: 'Dessinons un soleil radieux avec de grands rayons chauds et des lunettes de soleil !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.18;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * (r * 1.2), cy + Math.sin(ang) * (r * 1.2));
        ctx.lineTo(cx + Math.cos(ang) * (r * 1.6), cy + Math.sin(ang) * (r * 1.6));
        ctx.stroke();
      }
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'espace-arcenciel',
    category: 'espace',
    title: 'L’arc-en-ciel géant',
    emoji: '🌈',
    prompt: 'Dessinons un grand arc-en-ciel avec toutes ses couleurs magiques qui traversent le ciel !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h * 0.75;
      [140, 110, 80].forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI, 0);
        ctx.stroke();
      });
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'espace-nuage',
    category: 'espace',
    title: 'Le nuage doux',
    emoji: '☁️',
    prompt: 'Dessinons un nuage tout doux comme de la barbe à papa avec des gouttes d’eau !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.arc(cx - 50, cy, 40, 0, Math.PI * 2);
      ctx.arc(cx, cy - 30, 50, 0, Math.PI * 2);
      ctx.arc(cx + 50, cy, 40, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'espace-soucoupe',
    category: 'espace',
    title: 'La soucoupe volante',
    emoji: '🛸',
    prompt: 'Dessinons une soucoupe venue d’une galaxie lointaine avec un petit extraterrestre rigolo !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 120, 40, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy - 20, 50, Math.PI, 0);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'espace-comete',
    category: 'espace',
    title: 'La comète filante',
    emoji: '☄️',
    prompt: 'Fais un vœu ! Dessinons une comète étincelante avec sa traînée dorée !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w * 0.35;
      const cy = h * 0.35;
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 35, cy + 20);
      ctx.lineTo(w * 0.8, h * 0.7);
      ctx.moveTo(cx + 20, cy + 35);
      ctx.lineTo(w * 0.7, h * 0.8);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'espace-astronaute',
    category: 'espace',
    title: 'Le casque d’astronaute',
    emoji: '👨‍🚀',
    prompt: 'Dessinons le casque d’un astronaute qui flotte en apesanteur dans l’espace !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 90, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(cx - 60, cy - 35, 120, 70, 20);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },

  // --- CONTES & FÉERIE (11) ---
  {
    id: 'magie-chateau',
    category: 'magie',
    title: 'Le château de conte',
    emoji: '🏰',
    prompt: 'Il était une fois... Dessinons un immense château féerique avec ses tours pointues et ses drapeaux !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.strokeRect(cx - 80, cy - 40, 160, 100);
      ctx.strokeRect(cx - 120, cy - 80, 40, 140);
      ctx.strokeRect(cx + 80, cy - 80, 40, 140);
      // Roof triangles
      ctx.beginPath();
      ctx.moveTo(cx - 130, cy - 80);
      ctx.lineTo(cx - 100, cy - 130);
      ctx.lineTo(cx - 70, cy - 80);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 70, cy - 80);
      ctx.lineTo(cx + 100, cy - 130);
      ctx.lineTo(cx + 130, cy - 80);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'magie-licorne',
    category: 'magie',
    title: 'La licorne enchantée',
    emoji: '🦄',
    prompt: 'Dessinons une licorne magique avec sa corne torsadée et sa crinière aux reflets d’arc-en-ciel !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 70, 0, Math.PI * 2);
      ctx.stroke();
      // Horn
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy - 65);
      ctx.lineTo(cx, cy - 140);
      ctx.lineTo(cx + 20, cy - 65);
      ctx.closePath();
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'magie-couronne',
    category: 'magie',
    title: 'La couronne royale',
    emoji: '👑',
    prompt: 'Dessinons une couronne royale ornée de rubis, de saphirs et de diamants scintillants !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.moveTo(cx - 90, cy + 40);
      ctx.lineTo(cx - 90, cy - 20);
      ctx.lineTo(cx - 45, cy + 10);
      ctx.lineTo(cx, cy - 40);
      ctx.lineTo(cx + 45, cy + 10);
      ctx.lineTo(cx + 90, cy - 20);
      ctx.lineTo(cx + 90, cy + 40);
      ctx.closePath();
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'magie-dragon',
    category: 'magie',
    title: 'Le dragon farceur',
    emoji: '🐉',
    prompt: 'Dessinons un petit dragon rigolo qui souffle des bulles de savon multicolores !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 80, 60, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Wing
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy - 50);
      ctx.lineTo(cx - 60, cy - 110);
      ctx.lineTo(cx + 30, cy - 60);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'magie-tresor',
    category: 'magie',
    title: 'Le coffre aux trésors',
    emoji: '💎',
    prompt: 'Dessinons un coffre de pirate rempli de pièces d’or et de pierres précieuses étincelantes !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.strokeRect(cx - 90, cy - 10, 180, 80);
      ctx.beginPath();
      ctx.arc(cx, cy - 10, 90, Math.PI, 0);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'magie-baguette',
    category: 'magie',
    title: 'La baguette de fée',
    emoji: '🪄',
    prompt: 'Abracadabra ! Dessinons une baguette magique qui projette des étincelles dorées !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.moveTo(cx - 60, cy + 90);
      ctx.lineTo(cx + 50, cy - 40);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 60, cy - 50, 25, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'magie-champignon',
    category: 'magie',
    title: 'La maison champignon',
    emoji: '🍄',
    prompt: 'Dessinons la maison champignon des petits lutins avec une porte ronde et des pois blancs !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.strokeRect(cx - 40, cy, 80, 80);
      ctx.beginPath();
      ctx.arc(cx, cy, 90, Math.PI, 0);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'magie-chaudron',
    category: 'magie',
    title: 'Le chaudron magique',
    emoji: '✨',
    prompt: 'Dessinons une potion magique bouillonnante pleine d’étoiles et de bulles enchantées !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.arc(cx, cy + 20, 80, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, cy + 20, 85, 25, 0, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'magie-fee',
    category: 'magie',
    title: 'Les ailes de fée',
    emoji: '🧚',
    prompt: 'Dessinons de grandes ailes de fée translucides et saupoudrées de poussière magique !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.ellipse(cx - 60, cy - 30, 60, 40, -0.4, 0, Math.PI * 2);
      ctx.ellipse(cx + 60, cy - 30, 60, 40, 0.4, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'magie-lutin',
    category: 'magie',
    title: 'Le bonnet pointu de lutin',
    emoji: '🧝',
    prompt: 'Dessinons le bonnet de lutin de la forêt avec son grelot qui fait tinter la clochette !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.moveTo(cx - 80, cy + 50);
      ctx.quadraticCurveTo(cx - 30, cy - 80, cx + 70, cy - 100);
      ctx.quadraticCurveTo(cx + 20, cy - 20, cx + 80, cy + 50);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 70, cy - 100, 15, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'magie-arbreenchante',
    category: 'magie',
    title: 'L’arbre qui parle',
    emoji: '🌳',
    prompt: 'Dessinons un vieil arbre bienveillant aux branches pleines de feuilles dorées qui sourit !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.strokeRect(cx - 30, cy, 60, 90);
      ctx.beginPath();
      ctx.arc(cx, cy - 30, 85, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },

  // --- VÉHICULES (11) ---
  {
    id: 'vehicules-voiture',
    category: 'vehicules',
    title: 'La petite voiture de course',
    emoji: '🚗',
    prompt: 'Vroum vroum ! Dessinons une voiture de course rouge vif avec son numéro de champion !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.roundRect(cx - 100, cy, 200, 50, 15);
      ctx.roundRect(cx - 50, cy - 40, 100, 40, 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx - 60, cy + 50, 22, 0, Math.PI * 2);
      ctx.arc(cx + 60, cy + 50, 22, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'vehicules-tracteur',
    category: 'vehicules',
    title: 'Le tracteur de la ferme',
    emoji: '🚜',
    prompt: 'Pout pout pout ! Dessinons un solide tracteur vert qui laboure les champs de blé !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.strokeRect(cx - 80, cy - 30, 70, 60);
      ctx.strokeRect(cx - 10, cy, 80, 30);
      ctx.beginPath();
      ctx.arc(cx - 45, cy + 40, 35, 0, Math.PI * 2);
      ctx.arc(cx + 50, cy + 40, 20, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'vehicules-pompier',
    category: 'vehicules',
    title: 'Le camion de pompiers',
    emoji: '🚒',
    prompt: 'Pin-pon pin-pon ! Dessinons un camion de pompiers avec sa grande échelle télescopique !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.strokeRect(cx - 110, cy - 40, 220, 70);
      ctx.strokeRect(cx - 70, cy - 65, 120, 20);
      ctx.beginPath();
      ctx.arc(cx - 65, cy + 35, 20, 0, Math.PI * 2);
      ctx.arc(cx + 65, cy + 35, 20, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'vehicules-bateau',
    category: 'vehicules',
    title: 'Le bateau à voile',
    emoji: '⛵',
    prompt: 'Hissez la grand-voile ! Dessinons un voilier blanc voguant sur une mer turquoise !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.moveTo(cx - 90, cy + 30);
      ctx.lineTo(cx + 90, cy + 30);
      ctx.lineTo(cx + 60, cy + 70);
      ctx.lineTo(cx - 60, cy + 70);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy + 30);
      ctx.lineTo(cx, cy - 80);
      ctx.lineTo(cx + 60, cy + 10);
      ctx.closePath();
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'vehicules-train',
    category: 'vehicules',
    title: 'Le train à vapeur',
    emoji: '🚂',
    prompt: 'Tchou-tchou ! Dessinons une locomotive vintage avec un grand panache de fumée blanche !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.strokeRect(cx - 90, cy - 20, 110, 50);
      ctx.strokeRect(cx + 20, cy - 50, 60, 80);
      ctx.beginPath();
      ctx.arc(cx - 50, cy + 40, 18, 0, Math.PI * 2);
      ctx.arc(cx, cy + 40, 18, 0, Math.PI * 2);
      ctx.arc(cx + 50, cy + 40, 24, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'vehicules-helicoptere',
    category: 'vehicules',
    title: 'L’hélicoptère de secours',
    emoji: '🚁',
    prompt: 'Tchac-tchac-tchac ! Dessinons les pales qui tournent à toute vitesse au-dessus de la ville !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.ellipse(cx - 20, cy, 70, 45, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 100, cy - 55);
      ctx.lineTo(cx + 60, cy - 55);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'vehicules-sousmarin',
    category: 'vehicules',
    title: 'Le sous-marin jaune',
    emoji: '🤿',
    prompt: 'Plongeons au fond des mers ! Dessinons un sous-marin jaune avec son périscope curieux !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 110, 50, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeRect(cx - 20, cy - 75, 25, 30);
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'vehicules-montgolfiere',
    category: 'vehicules',
    title: 'La montgolfière multicolore',
    emoji: '🎈',
    prompt: 'Dans les airs au vent doux ! Dessinons un ballon à rayures et sa petite nacelle en osier !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2 - 20;
      ctx.beginPath();
      ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeRect(cx - 25, cy + 110, 50, 40);
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'vehicules-avion',
    category: 'vehicules',
    title: 'L’avion de ligne',
    emoji: '✈️',
    prompt: 'Attachez vos ceintures ! Dessinons un grand avion qui s’élève au-dessus des nuages !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 120, 28, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy);
      ctx.lineTo(cx - 40, cy - 70);
      ctx.lineTo(cx + 10, cy);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'vehicules-velo',
    category: 'vehicules',
    title: 'Le vélo rigolo',
    emoji: '🚲',
    prompt: 'En selle ! Dessinons un vélo avec deux grandes roues et un joli panier de fleurs !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.arc(cx - 65, cy + 30, 35, 0, Math.PI * 2);
      ctx.arc(cx + 65, cy + 30, 35, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'vehicules-scooter',
    category: 'vehicules',
    title: 'La trottinette éclair',
    emoji: '🛴',
    prompt: 'On pousse avec le pied ! Dessinons une trottinette rapide comme l’éclair !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.strokeRect(cx - 60, cy + 40, 120, 8);
      ctx.beginPath();
      ctx.arc(cx - 60, cy + 45, 14, 0, Math.PI * 2);
      ctx.arc(cx + 60, cy + 45, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 50, cy + 40);
      ctx.lineTo(cx + 40, cy - 50);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },

  // --- NATURE & GOURMANDISES (12) ---
  {
    id: 'nature-glace',
    category: 'nature',
    title: 'La glace 3 boules',
    emoji: '🍦',
    prompt: 'Miam ! Dessinons un grand cornet craquant avec trois délicieuses boules de glace !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      // Cone
      ctx.beginPath();
      ctx.moveTo(cx - 45, cy + 10);
      ctx.lineTo(cx + 45, cy + 10);
      ctx.lineTo(cx, cy + 110);
      ctx.closePath();
      ctx.stroke();
      // Scoops
      ctx.beginPath();
      ctx.arc(cx - 25, cy - 10, 32, 0, Math.PI * 2);
      ctx.arc(cx + 25, cy - 10, 32, 0, Math.PI * 2);
      ctx.arc(cx, cy - 60, 32, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'nature-gateau',
    category: 'nature',
    title: 'Le gâteau d’anniversaire',
    emoji: '🎂',
    prompt: 'Joyeux anniversaire ! Dessinons un gâteau à étages avec ses bougies allumées !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.strokeRect(cx - 90, cy + 10, 180, 60);
      ctx.strokeRect(cx - 60, cy - 40, 120, 50);
      // Candle
      ctx.strokeRect(cx - 6, cy - 75, 12, 35);
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'nature-cupcake',
    category: 'nature',
    title: 'Le cupcake à la fraise',
    emoji: '🧁',
    prompt: 'Dessinons un cupcake gourmand surmonté d’une chantilly moelleuse et d’une cerise rouge !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.moveTo(cx - 50, cy + 10);
      ctx.lineTo(cx + 50, cy + 10);
      ctx.lineTo(cx + 35, cy + 80);
      ctx.lineTo(cx - 35, cy + 80);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy - 15, 55, Math.PI, 0);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'nature-fleur',
    category: 'nature',
    title: 'Le grand tournesol',
    emoji: '🌻',
    prompt: 'Dessinons un grand tournesol qui tourne son cœur plein de graines vers le soleil !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2 - 20;
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.ellipse(cx + Math.cos(ang) * 65, cy + Math.sin(ang) * 65, 25, 15, ang, 0, Math.PI * 2);
        ctx.stroke();
      }
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'nature-pomme',
    category: 'nature',
    title: 'La pomme croquée',
    emoji: '🍎',
    prompt: 'Croque la vie ! Dessinons une belle pomme rouge avec sa petite feuille verte !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.arc(cx - 25, cy, 50, 0, Math.PI * 2);
      ctx.arc(cx + 25, cy, 50, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy - 45);
      ctx.quadraticCurveTo(cx - 10, cy - 80, cx - 25, cy - 85);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'nature-pizza',
    category: 'nature',
    title: 'La part de pizza fondante',
    emoji: '🍕',
    prompt: 'Mamma mia ! Dessinons une part de pizza au fromage fondant et tomates juteuses !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy + 90);
      ctx.lineTo(cx - 80, cy - 70);
      ctx.quadraticCurveTo(cx, cy - 90, cx + 80, cy - 70);
      ctx.closePath();
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'nature-fraise',
    category: 'nature',
    title: 'La fraise sucrée',
    emoji: '🍓',
    prompt: 'Dessinons une fraise des bois sucrée avec de petits pépins dorés !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy + 85);
      ctx.quadraticCurveTo(cx - 75, cy + 20, cx - 60, cy - 35);
      ctx.quadraticCurveTo(cx, cy - 60, cx + 60, cy - 35);
      ctx.quadraticCurveTo(cx + 75, cy + 20, cx, cy + 85);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'nature-feuille',
    category: 'nature',
    title: 'La feuille d’automne',
    emoji: '🍁',
    prompt: 'Dessinons une belle feuille d’érable aux couleurs d’automne : jaune, orange et rouge !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 70, 0, Math.PI * 2);
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'nature-bonbon',
    category: 'nature',
    title: 'Le bonbon géant',
    emoji: '🍬',
    prompt: 'Dessinons une friandise colorée enveloppée dans son papier brillant à rayures !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 45, cy);
      ctx.lineTo(cx - 95, cy - 25);
      ctx.lineTo(cx - 95, cy + 25);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 45, cy);
      ctx.lineTo(cx + 95, cy - 25);
      ctx.lineTo(cx + 95, cy + 25);
      ctx.closePath();
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'nature-ananas',
    category: 'nature',
    title: 'L’ananas tropical',
    emoji: '🍍',
    prompt: 'Dessinons un ananas tropical avec ses grandes feuilles piquantes comme une couronne !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2 + 20;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 60, 80, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy - 80);
      ctx.lineTo(cx - 30, cy - 130);
      ctx.lineTo(cx, cy - 105);
      ctx.lineTo(cx + 30, cy - 130);
      ctx.closePath();
      ctx.stroke();
      restoreGuideStyle(ctx);
    }
  },
  {
    id: 'nature-sucette',
    category: 'nature',
    title: 'La sucette tourbillon',
    emoji: '🍭',
    prompt: 'Dessinons une grande sucette foraine avec un tourbillon bicolore en spirale !',
    drawGuide: (ctx, w, h) => {
      setupGuideStyle(ctx);
      const cx = w / 2;
      const cy = h / 2 - 25;
      ctx.beginPath();
      ctx.arc(cx, cy, 60, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeRect(cx - 5, cy + 60, 10, 80);
      restoreGuideStyle(ctx);
    }
  }
];
