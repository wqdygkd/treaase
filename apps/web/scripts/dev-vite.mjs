import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { computeWasmFingerprint } from './wasm-fingerprint.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const webDir = path.resolve(here, '..');
const rootDir = path.resolve(webDir, '..', '..');
const viteBin = path.resolve(webDir, 'node_modules', 'vite', 'bin', 'vite.js');

export function startDevServer({ surface = 'web', host, port } = {}) {
  if (!existsSync(viteBin)) {
    throw new Error(`missing Vite bin: ${viteBin}`);
  }

  const args = [viteBin, 'dev'];
  if (host) args.push('--host', host);
  if (port) args.push('--port', port);

  return spawn(process.execPath, args, {
    cwd: webDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      TREEASE_WASM_IMPL: 'rust',
      TREEASE_WORKSPACE_SURFACE: surface,
      WASM_VERSION: computeWasmFingerprint(rootDir),
    },
  });
}

function runCli() {
  const { values } = parseArgs({
    options: {
      surface: { type: 'string', default: 'web' },
      host: { type: 'string' },
      port: { type: 'string' },
    },
  });
  const child = startDevServer(values);
  const shutdown = () => child.kill('SIGTERM');
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  child.on('exit', (code) => process.exit(code ?? 0));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCli();
}
