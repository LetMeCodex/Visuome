import { deflateSync } from "node:zlib";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type);
  const output = Buffer.alloc(12 + data.length);
  output.writeUInt32BE(data.length, 0);
  name.copy(output, 4);
  data.copy(output, 8);
  output.writeUInt32BE(crc32(Buffer.concat([name, data])), 8 + data.length);
  return output;
}

function renderIcon(size) {
  const data = Buffer.alloc((size * 4 + 1) * size);
  const center = (size - 1) / 2;
  const radius = size * 0.46;
  for (let y = 0; y < size; y += 1) {
    const row = y * (size * 4 + 1);
    data[row] = 0;
    for (let x = 0; x < size; x += 1) {
      const offset = row + 1 + x * 4;
      const dx = x - center;
      const dy = y - center;
      const distance = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const inside = distance < radius;
      const ring = Math.abs(distance - radius * 0.72) < Math.max(1.1, size * 0.035);
      const helixA = Math.abs(dx - Math.sin((dy / size) * Math.PI * 4) * size * 0.16) < Math.max(0.8, size * 0.035);
      const helixB = Math.abs(dx + Math.sin((dy / size) * Math.PI * 4) * size * 0.16) < Math.max(0.8, size * 0.035);
      const bridge = Math.abs((dy + center) % Math.max(4, Math.round(size * 0.18))) < Math.max(1, size * 0.025) && Math.abs(dx) < size * 0.16;
      const glow = Math.max(0, 1 - distance / radius);
      const t = (angle + Math.PI) / (Math.PI * 2);
      const cyan = [93, 228, 244];
      const violet = [139, 124, 255];
      const mix = cyan.map((value, i) => Math.round(value * (1 - t) + violet[i] * t));
      const mark = inside && (ring || helixA || helixB || bridge);
      data[offset] = mark ? mix[0] : Math.round(7 + glow * 7);
      data[offset + 1] = mark ? mix[1] : Math.round(9 + glow * 10);
      data[offset + 2] = mark ? mix[2] : Math.round(15 + glow * 18);
      data[offset + 3] = inside ? 255 : 0;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([signature, chunk("IHDR", ihdr), chunk("IDAT", deflateSync(data)), chunk("IEND", Buffer.alloc(0))]);
}

const output = resolve("public");
await mkdir(output, { recursive: true });
await Promise.all([16, 48, 128].map((size) => writeFile(resolve(output, `icon${size}.png`), renderIcon(size))));
