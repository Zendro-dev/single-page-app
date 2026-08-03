#!/usr/bin/env node
/*
 * Cross-platform launcher for `next <command>` on an env-driven port.
 *
 * A shell form like `next <command> -p ${PORT:-8080}` only works on POSIX
 * shells - cmd.exe has no `${PORT:-8080}` default-expansion syntax - which used
 * to force separate `:win` script variants. This launcher expresses the same
 * "use process.env.PORT, defaulting to 8080" behaviour in plain Node, so the
 * `dev` and `start` scripts work identically on every platform without a split.
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
