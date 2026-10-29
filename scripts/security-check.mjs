import {execFileSync} from 'node:child_process';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const files=execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
const patterns=[
 ['Google API key',/AIza[\w-]{35}/g],
 ['Supabase secret key',/sb_secret_[\w-]{12,}/g],
 ['Private provider key',/sk-(?:proj-|svcacct-)?[\w-]{25,}/g],
 ['GitHub token',/(?:gh[pousr]_[A-Za-z0-9]{25,}|github_pat_[A-Za-z0-9_]{25,})/g],
 ['Private key',/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
 ['Embedded JWT',/eyJ[\w-]+\.[\w-]+\.[\w-]+/g]
];
let failures=0;
for(const file of new Set(files)){
 const full=new URL('../'+file,import.meta.url);if(!existsSync(full))continue;
 if(/(?:^|\/)\.env(?!\.example$)/.test(file)||file==='firebase-applet-config.json'){
  console.error('Local configuration is tracked:',file);failures++;continue;
 }
 const text=readFileSync(full,'utf8');
 for(const [name,pattern] of patterns){pattern.lastIndex=0;if(pattern.test(text)){console.error(name+' detected in '+file+' (value hidden)');failures++;}}
 if((file==='firestore.rules'&&/allow\s+[^;]+:\s*if\s+true\s*;/.test(text)) || (file==='src/lib/supabase.ts'&&/USING\s*\(true\)/i.test(text))){console.error('Unrestricted database policy in '+file);failures++;}
}
if(failures)process.exitCode=1;else console.log('Security check passed: no matching literal credentials, tracked local config or unrestricted template policies.');
