#!/usr/bin/env node
/* eslint-disable no-console */
const { spawn } = require('child_process');
const path = require('path');

const cwd = path.resolve(__dirname, '..', 'native', 'i18n-collect-rs');

const child = spawn('npx', ['-y', '@napi-rs/cli@2', 'build', '--release'], { cwd, stdio: 'inherit', shell: true });
child.on('exit', (code) => process.exit(code || 0));
