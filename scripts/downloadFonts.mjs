import fs from "fs";
import path from "path";
import https from "https";

const fontsDir = path.join("src", "styles", "fonts");
fs.mkdirSync(fontsDir, { recursive: true });

const cssUrl = "https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;800;900&family=Manrope:wght@400;500;600;700&display=swap";

// Fetch CSS with a modern user agent so Google Fonts returns woff2 files
const options = {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  }
};

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close();
        resolve();
      });
    }).on("error", reject);
  });
}

https.get(cssUrl, options, (res) => {
  let data = "";
  res.on("data", (chunk) => { data += chunk; });
  res.on("end", async () => {
    try {
      // Find all font-face blocks
      const fontFaceRegex = /@font-face\s*\{[^}]*\}/g;
      const blocks = data.match(fontFaceRegex) || [];
      
      let localCss = "";
      
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        
        // Extract font-family, font-weight, font-style, and src url
        const familyMatch = block.match(/font-family:\s*['"]?([^'";]+)['"]?/);
        const weightMatch = block.match(/font-weight:\s*([^;]+)/);
        const srcMatch = block.match(/url\((https:\/\/[^)]+)\)/);
        
        if (familyMatch && weightMatch && srcMatch) {
          const family = familyMatch[1];
          const weight = weightMatch[1].trim();
          const url = srcMatch[1];
          
          // Generate local filename
          const filename = `${family.replace(/\s+/g, "")}-${weight}.woff2`.toLowerCase();
          const destPath = path.join(fontsDir, filename);
          
          console.log(`Downloading ${family} (Weight: ${weight}) -> ${filename}...`);
          await downloadFile(url, destPath);
          
          // Construct local font-face rule
          const localBlock = `
@font-face {
  font-family: '${family}';
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url('./fonts/${filename}') format('woff2');
}
`;
          localCss += localBlock;
        }
      }
      
      fs.writeFileSync(path.join("src", "styles", "fonts.css"), localCss.trim());
      console.log("Success! Local fonts.css written.");
    } catch (err) {
      console.error("Error processing fonts:", err);
    }
  });
}).on("error", (err) => {
  console.error("Failed to fetch Google Fonts CSS:", err);
});
