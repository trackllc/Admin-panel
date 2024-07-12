export type MapImageData =
  | HTMLImageElement
  | ArrayBufferView
  | { width: number; height: number; data: Uint8Array | Uint8ClampedArray }
  | ImageData
  | ImageBitmap;