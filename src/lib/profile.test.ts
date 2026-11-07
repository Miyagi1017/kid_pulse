import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanName, ALL_BADGES } from './profile';

test('ALL_BADGES a 9 badges avec des IDs uniques', () => {
  assert.equal(ALL_BADGES.length, 9);
  const ids = new Set(ALL_BADGES.map((b) => b.id));
  assert.equal(ids.size, ALL_BADGES.length);
  ALL_BADGES.forEach((b) => {
    assert.ok(b.title.length > 0);
    assert.ok(b.description.length > 0);
    assert.ok(b.hint.length > 0);
    assert.ok(b.emoji.length > 0);
  });
});

test('cleanName gère les accents, espaces et majuscules', () => {
  assert.equal(cleanName('léo'), 'Léo');
  assert.equal(cleanName('  emma  '), 'Emma');
  assert.equal(cleanName('jean-baptiste'), 'Jean-baptiste');
  assert.equal(cleanName("d'artagnan"), "D'artagnan");
  assert.equal(cleanName('123Lina!#'), 'Lina');
});
