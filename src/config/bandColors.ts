export interface BandColor {
  hex: string;
  rgb: [number, number, number];
}

export const BAND_COLORS: BandColor[] = [
  // GR33N (1-6) lowest frequencies 
  { hex: '#a1cd12', rgb: [161, 205, 18] },
  { hex: '#87c212', rgb: [136, 194, 18] },
  { hex: '#70b712', rgb: [111, 183, 18] },
  { hex: '#55ac12', rgb: [86, 172, 18] },
  { hex: '#3da112', rgb: [61, 161, 18] },
  { hex: '#249612', rgb: [36, 150, 18] },
  // R3D (7-12)
  { hex: '#96121b', rgb: [150, 18, 27] },
  { hex: '#9d2318', rgb: [157, 35, 24] },
  { hex: '#a43415', rgb: [164, 52, 21] },
  { hex: '#ab4512', rgb: [171, 69, 18] },
  { hex: '#b2560f', rgb: [178, 86, 15] },
  { hex: '#b9670c', rgb: [185, 103, 12] },
  // 0R4NG3 (13-18)
  { hex: '#c07709', rgb: [192, 120, 9] },
  { hex: '#c48509', rgb: [196, 133, 9] },
  { hex: '#c8930c', rgb: [200, 146, 12] },
  { hex: '#cc9f0c', rgb: [204, 159, 12] },
  { hex: '#d0ac0f', rgb: [208, 172, 15] },
  { hex: '#d4ba0f', rgb: [212, 185, 15] },
  // BLU3 (19-24)
  { hex: '#24837e', rgb: [36, 131, 126] },
  { hex: '#1e7090', rgb: [30, 112, 144] },
  { hex: '#185da2', rgb: [24, 93, 162] },
  { hex: '#124ab4', rgb: [18, 74, 180] },
  { hex: '#0c37c6', rgb: [12, 55, 198] },
  { hex: '#0626d8', rgb: [6, 36, 216] },
  // PURPL3 (25-30)
  { hex: '#1b21bd', rgb: [27, 33, 189] },
  { hex: '#3021a2', rgb: [48, 33, 162] },
  { hex: '#461e90', rgb: [69, 30, 144] },
  { hex: '#511b75', rgb: [81, 27, 117] },
  { hex: '#661b59', rgb: [102, 27, 90] },
  { hex: '#7b1840', rgb: [123, 24, 63] },
  // Y3LL0W (31-36) highest frequencies 
  { hex: '#d8c812', rgb: [216, 201, 18] },
  { hex: '#d2cc12', rgb: [210, 204, 18] },
  { hex: '#cccf12', rgb: [204, 207, 18] },
  { hex: '#c5d212', rgb: [198, 210, 18] },
  { hex: '#c1d512', rgb: [192, 213, 18] },
  { hex: '#bad812', rgb: [186, 216, 18] },
];
