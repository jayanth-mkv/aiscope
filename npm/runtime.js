import { createHash, randomUUID } from 'node:crypto';
import { readFile, mkdir, writeFile, rename, rm, chmod } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';

export const VERSION = '0.1.2';
export function targetFor(platform = process.platform, arch = process.arch) {
  const target = {
    'win32-x64': 'x86_64-pc-windows-msvc',
    'darwin-x64': 'x86_64-apple-darwin',
    'darwin-arm64': 'aarch64-apple-darwin',
    'linux-x64': 'x86_64-unknown-linux-gnu',
    'linux-arm64': 'aarch64-unknown-linux-gnu',
  }[`${platform}-${arch}`];
  if (!target) throw new Error(`Unsupported platform ${platform}/${arch}. Install AIScope with Cargo instead.`);
  return target;
}
const digest = data => createHash('sha256').update(data).digest('hex');
export async function ensureBinary({ directory, fetchImpl = fetch, platform = process.platform, arch = process.arch } = {}) {
  const target = targetFor(platform, arch);
  if (platform === 'linux' && !process.report.getReport().header.glibcVersionRuntime) {
    throw new Error('The npm binary requires glibc Linux. On Alpine/musl, install AIScope with Cargo.');
  }
  const asset = `aiscope-v${VERSION}-${target}${platform === 'win32' ? '.exe' : '.bin'}`;
  const folder = directory ?? join(process.env.AISCOPE_CACHE_DIR || (platform === 'win32' ? process.env.LOCALAPPDATA || homedir() : process.env.XDG_CACHE_HOME || join(homedir(), '.cache')), 'aiscope', VERSION, target);
  const binary = join(folder, platform === 'win32' ? 'aiscope.exe' : 'aiscope');
  const checksumPath = `${binary}.sha256`;
  try {
    const [bytes, expected] = await Promise.all([readFile(binary), readFile(checksumPath, 'utf8')]);
    if (/^[a-f0-9]{64}$/.test(expected) && digest(bytes) === expected) return binary;
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const base = `https://github.com/jayanth-mkv/aiscope/releases/download/v${VERSION}/${asset}`;
  async function download(url, maxBytes) {
    const response = await fetchImpl(url, { signal: AbortSignal.timeout(120000) });
    if (!response.ok) throw new Error(`Cannot download AIScope (${response.status}). Check your connection and release v${VERSION}.`);
    if (Number(response.headers.get('content-length')) > maxBytes) throw new Error('Release download exceeds size limit.');
    const reader = response.body.getReader();
    const chunks = []; let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        size += value.length; if (size > maxBytes) throw new Error('Release download exceeds size limit.');
        chunks.push(value);
      }
    } finally { await reader.cancel(); }
    return Buffer.concat(chunks);
  }
  const checksum = (await download(`${base}.sha256`, 4096)).toString('utf8').trim().split(/\s+/)[0];
  if (!/^[a-f0-9]{64}$/.test(checksum)) throw new Error('Invalid release checksum.');
  const bytes = await download(base, 100 * 1024 * 1024);
  if (digest(bytes) !== checksum) throw new Error('AIScope checksum mismatch; download rejected.');
  await mkdir(folder, { recursive: true });
  const temporary = `${binary}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, bytes, { mode: 0o755, flag: 'wx' });
    await chmod(temporary, 0o755);
    await rename(temporary, binary);
    await writeFile(checksumPath, checksum);
  } finally { await rm(temporary, { force: true }); }
  return binary;
}
