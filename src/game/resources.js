import { loadImage } from './utils.js'

export const loadPlayerSprite = (player) =>
  loadImage(player === 'lorena'
    ? '/assets/players/lorena-all-spritesheet.png'
    : '/assets/players/johan-all-spritesheet.png')

export const loadWaitingSprite = (player) =>
  loadImage(player === 'lorena'
    ? '/assets/johan-waiting.png'
    : '/assets/lorena-waiting.png')

export const loadRockSprites = () =>
  [1, 2, 3, 4, 5, 6].map((i) => loadImage(`/assets/rocks/rock${i}.png`))

export const loadHudImages = () => ({
  hudCollect: loadImage('/assets/point-tracker/collect.png'),
  hudBerryShadow: loadImage('/assets/point-tracker/berry-shadow.png'),
  hudBerryCol: loadImage('/assets/point-tracker/berry-collected.png'),
  hudRingShadow: loadImage('/assets/point-tracker/ring-shadow.png'),
})
