import pool from "../db/pool";

async function main() {
  const result = await pool.query("SELECT current_database() AS db, now() AS time");
  console.log(result.rows[0]);
  await pool.end();
}

main();