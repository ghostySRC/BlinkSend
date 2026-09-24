import { readdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dir=path.join(root,'test');
const files=(await readdir(dir)).filter(name=>name.endsWith('.test.js')).sort().map(name=>path.join('test',name));
if(!files.length)throw new Error('No test files found');
const child=spawn(process.execPath,['--test',...files],{cwd:root,stdio:'inherit'});
child.on('exit',(code,signal)=>{if(signal)process.kill(process.pid,signal);else process.exitCode=code??1;});
