import { loadImage } from './utils.js'

export const loadPlayerSprite = (player) =>
  loadImage(player === 'lorena'
    ? '/assets/players/lorena-all-spritesheet.avif'
    : '/assets/players/johan-all-spritesheet.avif')

export const loadWaitingSprite = (player) =>
  loadImage(player === 'lorena'
    ? '/assets/johan-waiting.avif'
    : '/assets/lorena-waiting.avif')

export const loadRockSprites = () =>
  [1, 2, 3, 4, 5, 6].map((i) => loadImage(`/assets/rocks/rock${i}.avif`))

export const loadHudImages = () => ({
  hudCollect: loadImage('/assets/point-tracker/collect.png'),
  hudBerryShadow: loadImage('/assets/point-tracker/berry-shadow.avif'),
  hudBerryCol: loadImage('/assets/point-tracker/berry-collected.avif'),
  hudRingShadow: loadImage('/assets/point-tracker/ring-shadow.avif'),
})
