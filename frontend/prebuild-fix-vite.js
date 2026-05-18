/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

function isWindows() {
  return process.platform === 'win32';
}

function chmodRecursive(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      chmodRecursive(p);
    } else {
      try {
        // Ensure executables in node_modules/.bin remain runnable on Linux/Render
        fs.chmodSync(p, 0o755);
      } catch {
        // ignore
      }
    }
  }
}

try {
  const nmBin = path.join(process.cwd(), 'node_modules', '.bin');
  if (!isWindows()) {
    chmodRecursive(nmBin);

    // Render/Linux permission fixes: ensure Vite wrapper is executable.
    const candidates = [
      path.join(nmBin, 'vite'),
      path.join(nmBin, 'vite.js'),
      path.join(nmBin, 'vite-wrapper.js'),
      path.join(nmBin, 'vite.exe')
    ];

    for (const c of candidates) {
      if (fs.existsSync(c)) {
        try {
          fs.chmodSync(c, 0o755);
        } catch {
          // ignore
        }
      }
    }
  } else {
    // On Windows, ignore chmod attempts.
  }

  console.log('[prebuild-fix-vite] chmod checks complete');
} catch (e) {
  console.log('[prebuild-fix-vite] failed to apply chmod fixes (continuing):', e?.message || e);
}



