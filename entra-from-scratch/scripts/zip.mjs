import fs from 'node:fs';
import path from 'node:path';
export function createZip(root) {
function walk(dir) { return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e=> { if (['runs','target','node_modules','.qa','dist','.angular','.env','config.json'].includes(e.name)) return []; const p=path.join(dir,e.name); return e.isDirectory()?walk(p):[p]; }); }
// A dependency-free ZIP writer, using the standard stored method and CRC32.
function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) {
    crc ^= b;
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
const local = [],
  central = [];
let offset = 0;
const files = walk(path.join(root, 'labs'));
for (const f of files) {
  const name = Buffer.from(path.relative(root, f).replaceAll('\\', '/'));
  const body = fs.readFileSync(f);
  const crc = crc32(body);
  const h = Buffer.alloc(30);
  h.writeUInt32LE(0x04034b50);
  h.writeUInt16LE(20, 4);
  h.writeUInt16LE(0x800, 6);
  h.writeUInt16LE(0x5d4f, 12);
  h.writeUInt32LE(crc, 14);
  h.writeUInt32LE(body.length, 18);
  h.writeUInt32LE(body.length, 22);
  h.writeUInt16LE(name.length, 26);
  local.push(h, name, body);
  const c = Buffer.alloc(46);
  c.writeUInt32LE(0x02014b50);
  c.writeUInt16LE(20, 4);
  c.writeUInt16LE(20, 6);
  c.writeUInt16LE(0x800, 8);
  c.writeUInt16LE(0x5d4f, 14);
  c.writeUInt32LE(crc, 16);
  c.writeUInt32LE(body.length, 20);
  c.writeUInt32LE(body.length, 24);
  c.writeUInt16LE(name.length, 28);
  c.writeUInt32LE(offset, 42);
  central.push(c, name);
  offset += h.length + name.length + body.length;
}
const cd = Buffer.concat(central),
  end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50);
end.writeUInt16LE(files.length, 8);
end.writeUInt16LE(files.length, 10);
end.writeUInt32LE(cd.length, 12);
end.writeUInt32LE(offset, 16);
fs.writeFileSync(path.join(root, 'downloads/entra-labs.zip'), Buffer.concat([...local, cd, end]));

}
