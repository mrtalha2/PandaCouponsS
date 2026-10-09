const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'favicon.svg');
const svgBuffer = fs.readFileSync(svgPath);

// Helper to assemble standard ICO from multiple PNG buffers
function createIco(pngBuffers) {
  // ICO header: 6 bytes (2 reserved, 2 type = 1, 2 count)
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(count, 4); // number of images

  let offset = 6 + count * 16;
  const dirEntries = [];
  const imageDatas = [];

  for (const item of pngBuffers) {
    const { width, height, buffer } = item;
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // palette colors
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset of image data

    dirEntries.push(entry);
    imageDatas.push(buffer);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageDatas]);
}

async function generate() {
  console.log('✨ Generating complete favicon and touch icon set from new logo...');

  // 1. 16x16 PNG
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);
  console.log('  ✓ Generated favicon-16x16.png');

  // 2. 32x32 PNG
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
  console.log('  ✓ Generated favicon-32x32.png');

  // 3. 48x48 PNG for ICO
  const png48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();

  // 4. Multi-size favicon.ico
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 }
  ]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('  ✓ Generated multi-size favicon.ico (16, 32, 48px)');

  // 5. Apple Touch Icon (180x180 with rounded-safe dark background & padding)
  const innerMark = await sharp(svgBuffer).resize(136, 136).png().toBuffer();
  const appleTouch = await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 11, g: 11, b: 12, alpha: 1 }
    }
  })
    .composite([{ input: innerMark, top: 22, left: 22 }])
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouch);
  console.log('  ✓ Generated apple-touch-icon.png (180x180)');

  // 6. Android Chrome 192x192
  const android192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'android-chrome-192x192.png'), android192);
  console.log('  ✓ Generated android-chrome-192x192.png');

  // 7. Android Chrome 512x512
  const android512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'android-chrome-512x512.png'), android512);
  console.log('  ✓ Generated android-chrome-512x512.png');

  // 8. Web App Manifest
  const manifest = {
    name: "Panda Express Coupons",
    short_name: "Panda Express",
    icons: [
      { src: "/public/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/public/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    theme_color: "#C8102E",
    background_color: "#0B0B0C",
    display: "standalone"
  };
  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2), 'utf8');
  console.log('  ✓ Generated site.webmanifest');

  console.log('\n🎉 Complete favicon asset suite generated successfully!');
}

generate().catch(err => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
