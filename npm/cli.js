#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { ensureBinary } from './runtime.js';
try {
  const binary = process.env.AISCOPE_BINARY_PATH || await ensureBinary();
  const child = spawn(binary, process.argv.slice(2), { stdio: 'inherit' });
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
  child.on('error', error => { console.error(`aiscope: ${error.message}`); process.exitCode = 1; });
  child.on('exit', (code, signal) => { process.exitCode = code ?? (signal === 'SIGINT' ? 130 : 143); });
} catch (error) {
  console.error(`aiscope: ${error.message}`);
  process.exitCode = 1;
}
