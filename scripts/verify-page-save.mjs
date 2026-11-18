import assert from 'node:assert/strict';
import {mergePageHeader, savePageHeader, pageSaveContext} from '../src/page-save.js';
const snippet = (selector, preset='spiral') => '<script type="application/json" data-gallery-layout>\n'+JSON.stringify({v:1,selector,type:'gallery',options:{preset}})+'\n</script>';
const selected = snippet('#one');
const unrelated = '<!-- keep -->\n<script type="application/ld+json">{"@type":"WebSite"}</script>\n<script>gsap.to(".a", {x:20});</script>\n<style>.a{color:red}</style>';
const comment = '<!-- archived example: '+snippet('#one','wall')+' -->';
assert.equal(mergePageHeader(comment,selected),comment+'\n'+selected+'\n');
const other = snippet('#two','arc');
const header = unrelated+'\n'+snippet('#one','wall')+'\n'+other;
assert.equal(mergePageHeader(header,selected,true),unrelated+'\n\n'+other);
assert.equal(mergePageHeader(other,selected,true),other);
const merged = mergePageHeader(header,selected);
assert.equal(merged,unrelated+'\n'+selected+'\n'+other);
assert.equal(mergePageHeader(merged,selected),merged);
assert.equal(mergePageHeader(unrelated,selected),unrelated+'\n'+selected+'\n');
assert.equal(mergePageHeader('',selected),selected+'\n');
assert.equal(mergePageHeader(header+'\n'+snippet('#one','ring'),selected),merged+'\n');
assert.throws(()=>mergePageHeader('<script type="application/json" data-gallery-layout>{bad}</script>',selected),/invalid JSON/);
assert.throws(()=>pageSaveContext({Static:{},document:{cookie:''}}),/Open this page/);
const context={collectionId:'a'.repeat(24),websiteId:'b'.repeat(24),crumb:'test'};
const base={id:context.collectionId,websiteId:context.websiteId,headerInjectCode:header,title:'Keep title',urlId:'keep-slug',seoDescription:'keep SEO',passwordProtected:true,password:'keep password'};
function fixture({conflict=false,mismatch=false,reject=false,readback=false,network=false}={}) {
 let model=structuredClone(base), reads=0, writes=0, backup;
 const fetchImpl=async(url,options)=>{
  if(options.method==='POST'){
   writes++;
   assert.equal(options.headers['X-CSRF-Token'],'test');
   const body=JSON.parse(options.body);
   assert.deepEqual(body.memberAreaData,{keep:'membership'});
   assert.deepEqual(body.collectionData,{...base,collectionId:context.collectionId,headerInjectCode:merged});
   if(network) throw Error('connection lost');
   if(!reject)model={...body.collectionData,headerInjectCode:body.collectionData.headerInjectCode.trim()};
   return {ok:!reject};
  }
  reads++;
  if(readback&&reads===3) throw Error('offline');
  return {ok:true,json:async()=>({collectionData:{...model,...(mismatch?{id:'c'.repeat(24)}:{}),...(conflict&&reads===2?{title:'Other editor changed it'}:{})},memberAreaData:{keep:'membership'}})};
 };
 return {fetchImpl,onBackup:value=>backup=value, get writes(){return writes},get backup(){return backup}};
}
const success=fixture();
await savePageHeader({snippet:selected,context,fetchImpl:success.fetchImpl,onBackup:success.onBackup});
assert.equal(success.writes,1);
assert.equal(success.backup.header,header);
for(const [flags,pattern,writes] of [
 [{conflict:true},/changed while saving/,0], [{mismatch:true},/do not match/,0],
 [{reject:true},/rejected/,1], [{readback:true},/could not be verified/,1],
 [{network:true},/could not be confirmed/,1],
]) {
 const f=fixture(flags);
 await assert.rejects(savePageHeader({snippet:selected,context,fetchImpl:f.fetchImpl}),pattern);
 assert.equal(f.writes,writes);
}
console.log('Verified page save merging, independent galleries, backups, metadata preservation, conflicts, authentication, rejection, and uncertain writes.');
