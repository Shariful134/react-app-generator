const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { execSync } = require("child_process");

// if folder exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Read CSV
const csvFile = path.resolve(process.cwd(), "websites.csv");
if (!fs.existsSync(csvFile)) {
  console.error("Error: websites.csv not found!");
  process.exit(1);
}
const csvData = fs.readFileSync(csvFile, "utf-8");
const rows = parse(csvData, { columns: true, skip_empty_lines: true });

// Hero
const heroWords = ["Quick", "Fast", "Speedy"];

//  React apps Generate
rows.forEach((r) => {
  const domain = r.domain.trim();
  if (!domain) return;

  const appDir = path.resolve(process.cwd(), "build", domain);
  console.log("Generating app for", domain);

  ensureDir(appDir);
  ensureDir(path.join(appDir, "src"));
  ensureDir(path.join(appDir, "src", "components"));

  // package.json
  const pkg = {
    name: domain,
    private: true,
    version: "0.0.0",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
    },
    dependencies: {
      react: "^18.2.0",
      "react-dom": "^18.2.0",
    },
    devDependencies: {
      vite: "^5.3.0",
      "@vitejs/plugin-react": "^4.7.0",
    },
  };
  fs.writeFileSync(
    path.join(appDir, "package.json"),
    JSON.stringify(pkg, null, 2)
  );

  // vite.config.js
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, '../../build/${domain}'),
    emptyOutDir: true
  }
});`;
  fs.writeFileSync(path.join(appDir, "vite.config.js"), viteConfig);

  // index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${r.title || domain}</title>
</head>
<body>
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(appDir, "index.html"), indexHtml);

  // src/main.jsx
  const mainJsx = `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
  fs.writeFileSync(path.join(appDir, "src/main.jsx"), mainJsx);

  // src/components/Heading.jsx
  const randomWord = heroWords[Math.floor(Math.random() * heroWords.length)];
  const headingJsx = `import React from 'react';
export default function Heading() {
  return <h1>${randomWord} delivery service in Dhaka.</h1>;
}`;
  fs.writeFileSync(path.join(appDir, "src/components/Heading.jsx"), headingJsx);

  // src/components/Contact.jsx
  const contactJsx = `import React from 'react';
export default function Contact() {
  return (
    <>
      <p>Phone: ${r.phone}</p>
      <p>Address: ${r.address}</p>
    </>
  );
}`;
  fs.writeFileSync(path.join(appDir, "src/components/Contact.jsx"), contactJsx);

  // src/App.jsx
  const appJsx = `import React from 'react';
import Heading from './components/Heading.jsx';
import Contact from './components/Contact.jsx';

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', padding: 20 }}>
      <section style={{ padding: '40px 0' }} className="hero">
        <Heading />
      </section>
      <section style={{ padding: '20px 0' }} className="contact">
        <Contact />
      </section>
    </div>
  );
}`;
  fs.writeFileSync(path.join(appDir, "src/App.jsx"), appJsx);

  // src/styles.css
  const styles = `html, body, #root {
  height: 100%;
  margin: 0;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
}
.hero h1 {
  font-size: 2rem;
  font-weight: bold;
}
.contact p {
  margin: 0.5rem 0;
}`;
  fs.writeFileSync(path.join(appDir, "src/styles.css"), styles);

  // Auto npm install
  console.log("Installing dependencies...");
  try {
    execSync("npm install --legacy-peer-deps", {
      cwd: appDir,
      stdio: "inherit",
    });
  } catch (err) {
    console.error(" npm install failed for", domain);
  }
});

console.log(" All apps generated successfully!");
