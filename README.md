# Power T

Transform your data into powerful visualizations. This monorepo contains three main components:
- API Server (Fastify)
- Web App (Next.js)
- Office Add-in (Static HTML/JS)

## Initial Setup

1. Install dependencies for all components:
```bash
cd api && npm install
cd ../web && npm install
cd ../addin && npm install
```

## Running the Services

1. Start the API server (port 8080):
```bash
cd api
npm run dev
```

2. Start the web app (port 3001):
```bash
cd web
npm run dev
```

3. Serve the Office Add-in files (port 4000):
```bash
cd addin
npm start
```

## Accessing the Services

- API Server: http://127.0.0.1:8080
  - Test endpoint: http://127.0.0.1:8080/charts/test

- Web App: http://localhost:3001
  - Shows waterfall chart demo

- Office Add-in: http://127.0.0.1:4000/taskpane.html
  - Use manifest.xml to sideload in PowerPoint

## Development Notes

- The API server uses TypeScript and hot reloading via ts-node-dev
- Web app uses Next.js 14 with React 18
- Add-in uses vanilla JavaScript and Office.js for PowerPoint integration
- Charts are rendered using the @chartcraft/charts-core package