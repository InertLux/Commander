//FramBunderl.js
import path from 'path';
import fs from 'fs';


export class FrameBundler {
  constructor(baseDir) {
    this.baseDir = baseDir;
  }

  resolveImport(fromFile, importPath) {
    let resolved = importPath;
    if (!resolved.endsWith('.js') && !resolved.endsWith('.css')) {
      resolved += '.js';
    }
    const dir = path.dirname(fromFile);
    return path.resolve(dir, resolved);
  }

  bundleJs(filePath, bundled = new Set()) {
    if (bundled.has(filePath)) return '';
    bundled.add(filePath);

    let content = fs.readFileSync(filePath, 'utf8');
    const importRegex = /import\s+(?:{[^}]*}|.*?)\s+from\s+['"]([^'"]+)['"]/g;
    
    const deps = [];
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (importPath.startsWith('.')) {
        const resolved = this.resolveImport(filePath, importPath);
        if (fs.existsSync(resolved)) {
          deps.push(this.bundleJs(resolved, bundled));
        }
      }
    }

    content = content.replace(importRegex, '');
    return [...deps, content].join('\n');
  }

  bundleCss(filePath, bundled = new Set()) {
    if (bundled.has(filePath)) return '';
    bundled.add(filePath);

    let content = fs.readFileSync(filePath, 'utf8');
    const importRegex = /@import\s+url\(['"]([^'"]+)['"]\)/g;
    
    const deps = [];
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (importPath.startsWith('.')) {
        const resolved = this.resolveImport(filePath, importPath);
        if (fs.existsSync(resolved)) {
          deps.push(this.bundleCss(resolved, bundled));
        }
      }
    }

    content = content.replace(importRegex, '');
    return [...deps, content].join('\n');
  }

  buildFrame(frameName, config) {
    const htmlPath = path.join(this.baseDir, `${frameName}/${frameName}.html`);
    const jsPath = path.join(this.baseDir, `${frameName}/${frameName}.js`);
    const cssPath = path.join(this.baseDir, `${frameName}/${frameName}.css`);

    // If HTML exists, serve it as-is with bundled dependencies
    if (fs.existsSync(htmlPath)) {
      let html = fs.readFileSync(htmlPath, 'utf8');
      
      // Bundle any local JS imports in the HTML
      const scriptRegex = /<script[^>]+src=["']\.\/([^"']+)["'][^>]*><\/script>/g;
      html = html.replace(scriptRegex, (match, importPath) => {
        const resolved = this.resolveImport(htmlPath, importPath);
        if (fs.existsSync(resolved)) {
          const bundled = this.bundleJs(resolved);
          return `<script>\n${bundled}\n</script>`;
        }
        return match;
      });

      // Inject config
      html = html.replace('</head>', `<script>const FRAME_CONFIG = ${JSON.stringify(config)};</script>\n</head>`);
      
      return html;
    }

    // Fallback: if only JS/CSS exist, generate HTML
    if (!fs.existsSync(jsPath) || !fs.existsSync(cssPath)) {
      throw new Error(`Frame files missing for ${frameName}`);
    }

    const js = this.bundleJs(jsPath);
    const css = this.bundleCss(cssPath);

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  <style>
${css}
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    const FRAME_CONFIG = ${JSON.stringify(config)};
    ${js}
  </script>
</body>
</html>`;
  }
}

export default FrameBundler;
