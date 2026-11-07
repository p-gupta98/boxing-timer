import { describe, it, expect, afterAll } from "vitest";
import pool from "../../src/db/pool";

afterAll(async () => {
  await pool.end();
});

describe("database connection", () => {
  it("connects to the test database", async () => {
    const result = await pool.query("SELECT current_database() AS db");
    expect(result.rows[0].db).toBe("boxing_test");
  });
});