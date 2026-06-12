# Lazarus MCP Landing Page

Premium one-page Next.js + Tailwind landing page for the Lazarus MCP hackathon submission.

## Local Development

```bash
npm install
npm run dev
```

From the repository root:

```bash
npm run landing:dev
npm run landing:build
```

## Vercel Deployment

1. Connect the GitHub repository to Vercel.
2. Set the Vercel project root to `apps/web`.
3. Use framework preset: `Next.js`.
4. Use build command: `npm run build`.
5. Leave output handling to Next.js/Vercel.

No backend, auth, database, or environment variables are required.
