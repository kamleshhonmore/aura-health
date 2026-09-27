import fs from 'fs';
import { spawn } from 'child_process';
console.log(fs.readFileSync('server.ts', 'utf8').substring(0, 500));
