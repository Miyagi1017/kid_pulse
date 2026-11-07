import test from 'node:test';
import assert from 'node:assert/strict';
import { DRAWING_TEMPLATES, TEMPLATE_CATEGORIES } from './drawingTemplates.ts';
import { DAILY_CHALLENGES, getTodayChallenge } from './dailyChallenges.ts';
import { FACTS } from '../../shared/dailyContent.ts';

test('DRAWING_TEMPLATES a plus de 50 modèles avec des IDs uniques et des tracés valides', () => {
  assert.ok(DRAWING_TEMPLATES.length >= 50, `Attendu >= 50 modèles, reçu ${DRAWING_TEMPLATES.length}`);
  const ids = new Set<string>();
  for (const t of DRAWING_TEMPLATES) {
    assert.ok(!ids.has(t.id), `ID de modèle dupliqué: ${t.id}`);
    ids.add(t.id);
    assert.ok(t.title.length > 0, `Titre vide pour ${t.id}`);
    assert.ok(t.prompt.length > 10, `Prompt audio trop court pour ${t.id}`);
    assert.ok(typeof t.drawGuide === 'function', `drawGuide manquant pour ${t.id}`);
  }
});

test('DAILY_CHALLENGES a au moins 20 défis créatifs quotidiens avec lecture audio', () => {
  assert.ok(DAILY_CHALLENGES.length >= 20);
  const ids = new Set<string>();
  for (const c of DAILY_CHALLENGES) {
    assert.ok(!ids.has(c.id), `ID de défi dupliqué: ${c.id}`);
    ids.add(c.id);
    assert.ok(c.spokenText.length > 15, `Texte audio manquant pour ${c.id}`);
  }
  const todayCh = getTodayChallenge();
  assert.ok(todayCh && todayCh.title, 'Le défi du jour doit être défini');
});

test('FACTS du journal a plus de 180 sujets éducatifs variés pour tous les jours', () => {
  assert.ok(FACTS.length >= 180, `Attendu >= 180 faits quotidiens, reçu ${FACTS.length}`);
  for (const [emoji, text] of FACTS) {
    assert.ok(text && text.length > 10, 'Texte de fait invalide');
    assert.ok(emoji && emoji.length > 0, 'Emoji manquant');
  }
});

test('MAGIC_ART_CATALOG contient des œuvres magiques avec IDs uniques et encouragements vocaux', async () => {
  const { MAGIC_ART_CATALOG } = await import('../lib/magicArt.ts');
  assert.ok(MAGIC_ART_CATALOG.length >= 20, `Attendu >= 20 oeuvres, reçu ${MAGIC_ART_CATALOG.length}`);
  const ids = new Set<string>();
  for (const art of MAGIC_ART_CATALOG) {
    assert.ok(!ids.has(art.id), `ID d'oeuvre dupliqué: ${art.id}`);
    ids.add(art.id);
    assert.ok(art.title.length > 0, 'Titre manquant');
    assert.ok(typeof art.voicePraise === 'function', 'voicePraise manquant');
    const praise = art.voicePraise('Léo');
    assert.ok(praise.includes('Léo'), 'Le prénom doit être inclus dans la voix');
  }
});

