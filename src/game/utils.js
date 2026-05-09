export const loadImage = (src) => {
  const img = new Image()
  img.src = src
  return img
}

export const rectsOverlap = (a, b) =>
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
