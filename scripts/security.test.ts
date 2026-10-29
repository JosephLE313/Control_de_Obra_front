import test from 'node:test';
import assert from 'node:assert/strict';
import {isPublicSupabaseKey,isValidPublicSupabaseConfig} from '../src/lib/publicCredentials.ts';
import {getStoredSupabaseConfig,getSupabaseClient,saveSupabaseConfig,SUPABASE_SQL_SCHEMA} from '../src/lib/supabase.ts';
import {isFirebaseConfigured,app} from '../src/lib/firebase.ts';
import {supabaseTestService,assertSupabaseWrite} from '../src/services/supabaseService.ts';
const token=(role:string)=>['header',Buffer.from(JSON.stringify({role})).toString('base64url'),'signature'].join('.');
const publicKey='sb_'+'publishable_'+'a'.repeat(20);
const secretKey='sb_'+'secret_'+'a'.repeat(20);
const store=new Map<string,string>();
Object.defineProperty(globalThis,'window',{value:{},configurable:true});
Object.defineProperty(globalThis,'localStorage',{value:{getItem:(k:string)=>store.get(k)||null,setItem:(k:string,v:string)=>store.set(k,v),removeItem:(k:string)=>store.delete(k)},configurable:true});
test('accepts only public client key types',()=>{
 assert(isPublicSupabaseKey(publicKey));assert(isPublicSupabaseKey(token('anon')));
 for(const key of [secretKey,token('service_role'),token('authenticated'),'malformed',''])assert.equal(isPublicSupabaseKey(key),false);
});
test('rejects credentials in URLs, insecure hosts, queries and non-API paths',()=>{
 assert(isValidPublicSupabaseConfig('https://example.supabase.co',publicKey));
 assert(isValidPublicSupabaseConfig('http://127.0.0.1:54321',publicKey));
 for(const url of ['http://example.com','https://name:password@example.com','https://example.com/path','https://example.com?key=value'])assert.equal(isValidPublicSupabaseConfig(url,publicKey),false);
});
test('no bundled fallback and no acceptance/storage of privileged keys',()=>{
 assert.equal(getStoredSupabaseConfig().isConfigured,false);assert.equal(getSupabaseClient(),null);
 assert.equal(saveSupabaseConfig('https://example.supabase.co',secretKey),false);assert.equal(store.size,0);
 store.set('control_obra_supabase_url','https://example.supabase.co');store.set('control_obra_supabase_anon_key',secretKey);
 assert.equal(getStoredSupabaseConfig().isConfigured,false);assert.equal(store.has('control_obra_supabase_anon_key'),false);
 assert(saveSupabaseConfig('https://example.supabase.co',publicKey));assert.equal(getStoredSupabaseConfig().source,'storage');
 assert(saveSupabaseConfig('',''));assert.equal(getSupabaseClient(),null);
});
test('unconfigured Firebase remains a local demo and database template denies public access',()=>{
 assert.equal(isFirebaseConfigured,false);assert.equal(app.options.projectId,'demo-control-obra');
 assert(!/USING\s*\(true\)/i.test(SUPABASE_SQL_SCHEMA));assert(SUPABASE_SQL_SCHEMA.includes('REVOKE ALL'));
});
test('absent cloud connection cannot report successful sync',async()=>{
 const result=await supabaseTestService.runTest();assert.equal(result.success,false);assert.equal(result.readBackConfirmed,false);
});

test('failed database writes never pass as successful synchronization',async()=>{
 await assertSupabaseWrite(Promise.resolve({error:null}));
 await assert.rejects(assertSupabaseWrite(Promise.resolve({error:new Error('Permission denied')})));
});
