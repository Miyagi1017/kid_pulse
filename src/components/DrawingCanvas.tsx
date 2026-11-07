import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Download,
  Paintbrush,
  RotateCcw,
  Sparkles,
  Volume2,
  Wand2,
  X,
  Shuffle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects, speakFrenchText } from '../utils/soundEffects';
import {
  DRAWING_TEMPLATES,
  TEMPLATE_CATEGORIES,
  type DrawingTemplate
} from '../data/drawingTemplates';
import {
  generateMagicArtwork,
  type MagicArtResult
} from '../lib/magicArt';

interface DrawingCanvasProps {
  name: string;
  onBack: () => void;
  onSavedDrawing: () => void;
}

const COLORS = [
  { label: 'Soleil', color: '#ffc83d', bgClass: 'bg-soleil' },
  { label: 'Corail', color: '#ff7a59', bgClass: 'bg-corail' },
  { label: 'Menthe', color: '#2fc59a', bgClass: 'bg-menthe' },
  { label: 'Ciel', color: '#4aa8ff', bgClass: 'bg-ciel' },
  { label: 'Lavande', color: '#8b7cf6', bgClass: 'bg-lavande' },
  { label: 'Rose', color: '#ff6fa8', bgClass: 'bg-rose' },
  { label: 'Nuit', color: '#26215c', bgClass: 'bg-nuit' },
  { label: 'Arc-en-ciel', color: 'rainbow', bgClass: 'bg-gradient-to-r from-red-400 via-amber-300 via-green-400 to-blue-400' }
];

const STAMPS = ['🦁', '🐼', '🚀', '🌟', '🌈', '🌸', '🚗', '🐬', '👑', '🦖', '🍦', '🎈'];

