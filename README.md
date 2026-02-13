### Build By Shivam Chamoli ###

// cd client
-> npm install
-> npm run dev

// cd server
-> npm install
-> npm run dev


### Environment variables

The React app uses `VITE_API_BASE_URL` to determine where to reach the backend. Examples:

```env
# development (client/.env.local)
VITE_API_BASE_URL=http://localhost:5000/api
```

When you deploy the frontend (e.g. Vercel) set `VITE_API_BASE_URL` to the full backend URL including `/api`, e.g.

```
https://job-hub-full-stack-job-portal-backe.vercel.app/api
```

Using the shared `api` helper ensures pages (like the landing page) will automatically use the correct URL in both environments and avoid hard‑coded `localhost` calls.

The server also has its own `.env` values such as `MONGO_URI`, `JWT_SECRET`, etc.

