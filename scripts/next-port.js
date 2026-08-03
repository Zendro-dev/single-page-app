#!/usr/bin/env node
/*
 * Cross-platform launcher for `next <command>` on an env-driven port.
 *
 * The POSIX package.json scripts use `next <command> -p ${PORT:-8080}`, but
 * cmd.exe has no `${PORT:-8080}` default-expansion syntax, so the Windows
 * scripts (`dev:win`, `start:win`) used to hard-code `-p 8080` and ignore the
 * PORT environment variable entirely. This launcher restores the same
 * behaviour on every platform: use process.env.PORT, defaulting to 8080.
 *
 * Usage: node scripts/next-port.js <dev|start>
 */
const { spawn } = require('child_process');

const command = process.argv[2];
if (!command) {
  console.error('next-port: missing command (expected "dev" or "start")');
  process.exit(1);
}

const port = process.env.PORT || '8080';

// shell:true so `next` resolves from node_modules/.bin (npm puts it on PATH)
// on both cmd.exe and POSIX shells.
const child = spawn(`next ${command} -p ${port}`, {
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
