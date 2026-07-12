// ============================================================================
// server.ts — FROZEN after Hour 0
// HTTP server entry point.
// ============================================================================

import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ TransitOps API running on http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
});
