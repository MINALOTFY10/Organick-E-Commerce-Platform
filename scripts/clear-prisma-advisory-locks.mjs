import "dotenv/config";
import { Client } from "pg";

const client = new Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();

  const lockRes = await client.query(`
    SELECT a.pid, a.state, a.query_start, a.query
    FROM pg_locks l
    JOIN pg_stat_activity a ON a.pid = l.pid
    WHERE l.locktype = 'advisory'
      AND l.granted = true
      AND a.datname = current_database()
      AND a.pid <> pg_backend_pid()
  `);

  if (lockRes.rowCount === 0) {
    console.log("No granted advisory locks found for other sessions.");
    process.exit(0);
  }

  console.log(`Found ${lockRes.rowCount} advisory lock holder(s). Terminating...`);

  for (const row of lockRes.rows) {
    const termRes = await client.query("SELECT pg_terminate_backend($1) AS terminated", [row.pid]);
    console.log(`PID ${row.pid}: terminated=${termRes.rows[0]?.terminated}`);
  }
} catch (error) {
  console.error(error);
  process.exit(1);
} finally {
  await client.end();
}