export function DrawingCanvas({ name, onBack, onSavedDrawing }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#ff7a59');
  const [brushSize, setBrushSize] = useState<number>(14);
  const [tool, setTool] = useState<'brush' | 'stamp' | 'eraser'>('brush');
  const [selectedStamp, setSelectedStamp] = useState<string>('⭐');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [showTemplatesModal, setShowTemplatesModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('tous');
  const [activeTemplate, setActiveTemplate] = useState<DrawingTemplate | null>(null);

  // Mode Générer Magique
  const [isGeneratingMagic, setIsGeneratingMagic] = useState<boolean>(false);
  const [magicModalOpen, setMagicModalOpen] = useState<boolean>(false);
  const [activeMagicResult, setActiveMagicResult] = useState<MagicArtResult | null>(null);
  const [childSketchDataUrl, setChildSketchDataUrl] = useState<string>('');

  const isDrawing = useRef<boolean>(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const rainbowHue = useRef<number>(0);

  // Resize canvas to match display size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, rect.width, rect.height);
      const initialSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([initialSnapshot]);
    }
  }, []);

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), snap]);
  };

  const undo = () => {
    if (history.length <= 1) return;
    soundEffects.playPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const nextHistory = [...history];
    nextHistory.pop();
    const prevSnap = nextHistory[nextHistory.length - 1];
    ctx.putImageData(prevSnap, 0, 0);
    setHistory(nextHistory);
  };

  const clearCanvas = () => {
    soundEffects.playPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    setActiveTemplate(null);
    saveHistory();
  };

  const applyTemplate = (tmpl: DrawingTemplate) => {
    soundEffects.playStarChime();
    setActiveTemplate(tmpl);
    setShowTemplatesModal(false);

    speakFrenchText(tmpl.prompt, { rate: 0.88, pitch: 1.15 });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();

    // Clear background to clean white first
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Draw the soft dashed outline guide
    tmpl.drawGuide(ctx, rect.width, rect.height);
    saveHistory();
  };

  /**
   * DÉCLENCHE LE MODE GÉNÉRER MAGIQUE
   * Analyse le dessin approximatif et génère une œuvre aléatoire adaptée
   */
  const triggerMagicGeneration = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    soundEffects.playStarChime();
    confetti({ particleCount: 75, spread: 80, origin: { y: 0.5 } });

    const sketchUrl = canvas.toDataURL('image/png');
    setChildSketchDataUrl(sketchUrl);
    setIsGeneratingMagic(true);

    // Génération instantanée locale
    const localMagic = generateMagicArtwork(canvas, activeTemplate?.id, activeMagicResult?.id);
    setActiveMagicResult(localMagic);
    setMagicModalOpen(true);

    // Audio féerique immédiat
    speakFrenchText(localMagic.voicePraise(name), { rate: 0.88, pitch: 1.15 });

    // Optionnel : enrichissement IA via le serveur si Gemini est actif
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2800);
      const res = await fetch('/api/magic-draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: sketchUrl,
          activeTemplateId: activeTemplate?.id,
          childName: name
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success' && json.data?.title) {
          setActiveMagicResult((prev) =>
            prev
              ? {
                  ...prev,
                  title: json.data.title,
                  subtitle: json.data.magicDescription || prev.subtitle
                }
              : prev
          );
        }
      }
    } catch {
      // Le moteur local assure 100% de fiabilité même hors-ligne
    } finally {
      setIsGeneratingMagic(false);
    }
  };

  /**
   * Autre variation aléatoire de magie
   */
  const rerollMagic = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    soundEffects.playPop();
    const newMagic = generateMagicArtwork(canvas, activeTemplate?.id, activeMagicResult?.id);
    setActiveMagicResult(newMagic);
    speakFrenchText(newMagic.voicePraise(name), { rate: 0.88, pitch: 1.15 });
  };

  /**
   * Tamponne l'image magique générée directement sur le canvas de dessin
   */
  const stampMagicOnCanvas = () => {
    if (!activeMagicResult) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    soundEffects.playFanfare();
    confetti({ particleCount: 90, spread: 90, origin: { y: 0.6 } });

    const applyToCanvas = (imageEl?: HTMLImageElement) => {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, rect.width, rect.height);

      if (imageEl) {
        const margin = 20;
        const targetW = rect.width - margin * 2;
        const targetH = rect.height - margin * 2;
        const imgAspect = imageEl.width / imageEl.height;
        const targetAspect = targetW / targetH;

        let drawW = targetW;
        let drawH = targetH;
        if (imgAspect > targetAspect) {
          drawH = targetW / imgAspect;
        } else {
          drawW = targetH * imgAspect;
        }

        const drawX = (rect.width - drawW) / 2;
        const drawY = (rect.height - drawH) / 2;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(drawX, drawY, drawW, drawH, 20);
        ctx.clip();
        ctx.drawImage(imageEl, drawX, drawY, drawW, drawH);
        ctx.restore();

        ctx.strokeStyle = activeMagicResult.colorTone || '#ffc83d';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.roundRect(drawX, drawY, drawW, drawH, 20);
        ctx.stroke();
      } else {
        ctx.font = '96px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(activeMagicResult.emoji, rect.width / 2, rect.height / 2);
      }

      saveHistory();
      setMagicModalOpen(false);
      onSavedDrawing();
    };

    if (activeMagicResult.imageUrl) {
      const img = new Image();
      img.onload = () => applyToCanvas(img);
      img.onerror = () => applyToCanvas();
      img.src = activeMagicResult.imageUrl;
    } else {
      applyToCanvas();
    }
  };


  const downloadArt = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    soundEffects.playFanfare();
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    onSavedDrawing();

    const link = document.createElement('a');
    link.download = `dessin-${name.toLowerCase()}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const { x, y } = getCanvasCoords(e);

    if (tool === 'stamp') {
      soundEffects.playStamp();
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.font = '48px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(selectedStamp, x, y);
        saveHistory();
      }
      return;
    }

    isDrawing.current = true;
    lastPoint.current = { x, y };

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.beginPath();
      ctx.arc(x, y, (tool === 'eraser' ? brushSize * 1.5 : brushSize) / 2, 0, Math.PI * 2);
      ctx.fillStyle =
        tool === 'eraser' ? '#ffffff' : selectedColor === 'rainbow' ? `hsl(${rainbowHue.current}, 85%, 55%)` : selectedColor;
      ctx.fill();
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !lastPoint.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = brushSize * 2.2;
    } else {
      if (selectedColor === 'rainbow') {
        rainbowHue.current = (rainbowHue.current + 8) % 360;
        ctx.strokeStyle = `hsl(${rainbowHue.current}, 85%, 55%)`;
      } else {
        ctx.strokeStyle = selectedColor;
      }
      ctx.lineWidth = brushSize;
    }

    ctx.stroke();
    lastPoint.current = { x, y };
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDrawing.current) {
      isDrawing.current = false;
      lastPoint.current = null;
      saveHistory();
    }
    const canvas = canvasRef.current;
    if (canvas && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
  };

  const filteredTemplates =
    selectedCategory === 'tous'
      ? DRAWING_TEMPLATES
      : DRAWING_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="min-h-dvh flex flex-col bg-creme select-none">
      {/* Top bar with iPad & phone responsive layout */}
      <header className="px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border-b border-encre/10 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              soundEffects.playPop();
              onBack();
            }}
            className="press min-w-[48px] min-h-[48px] sm:w-12 sm:h-12 rounded-2xl bg-white shadow-bonbon flex items-center justify-center text-encre"
            aria-label="Retour à l'accueil"
          >
            <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-1.5 sm:gap-2">
              <span>🎨</span> Mon Dessin Magique
            </h1>
            <p className="text-xs sm:text-sm text-doux hidden sm:block">Dessine avec tes doigts, {name} !</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* BOUTON GÉNÉRER MAGIQUE */}
          <button
            onClick={triggerMagicGeneration}
            disabled={isGeneratingMagic}
            className="press px-3.5 sm:px-5 min-h-[46px] rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 text-white shadow-bonbon font-extrabold flex items-center gap-1.5 text-xs sm:text-sm ring-2 ring-purple-300 animate-pulse"
            aria-label="Transformer mon dessin par magie"
            title="Transformer mon dessin par magie"
          >
            <Wand2 className="w-4 h-4 fill-white" />
            <span className="font-black">🪄 Magie !</span>
          </button>

          {/* Sujets & Modèles button */}
          <button
            onClick={() => {
              soundEffects.playPop();
              setShowTemplatesModal(true);
            }}
            className="press px-3 sm:px-4 min-h-[46px] rounded-2xl bg-gradient-to-r from-soleil to-amber-400 text-encre shadow-bonbon font-bold flex items-center gap-1.5 text-xs sm:text-sm"
            aria-label="Choisir un modèle de dessin"
          >
            <Sparkles className="w-4 h-4 fill-encre" />
            <span className="font-extrabold hidden md:inline">Modèles ({DRAWING_TEMPLATES.length})</span>
            <span className="font-extrabold md:hidden">Modèles</span>
          </button>

          <button
            onClick={undo}
            disabled={history.length <= 1}
            className="press min-w-[44px] min-h-[44px] sm:w-11 sm:h-11 rounded-2xl bg-white shadow-bonbon flex items-center justify-center text-encre disabled:opacity-30"
            aria-label="Annuler le dernier trait"
            title="Annuler"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={clearCanvas}
            className="press px-3 min-h-[44px] rounded-2xl bg-white shadow-bonbon text-xs sm:text-sm font-bold text-doux flex items-center gap-1.5"
            aria-label="Effacer tout le dessin"
          >
            <span>🧽</span> <span className="hidden md:inline">Effacer</span>
          </button>
          <button
            onClick={downloadArt}
            className="press px-3.5 sm:px-4 min-h-[44px] rounded-2xl bg-menthe text-white shadow-bonbon font-bold flex items-center gap-1.5 text-xs sm:text-sm"
            aria-label="Sauvegarder mon dessin"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Garder !</span>
          </button>
        </div>
      </header>

      {/* Active template prompt badge */}
      {activeTemplate && (
        <div className="bg-soleil-clair border-b border-soleil/30 px-4 py-2 flex items-center justify-between gap-2 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl">{activeTemplate.emoji}</span>
            <span className="text-xs sm:text-sm font-bold truncate text-encre">
              Modèle : {activeTemplate.title}
            </span>
          </div>
          <button
            onClick={() => speakFrenchText(activeTemplate.prompt, { rate: 0.88, pitch: 1.15 })}
            className="press px-2.5 py-1 rounded-xl bg-white text-encre text-xs font-bold flex items-center gap-1 shadow-sm shrink-0"
            aria-label="Réécouter le sujet de dessin"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Écouter</span>
          </button>
        </div>
      )}

      {/* Main Workspace optimized for iPad & phone */}
      <div className="flex-1 flex flex-col p-2.5 sm:p-5 max-w-5xl w-full mx-auto gap-2.5 sm:gap-3">
        {/* Drawing Board - Responsive canvas container with magic wand badge */}
        <div className="flex-1 min-h-[50dvh] md:min-h-[62dvh] bg-white rounded-3xl shadow-bonbon p-2 overflow-hidden border-4 border-white relative flex">
          <canvas
            ref={canvasRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="w-full h-full touch-none rounded-2xl cursor-crosshair bg-white"
          />

          {/* Quick Floating Magic Button on Canvas */}
          <div className="absolute bottom-4 right-4 z-10">
            <button
              onClick={triggerMagicGeneration}
              className="press px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 text-white font-extrabold shadow-2xl flex items-center gap-2 border-2 border-white text-xs sm:text-sm backdrop-blur"
              aria-label="Transformer ce dessin en magie"
            >
              <Wand2 className="w-4 h-4 fill-white" />
              <span>Générer Magique ✨</span>
            </button>
          </div>
        </div>

        {/* Tools & Palette Palette */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-bonbon p-3 sm:p-4 flex flex-col gap-2.5 sm:gap-3">
          {/* Tool Modes */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-0.5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundEffects.playPop();
                  setTool('brush');
                }}
                className={`press px-4 min-h-[46px] rounded-2xl font-bold flex items-center gap-2 text-sm sm:text-base ${
                  tool === 'brush' ? 'bg-corail text-white shadow-bonbon' : 'bg-creme text-encre'
                }`}
              >
                <span>🖌️</span> Pinceau
              </button>
              <button
                onClick={() => {
                  soundEffects.playPop();
                  setTool('stamp');
                }}
                className={`press px-4 min-h-[46px] rounded-2xl font-bold flex items-center gap-2 text-sm sm:text-base ${
                  tool === 'stamp' ? 'bg-soleil text-encre shadow-bonbon' : 'bg-creme text-encre'
                }`}
              >
                <span>⭐</span> Tampons
              </button>
              <button
                onClick={() => {
                  soundEffects.playPop();
                  setTool('eraser');
                }}
                className={`press px-4 min-h-[46px] rounded-2xl font-bold flex items-center gap-2 text-sm sm:text-base ${
                  tool === 'eraser' ? 'bg-lavande text-white shadow-bonbon' : 'bg-creme text-encre'
                }`}
              >
                <span>🧼</span> Gomme
              </button>
            </div>

            {/* Brush sizes with finger-friendly targets */}
            <div className="flex items-center gap-2 pl-2 border-l border-encre/10">
              {[8, 16, 28].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    soundEffects.playPop();
                    setBrushSize(size);
                  }}
                  className={`press min-w-[42px] min-h-[42px] rounded-full flex items-center justify-center ${
                    brushSize === size ? 'bg-encre/15 ring-2 ring-encre' : 'bg-creme'
                  }`}
                  aria-label={`Taille de pinceau ${size}`}
                >
                  <span
                    className="rounded-full bg-encre"
                    style={{ width: `${size / 2}px`, height: `${size / 2}px` }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Conditional bar: Colors or Stamps */}
          {tool === 'brush' && (
            <div className="flex items-center gap-2 overflow-x-auto py-1" role="radiogroup" aria-label="Couleurs de peinture">
              {COLORS.map((c) => {
                const active = selectedColor === (c.color === 'rainbow' ? 'rainbow' : c.color);
                return (
                  <button
                    key={c.label}
                    onClick={() => {
                      soundEffects.playPop();
                      setSelectedColor(c.color);
                    }}
                    className={`press min-w-[48px] min-h-[48px] sm:w-12 sm:h-12 shrink-0 rounded-2xl ${c.bgClass} flex items-center justify-center transition-transform ${
                      active ? 'ring-4 ring-encre scale-110' : 'ring-2 ring-black/5'
                    }`}
                    aria-label={`Couleur ${c.label}`}
                  >
                    {c.color === 'rainbow' && <Sparkles className="w-5 h-5 text-white drop-shadow" />}
                  </button>
                );
              })}
            </div>
          )}

          {tool === 'stamp' && (
            <div className="flex items-center gap-2 overflow-x-auto py-1" role="radiogroup" aria-label="Tampons d'animaux et objets">
              {STAMPS.map((stamp) => (
                <button
                  key={stamp}
                  onClick={() => {
                    soundEffects.playPop();
                    setSelectedStamp(stamp);
                  }}
                  className={`press min-w-[48px] min-h-[48px] sm:w-12 sm:h-12 shrink-0 text-2xl rounded-2xl flex items-center justify-center ${
                    selectedStamp === stamp ? 'bg-soleil-clair ring-4 ring-soleil scale-110 shadow-bonbon' : 'bg-creme'
                  }`}
                  aria-label={`Tampon ${stamp}`}
                >
                  {stamp}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL : RÉVÉLATION MAGIQUE DU DESSIN */}
      <AnimatePresence>
        {magicModalOpen && activeMagicResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-encre/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-creme max-w-2xl w-full max-h-[92dvh] rounded-[2.5rem] p-4 sm:p-7 shadow-2xl flex flex-col border-4 border-white overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-encre/10">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl sm:text-4xl">✨</span>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-extrabold uppercase tracking-wide">
                      Transformation Magique
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-encre">
                      {activeMagicResult.title}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => {
                    soundEffects.playPop();
                    setMagicModalOpen(false);
                  }}
                  className="press min-w-[44px] min-h-[44px] rounded-full bg-white shadow-bonbon flex items-center justify-center text-encre"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Comparaison Avant / Après */}
              <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-center">
                {/* Mon croquis */}
                <div className="bg-white rounded-2xl p-2.5 shadow-sm border-2 border-encre/10 flex flex-col items-center">
                  <span className="text-xs font-bold text-doux mb-1 flex items-center gap-1">
                    <span>✏️</span> Ton croquis d'artiste
                  </span>
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white flex items-center justify-center border border-encre/5">
                    {childSketchDataUrl ? (
                      <img
                        src={childSketchDataUrl || undefined}
                        alt="Ton dessin"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-4xl">🎨</span>
                    )}
                  </div>
                </div>

                {/* Le chef-d'œuvre magique */}
                <div className="bg-gradient-to-b from-purple-50 to-pink-50 rounded-2xl p-2.5 shadow-bonbon border-2 border-purple-200 flex flex-col items-center relative overflow-hidden">
                  <span className="text-xs font-extrabold text-purple-700 mb-1 flex items-center gap-1">
                    <span>🌟</span> Le chef-d'œuvre magique !
                  </span>
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white flex items-center justify-center shadow-inner relative">
                    {activeMagicResult.imageUrl ? (
                      <img
                        src={activeMagicResult.imageUrl || undefined}
                        alt={activeMagicResult.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-7xl">{activeMagicResult.emoji}</span>
                    )}
                    <span className="absolute bottom-2 right-2 text-3xl drop-shadow">
                      {activeMagicResult.emoji}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subtitle & Voice button */}
              <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-encre/10 flex items-center justify-between gap-3 mb-4">
                <p className="text-xs sm:text-sm text-encre font-medium leading-relaxed">
                  {activeMagicResult.subtitle}
                </p>
                <button
                  onClick={() =>
                    speakFrenchText(activeMagicResult.voicePraise(name), { rate: 0.88, pitch: 1.15 })
                  }
                  className="press px-3 py-1.5 rounded-xl bg-soleil-clair text-encre font-bold text-xs flex items-center gap-1 shrink-0"
                  aria-label="Réécouter le compliment magique"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Écouter</span>
                </button>
              </div>

              {/* Actions Magiques */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  onClick={stampMagicOnCanvas}
                  className="press flex-1 py-3.5 px-4 rounded-2xl bg-menthe text-white font-extrabold text-sm sm:text-base shadow-bonbon flex items-center justify-center gap-2"
                >
                  <Paintbrush className="w-5 h-5" />
                  <span>Mettre sur ma feuille 🎨</span>
                </button>

                <button
                  onClick={rerollMagic}
                  className="press py-3.5 px-4 rounded-2xl bg-white text-encre font-extrabold text-sm sm:text-base shadow-bonbon flex items-center justify-center gap-2 border border-encre/10"
                >
                  <Shuffle className="w-4 h-4 text-purple-600" />
                  <span>Autre magie aléatoire 🎲</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: 55+ Drawing Templates & Coloring Outlines */}
      <AnimatePresence>
        {showTemplatesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-encre/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-creme max-w-3xl w-full max-h-[85dvh] rounded-[2.5rem] p-4 sm:p-6 shadow-2xl flex flex-col border-4 border-white"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-encre/10">
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl">🎨</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">55 Modèles & Idées Magiques</h2>
                    <p className="text-xs sm:text-sm text-doux">Touche un modèle pour l’afficher sur ta feuille !</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    soundEffects.playPop();
                    setShowTemplatesModal(false);
                  }}
                  className="press min-w-[44px] min-h-[44px] rounded-full bg-white shadow-bonbon flex items-center justify-center text-encre"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category tabs */}
              <div className="flex gap-2 overflow-x-auto py-3">
                {TEMPLATE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      soundEffects.playPop();
                      setSelectedCategory(cat.id);
                    }}
                    className={`press px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 shrink-0 ${
                      selectedCategory === cat.id
                        ? 'bg-corail text-white shadow-bonbon'
                        : 'bg-white text-encre'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Templates Grid - Highly responsive on iPad & phone */}
              <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3 p-1">
                {filteredTemplates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => applyTemplate(tmpl)}
                    className="press bg-white rounded-2xl p-3 text-left border-2 border-transparent hover:border-corail shadow-bonbon flex flex-col items-center justify-center text-center gap-1.5 transition-all group"
                  >
                    <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform">
                      {tmpl.emoji}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-encre line-clamp-1">
                      {tmpl.title}
                    </span>
                    <span className="text-[10px] text-doux bg-creme px-2 py-0.5 rounded-full">
                      Tracé guidé ✨
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
