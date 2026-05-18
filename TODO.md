# TODO - Render + Production Fixes

- [ ] Update backend/package.json scripts to use `npm start` for Render.
- [ ] Replace backend/server.js with production-safe startup (no crash on Mongo failure; proper logging; health routes).
- [ ] Update render.yaml: backend startCommand -> `npm start`; fix build/start for both services.
- [ ] Add CORS config compatible with production and localhost.
- [ ] Ensure required env vars are validated at startup with clear logs (JWT_SECRET, OPENROUTER_API_KEY optional, MONGO_URI required).
- [ ] Verify local start still works: `npm run dev` in backend.
- [ ] Provide final deployment checklist.

