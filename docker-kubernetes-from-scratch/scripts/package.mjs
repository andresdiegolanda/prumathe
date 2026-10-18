import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {deflateRawSync} from 'node:zlib';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const excluded=new Set(['.git','.qa','target','node_modules','release','dist','.wrangler','kubeconfig','__pycache__']);
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
  if(excluded.has(e.name)||e.name==='.env'||e.name.endsWith('.log'))return [];
  const file=path.join(dir,e.name);return e.isDirectory()?walk(file):[file];
});}
function crc32(buf){let crc=0xffffffff;for(const b of buf){crc^=b;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;}
function zip(files,base,prefix,destination){const local=[],central=[];let offset=0;
  for(const file of files){const name=Buffer.from(prefix+path.relative(base,file).replaceAll('\\','/')),raw=fs.readFileSync(file),body=deflateRawSync(raw),crc=crc32(raw);
    const h=Buffer.alloc(30);h.writeUInt32LE(0x04034b50);h.writeUInt16LE(20,4);h.writeUInt16LE(0x800,6);h.writeUInt16LE(8,8);h.writeUInt16LE(0x5d4f,12);h.writeUInt32LE(crc,14);h.writeUInt32LE(body.length,18);h.writeUInt32LE(raw.length,22);h.writeUInt16LE(name.length,26);local.push(h,name,body);
    const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt16LE(0x800,8);c.writeUInt16LE(8,10);c.writeUInt16LE(0x5d4f,14);c.writeUInt32LE(crc,16);c.writeUInt32LE(body.length,20);c.writeUInt32LE(raw.length,24);c.writeUInt16LE(name.length,28);c.writeUInt32LE(offset,42);central.push(c,name);offset+=h.length+name.length+body.length;
  }
  const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(files.length,8);end.writeUInt16LE(files.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
  fs.writeFileSync(destination,Buffer.concat([...local,directory,end]));console.log(`${path.relative(root,destination)}: ${files.length} files`);
}
fs.mkdirSync(path.join(root,'release'),{recursive:true});
zip(walk(root),root,'docker-kubernetes-from-scratch/',path.join(root,'release','docker-kubernetes-from-scratch.zip'));
const dist=path.join(root,'dist');if(!fs.existsSync(dist))throw new Error('Run npm run build first');
zip(walk(dist),dist,'',path.join(root,'release','cloudflare-pages.zip'));
