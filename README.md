# React + TypeScript + Vite

Task Summary:

- A Node.js script was created that reads websites.csv containing domain, title, phone, address, etc.

- For each row, a separate React app is generated automatically.

- Each app includes two sections:

- Hero Section – displays a title with a random word (Quick, Fast, or Speedy).

- Contact Section – shows the phone number and address from the CSV.

- Each app is created in its own folder (apps/foodexpress.com, apps/techhubbd.com, apps/bookbazaar.com).

- The script automatically generates all necessary files: package.json, vite.config.js, index.html, src/App.js, src/components/\*, and CSS.

- After running the script, you can start each app using npm start or npm run dev.

- All apps are built separately inside the build/ folder.

## Key Points:

- Automation: Multiple React apps are created and built in one go.

- CSV-driven: App content comes directly from the CSV file.

- Lightweight: No extra CSS frameworks are used.

- Dynamic Hero: Hero section uses a random word for the title.

## 7. Clone Repository

```bash
git clone https://github.com/Shariful134/task-frontend.git
cd task-frontend
npm install
npm run dev
```

## 8. Install Dependencies

```ts
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```
