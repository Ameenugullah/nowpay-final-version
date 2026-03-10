import { useEffect } from 'react';

export function useQR(canvasRef, seed = 'NP_ABDULMALIK_0123456789') {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx  = canvas.getContext('2d');
    const SIZE = 180, MOD = 18, CELL = SIZE / MOD;

    // Background
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Deterministic pattern from seed
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffffff;

    ctx.fillStyle = '#0D1321';
    for (let r = 0; r < MOD; r++) {
      for (let c = 0; c < MOD; c++) {
        if ((r < 7 && c < 7) || (r < 7 && c >= MOD - 7) || (r >= MOD - 7 && c < 7)) continue;
        if (r === 6 || c === 6) {
          if ((r + c) % 2 === 0) ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
          continue;
        }
        const v = (((r * MOD + c + h) * 6364136223846793005 + 1442695040888963407) >>> 0);
        if (v % 3 !== 0) ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
      }
    }

    // Finder patterns
    [[0, 0], [0, MOD - 7], [MOD - 7, 0]].forEach(([row, col]) => {
      const x = col * CELL, y = row * CELL;
      ctx.fillStyle = '#0D1321'; ctx.fillRect(x, y, CELL * 7, CELL * 7);
      ctx.fillStyle = '#ffffff'; ctx.fillRect(x + CELL, y + CELL, CELL * 5, CELL * 5);
      ctx.fillStyle = '#0D1321'; ctx.fillRect(x + CELL * 2, y + CELL * 2, CELL * 3, CELL * 3);
    });

    // Centre logo
    const L = CELL * 4, lx = (SIZE - L) / 2, ly = (SIZE - L) / 2;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(lx - 3, ly - 3, L + 6, L + 6);
    ctx.fillStyle = '#4E7CF6';
    ctx.beginPath();
    ctx.roundRect?.(lx, ly, L, L, 5);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(CELL * 1.5)}px Outfit, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', SIZE / 2, SIZE / 2);
  }, [canvasRef, seed]);
}
