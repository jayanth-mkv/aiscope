import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, rm, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ensureBinary, targetFor } from './runtime.js';

test('supported targets are explicit and unknown platforms fail', () => {
  assert.equal(targetFor('darwin', 'arm64'), 'aarch64-apple-darwin');
  assert.throws(() => targetFor('win32', 'arm64'), /Unsupported/);
});
test('verified download is cached, corrupted cache repaired and bad checksum rejected', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'aiscope-package-'));
  const bytes = Buffer.from('fixture binary');
  const checksum = createHash('sha256').update(bytes).digest('hex');
  let calls = 0;
  const fetchImpl = async url => { calls++; return new Response(url.endsWith('.sha256') ? checksum : bytes); };
  try {
    const options = { directory, fetchImpl, platform: 'win32', arch: 'x64' };
    const binary = await ensureBinary(options);
    assert.deepEqual(await readFile(binary), bytes);
    await ensureBinary(options); assert.equal(calls, 2);
    await writeFile(binary, 'corrupt');
    await ensureBinary(options); assert.equal(calls, 4);
    await writeFile(binary, 'corrupt');
    await assert.rejects(ensureBinary({ ...options, fetchImpl: async url => new Response(url.endsWith('.sha256') ? '0'.repeat(64) : bytes) }), /checksum mismatch/);
    await assert.rejects(ensureBinary({ ...options, fetchImpl: async () => new Response('', { status: 404 }) }), /404/);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
